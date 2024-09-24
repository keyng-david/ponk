import { useUnit } from 'effector-react';
import { $sessionId } from '@/shared/model/session';
import { EarnApi, GetEarnDataResponse, GetEarnDataResponseItem, ResponseDefault } from './types';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ResponseDefault<T>> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', errorText);
    return { error: true, payload: null };
  }

  try {
    const data: T = await response.json();
    return { error: false, payload: data };
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return { error: true, payload: null };
  }
}

// fetchData with sessionId as a dynamic argument
async function fetchData<T>(url: string, sessionId: string): Promise<ResponseDefault<T>> {
  if (!sessionId) {
    console.error('Session ID is missing or invalid.');
    return { error: true, payload: null };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Session ${sessionId}`, // Use session ID in Authorization header
      },
    });

    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Fetch request failed:', error);
    return { error: true, payload: null };
  }
}

// postData with sessionId as a dynamic argument
async function postData<T>(url: string, body: any, sessionId: string): Promise<ResponseDefault<T>> {
  if (!sessionId) {
    console.error('Session ID is missing or invalid.');
    return { error: true, payload: null };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Session ${sessionId}`, // Use session ID in Authorization header
      },
      body: JSON.stringify(body),
    });

    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Fetch request failed:', error);
    return { error: true, payload: null };
  }
}

// Updated earnApi to include sessionId as a dynamic argument
export const earnApi: EarnApi = {
  getData: async (sessionId: string) => {
    const response = await fetchData<{ tasks: GetEarnDataResponseItem[]; user_level: number }>('/api/earn/task.php', sessionId);
    if (response.error) {
      throw new Error('Failed to fetch earn data');
    }
    return response as GetEarnDataResponse;
  },

  taskJoined: async (data: any, sessionId: string) => {
    return await postData<any>('/api/earn/complete_task.php', data, sessionId);
  },
};

// Custom hook to use earnApi, dynamically fetching sessionId
export function useEarnApi() {
  const sessionId = useUnit($sessionId); // Get sessionId using Effector

  return {
    getData: async () => {
      if (!sessionId) {
        throw new Error('Session ID is missing');
      }
      return await earnApi.getData(sessionId);
    },
    taskJoined: async (data: any) => {
      if (!sessionId) {
        throw new Error('Session ID is missing');
      }
      return await earnApi.taskJoined(data, sessionId);
    },
  };
}