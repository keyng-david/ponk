import React, { createContext, useContext, useEffect, useState } from 'react';
import { clickerModel } from "@/features/clicker/model";
import { socketResponseToJSON } from "@/shared/lib/utils/socketResponseToJSON";
import { $sessionId } from "@/shared/model/session";
import { useUnit } from 'effector-react';

const PointContext = createContext<any>(null);

export const usePoints = () => useContext(PointContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [points, setPoints] = useState<number>(0);
  const sessionId = useUnit($sessionId); // Get session ID from the session store

  useEffect(() => {
    const eventSource = new EventSource('sse.php'); // Listening to the SSE backend

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

  const incrementPoints = async (newPoints: number) => {
    try {
      // Ensure that the sessionId is included when making the request
      const response = await fetch('/increment_points.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, points: newPoints }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setPoints(result.points);
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
