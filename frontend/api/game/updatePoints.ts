const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Establish SSE connection for real-time updates
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to push updates to the client
    const pushUpdate = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Listen to changes from Supabase using a subscription
    const subscription = supabase
      .from('users')
      .on('UPDATE', (payload) => {
        if (payload.new) {
          pushUpdate({
            score: payload.new.score,
            available_clicks: payload.new.available_clicks,
          });
        }
      })
      .subscribe();

    // Clean up the subscription when the client disconnects
    req.on('close', () => {
      supabase.removeSubscription(subscription);
      res.end();
    });
  } else if (req.method === 'POST') {
    // Handle the points update request
    const { session_id, earnedPoint } = req.body;

    if (!session_id || typeof earnedPoint !== 'number' || earnedPoint < 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      // Update the user's score in Supabase
      const { error: functionError } = await supabase.rpc('scoreupdate', {
        session_id,
        earnedpoint: earnedPoint,
      });

      if (functionError) {
        console.error('Error executing ScoreUpdate function:', functionError);
        return res.status(500).json({ error: 'Failed to update user score', details: functionError.message });
      }

      // Respond to the POST request
      res.status(200).json({ success: true, message: 'Points updated successfully' });
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Unexpected error occurred', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};