import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { clickerModel } from "@/features/clicker/model";
import { useUnit } from 'effector-react';

const PointContext = createContext<any>(null);

export const usePoints = () => useContext(PointContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [points, setPoints] = useState<number>(0);
  const sessionId = useUnit($sessionId); // Get session ID from the session store
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/game/sse.php'); // Listening to the SSE backend

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setPoints(data.points);

      // Update the model with new points data from the server
      clickerModel.availableUpdated(data.available_clicks);
      clickerModel.clicked({
        score: data.score,
        click_score: data.click_score,
        available_clicks: data.available_clicks,
      });
    };

    eventSource.onerror = function () {
      console.error('SSE connection error.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Function to update points to the backend
  const updatePoint = async () => {
    if (!sessionId) {
      console.error('No session ID found');
      return;
    }

    try {
      const response = await fetch('/api/game/update_points.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, points }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        console.log('Points successfully updated');
      } else {
        console.error('Failed to update points:', result.message);
      }
    } catch (error) {
      console.error('Error during point update:', error);
    }
  };

  // Debounce function to delay updating points
  const debounceUpdatePoint = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      updatePoint();
    }, 30000); // 30 seconds debounce

    setDebounceTimer(timer);
  }, [debounceTimer, sessionId, points]);

  // Handle disconnection or tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      updatePoint(); // Trigger point update on tab close
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [points, sessionId]);

  const incrementPoints = async (newPoints: number) => {
    if (!sessionId || newPoints === undefined) {
      console.error('Invalid session or points');
      return;
    }

    try {
      const response = await fetch('/api/game/increment_points.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, points: newPoints }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setPoints(result.points);
        debounceUpdatePoint(); // Start the debounce when points are incremented
      } else {
        console.error('Error incrementing points:', result.message);
      }
    } catch (error) {
      console.error('Failed to increment points:', error);
    }
  };

  return (
    <PointContext.Provider value={{ points, incrementPoints }}>
      {children}
    </PointContext.Provider>
  );
};