import { useState } from "react";

export const useErrorHandler = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setError = (error: string) => {
    setErrorMessage(error);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    errorMessage,
    setError,
    clearError,
  };
};