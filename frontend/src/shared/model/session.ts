import { createEvent, createStore } from "effector";
import { useUnit } from "effector-react";

// Event to set the session ID
const setSessionId = createEvent<string | null>();

// Store to hold the session ID globally
const $sessionId = createStore<string | null>(null).on(setSessionId, (_, sessionId) => sessionId);

// Expose both the event to update the session ID and the store itself
export { $sessionId, setSessionId };

// Hook to use the session ID
export const useSessionId = () => {
  const sessionId = useUnit($sessionId); // Get session ID from store

  const set = (newSessionId: string) => {
    setSessionId(newSessionId); // Update the session ID globally
  };

  const remove = () => {
    setSessionId(null); // Clear the session ID
  };

  return { sessionId, set, remove }; // Return session ID, set, and remove functions
};