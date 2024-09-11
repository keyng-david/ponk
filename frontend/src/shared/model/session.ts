import { createEvent, createStore } from "effector";
import { useUnit } from "effector-react";

// Create a store to hold the session ID
const setSessionId = createEvent<string | null>();
const $sessionId = createStore<string | null>(null).on(setSessionId, (_, sessionId) => sessionId);

// Export the store and other hooks/functions
export { $sessionId }; // This line explicitly exports the $sessionId store

export const useSessionId = () => {
  const sessionId = useUnit($sessionId);

  const set = (newSessionId: string) => {
    setSessionId(newSessionId);
  };

  const remove = () => {
    setSessionId(null);
  };

  return { sessionId, set, remove };
};