import { CLICK_STEP, clickerModel } from "@/features/clicker/model";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "effector-react";
import { $sessionId } from "@/shared/model/session";

export const SocketContext = createContext<{
  accumulatePoints: (points: number) => void;
  debounceSendPoints: () => void;
}>({
  accumulatePoints: () => {},
  debounceSendPoints: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = React.memo<React.PropsWithChildren>(({ children }) => {
  const sessionId = useStore($sessionId);
  const [earnedPoint, setEarnedPoint] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Establish SSE connection to listen for updates
    const eventSource = new EventSource("/api/game/updatePoints");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        // Trigger events to update state in Effector
        clickerModel.valueInited(data.score);  // Use the valueInited event to update the score
        clickerModel.availableInited(data.available_clicks);  // Use the availableInited event to update available clicks
      }
    };

    return () => {
      eventSource.close(); // Clean up when component unmounts
    };
  }, [sessionId]);

  // Function to accumulate points locally
  const accumulatePoints = (points: number) => {
    setEarnedPoint((prev) => prev + points + CLICK_STEP); // Ensure CLICK_STEP is always added
  };

  // Function to send points to the backend
  const sendPointUpdate = async () => {
    if (earnedPoint > 0) {
      // Store the current earnedPoint value
      const currentEarnedPoint = earnedPoint;

      // Immediately clear earned points before sending the request
      setEarnedPoint(0);

      try {
        const response = await fetch("/api/game/updatePoints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            earnedPoint: currentEarnedPoint, // Use stored earnedPoint value
          }),
        });

        const result = await response.json();
        if (response.status === 200 && result.success) {
          console.log("Points updated successfully.");
          // Clear currentEarnedPoint after successful backend confirmation
          setEarnedPoint(0); // This line is added for clarification, but it's redundant since we already cleared it before the request
        } else {
          console.error("Error updating points:", result.message || "Unknown error");
          // Optionally, restore the points in case of failure
          setEarnedPoint(currentEarnedPoint); // Restore points to retry later
        }
      } catch (error) {
        console.error("Error updating points:", error);
        // Restore points to retry later
        setEarnedPoint(currentEarnedPoint);
      }
    }
  };

  const debounceSendPoints = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(async () => {
      await sendPointUpdate();
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  return (
    <SocketContext.Provider value={{ accumulatePoints, debounceSendPoints }}>
      {children}
    </SocketContext.Provider>
  );
});