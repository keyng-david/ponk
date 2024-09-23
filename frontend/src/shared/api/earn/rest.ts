import { EarnApi, GetEarnDataResponse, ResponseDefault, GetEarnDataResponseItem } from './types';
import { $sessionId } from "@/shared/model/session";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ResponseDefault<T>> {
  if (!response.ok) {
    const errorText = await response.text();
    return { error: true, payload: null };
  }

  try {
    const data = await response.json();
    return { error: false, payload: data };
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return { error: true, payload: null };
  }
}

// Helper function to make API requests with session ID for authorization
async function apiRequest<T>(endpoint: string, method: 'GET' | 'POST', body?: any): Promise<ResponseDefault<T>> {
  const sessionId = $sessionId; // Retrieve session ID from shared model
  if (!sessionId) {
    console.error("Session ID is not available.");
    return { error: true, payload: null };
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Session ${sessionId}`, // Include session ID in the Authorization header
      },
      body: body ? JSON.stringify(body) : null,
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error("API request failed:", error);
    return { error: true, payload: null };
  }
}

// Updated earnApi implementation
export const earnApi: EarnApi = {
  getData: async () => {
    const response = await apiRequest<{ tasks: GetEarnDataResponseItem[]; user_level: number }>('/api/earn/task', 'GET');

    // Handle the response to match the exact type expected
    if (response.error) {
      throw new Error("Failed to fetch earn data");
    }

    return response;  // Ensure the response matches the GetEarnDataResponse type
  },

  taskJoined: async (data) => {
    return await apiRequest<any>('/api/earn/complete_task', 'POST', data);
  },
};