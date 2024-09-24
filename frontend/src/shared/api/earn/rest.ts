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

// Custom hook to fetch sessionId and pass it to the API methods
export function useEarnApi() {
  const sessionId = useUnit($sessionId);

  if (!sessionId) {
    throw new Error('Session ID is missing');
  }

  // fetchData with sessionId passed as an argument
  async function fetchData<T>(url: string): Promise<ResponseDefault<T>> {
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

  // postData with sessionId passed as an argument
  async function postData<T>(url: string, body: any): Promise<ResponseDefault<T>> {
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

  // earnApi using fetchData and postData
  const earnApi: EarnApi = {
    getData: async () => {
      const response = await fetchData<{ tasks: GetEarnDataResponseItem[]; user_level: number }>('/api/earn/task.php');
      if (response.error) {
        throw new Error('Failed to fetch earn data');
      }
      return response as GetEarnDataResponse;
    },

    taskJoined: async (data: { id: number }) => {
      return await postData<any>('/api/earn/complete_task.php', data);
    },
  };

  return {
    getData: earnApi.getData,
    taskJoined: earnApi.taskJoined,
  };
}