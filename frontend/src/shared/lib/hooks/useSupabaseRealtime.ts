import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useGameData } from "@/shared/lib/hooks/useGameData";  // Import your state management hook

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);  // Correctly initialize the client

const useSupabaseRealtime = (sessionId: string) => {
  const { updateScoreAndAvailable } = useGameData(); // Destructure update function from your custom hook

  useEffect(() => {
    const channel = supabase
      .from(`users:session_id=eq.${sessionId}`)  // Create a subscription to a specific row in the "users" table
      .on('UPDATE', (payload) => {
        console.log('Realtime update received:', payload);

        // Extract updated data
        const { new: newRecord } = payload;
        if (newRecord) {
          // Update the UI or state with the new data
          const updatedScore = newRecord.score;
          const updatedAvailableClicks = newRecord.available_clicks;

          // Update local states using your state management
          updateScoreAndAvailable(updatedScore, updatedAvailableClicks);
        }
      })
      .subscribe();

    // Cleanup function to unsubscribe from the channel
    return () => {
      channel.unsubscribe();
    };
  }, [sessionId, updateScoreAndAvailable]); // Ensure updateScoreAndAvailable is added to the dependency array
};

export default useSupabaseRealtime;