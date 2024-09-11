const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports.createUserIfNotExists = async function (telegramId) {
  try {
    // Fetch existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // If error is something other than user not found
      return { error: fetchError.message };
    }

    if (existingUser) {
      // If the user already exists, return the existing data
      return { data: existingUser };
    }

    // If user doesn't exist, create a new record
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        telegram_id: telegramId,
        score: 0, // default value
        level: 0, // default value
        wallet: '', // default value
        available_clicks: 500, // default value as per model/index
      })
      .select()
      .single();

    if (insertError) {
      return { error: insertError.message };
    }

    return { data: newUser };

  } catch (err) {
    console.error('Error handling user creation:', err);
    return { error: 'An unexpected error occurred.' };
  }
};

/**
 * Update the session ID for a given user.
 * @param {number} telegramId - The user's Telegram ID.
 * @param {string} sessionId - The new session ID.
 * @returns {Promise<string | null>} - An error message or null if successful.
 */
module.exports.updateSessionId = async function (telegramId, sessionId) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ session_id: sessionId })
      .eq('telegram_id', telegramId);

    if (error) {
      return error.message;
    }
    
    return null;
  } catch (err) {
    console.error('Error updating session ID:', err);
    return 'An unexpected error occurred.';
  }
};