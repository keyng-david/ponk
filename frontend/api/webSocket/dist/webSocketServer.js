"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
// Initialize Express app and HTTP server
const app = (0, express_1.default)();
const server = http.createServer(app);
// Serve HTTP GET request at root for Heroku's health check
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});
// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
// Initialize Socket.io server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});
const PORT = Number(process.env.PORT) || 8080;
// WebSocket connection logic
io.on('connection', (socket) => {
    console.log('Client connected', socket.id);
    // Realtime subscription to Supabase changes
    const channel = supabase.channel('public:users');
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        console.log('Change received:', payload);
        const roomId = payload.new?.session_id || payload.old?.session_id;
        if (roomId) {
            // Broadcast changes to the specific room
            io.to(roomId).emit('user_update', { type: 'user_update', data: payload });
            console.log(`Broadcasted update to room ${roomId}`);
        }
        else {
            console.log('No session_id found in payload, not broadcasting');
        }
    });
    channel.subscribe();
    // Handle incoming message from client
    socket.on('message', async (message) => {
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
                }
                else {
                    socket.emit('success', { success: true });
                }
            }
        }
        catch (err) {
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
//# sourceMappingURL=webSocketServer.js.map