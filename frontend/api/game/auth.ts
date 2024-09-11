const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Environment variables SUPABASE_URL and SUPABASE_KEY must be defined');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function authHandler(req, res) {
  console.log('Incoming request:', req.method, req.url);  // Log request method and URL

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);  // Log the method if it's not POST
    return res.status(405).json({ error: true, message: 'Method Not Allowed' });
  }

  // Extract the session ID from the request body
  const { sessionId } = req.body;

  if (!sessionId) {
    console.log('Unauthorized access attempt, missing session ID in body');  // Log unauthorized attempts
    return res.status(401).json({ error: true, message: 'Unauthorized, session ID is required' });
  }

  console.log('Fetching data for session_id:', sessionId);  // Log the session ID being used in the query

  const { data: userData, error } = await supabase
    .from('users')
    .select('score, available_clicks, wallet, level')
    .eq('session_id', sessionId)
    .single();

  if (error || !userData) {
    console.error('Database error:', error ? error.message : 'User not found');  // Log detailed database error or not found message
    return res.status(500).json({ error: true, message: 'Database error', details: error ? error.message : 'User not found' });
  }

  console.log('User data retrieved:', userData);  // Log the retrieved user data
  return res.status(200).json({ error: false, payload: userData });
};