import { createClient } from '@supabase/supabase-js';
import { Server } from 'socket.io';
import express from 'express';
import * as http from 'http';

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Serve HTTP GET request at root for Heroku's health check
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize Socket.io server
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (configure as needed)
        methods: ['GET', 'POST'],
    }
});

const PORT = Number(process.env.PORT) || 8080;

// Define interface for payload structure
interface PayloadData {
    session_id?: string;
}

// WebSocket connection logic
io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // Realtime subscription to Supabase changes
    const channel = supabase.channel('public:users');
    channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
            console.log('Change received:', payload);
            const roomId = (payload.new as PayloadData)?.session_id || (payload.old as PayloadData)?.session_id;

            if (roomId) {
                // Broadcast changes to the specific room
                io.to(roomId).emit('user_update', { type: 'user_update', data: payload });
                console.log(`Broadcasted update to room ${roomId}`);
            } else {
                console.log('No session_id found in payload, not broadcasting');
            }
        }
    );
    channel.subscribe();

    // Handle incoming message from client
    socket.on('message', async (message: string) => {
        try {
            const { session_id } = JSON.parse(message);
            if (session_id) {
                // Validate session_id with database
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('session_id', session_id)
                    .single();

                if (error || !user) {
                    socket.emit('error', { error: 'Invalid session_id' });
                } else {
                    socket.emit('success', { success: true });
                }
            }
        } catch (err) {
            console.error('Error processing message:', err);
            socket.emit('error', { error: 'Server error' });
        }
    });

    // Handle disconnection and cleanup
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        channel.unsubscribe();
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Keep-alive ping to prevent Heroku timeout
setInterval(() => {
    io.emit('ping', { message: 'keep-alive' });
}, 50000); // 50 seconds to stay under the 55-second limit