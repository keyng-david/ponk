const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseKey || !jwtSecret) {
  throw new Error('Environment variables SUPABASE_URL, SUPABASE_KEY, and JWT_SECRET must be defined');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function tasksHandler(req, res) {
  const { method, body } = req;
  const { id } = body;

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid token' });
  }

  const userId = decoded.id;

  if (method === 'GET') {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: true, message: 'Database error', details: error.message });
    }

    return res.status(200).json({ error: false, payload: { tasks } });
  } else if (method === 'POST') {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !task) {
      return res.status(500).json({ error: true, message: 'Task not found', details: error?.message || 'Task not found' });
    }

    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (updateError) {
      return res.status(500).json({ error: true, message: 'Failed to complete task', details: updateError.message });
    }

    return res.status(200).json({ error: false, payload: { message: 'Task completed' } });
  }
};