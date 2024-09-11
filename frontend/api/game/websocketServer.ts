const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to subscribe to updates
const subscribeToUpdates = (req, res) => {
  if (req.method === 'POST') {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const subscription = supabase
      .from('users')
      .on('UPDATE', (payload) => {
        if (payload.new && payload.new.session_id === session_id) {
          // Send real-time update to client via response
          console.log('Sending real-time update to client');
          res.write(`data: ${JSON.stringify({
            score: payload.new.score,
            available_clicks: payload.new.available_clicks,
          })}\n\n`);
        }
      })
      .subscribe();

    // Keep the connection open for real-time updates
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Remove subscription when client disconnects
    req.on('close', () => {
      console.log('Client disconnected, removing subscription');
      supabase.removeSubscription(subscription);
      res.end();
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

// Export the function using module.exports
module.exports = subscribeToUpdates;