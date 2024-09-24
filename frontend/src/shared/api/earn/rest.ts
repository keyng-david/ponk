import { useUnit } from 'effector-react';
import { $sessionId } from '@/shared/model/session';
import { EarnApi, GetEarnDataResponse, GetEarnDataResponseItem, ResponseDefault } from './types';
import React from 'react';

// Custom hook to retrieve sessionId from Effector
export function useSessionId() {
  const sessionId = useUnit($sessionId);

  if (!sessionId) {
    console.error('Session ID is missing or invalid.');
    return null;
  }

  return sessionId;
}

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

// fetchData using sessionId from custom hook
export async function fetchData<T>(url: string, sessionId: string): Promise<ResponseDefault<T>> {
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

// postData using sessionId from custom hook
export async function postData<T>(url: string, body: any, sessionId: string): Promise<ResponseDefault<T>> {
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

// earnApi object using fetchData and postData
export const earnApi: EarnApi = {
  getData: async (): Promise<GetEarnDataResponse> => {
    const sessionId = useUnit($sessionId);
    if (!sessionId) {
      throw new Error('Session ID is missing');
    }
    
    const response = await fetchData<{ tasks: GetEarnDataResponseItem[]; user_level: number }>(
      '/api/earn/task.php',
      sessionId
    );

    if (response.error) {
      throw new Error('Failed to fetch earn data');
    }

    return {
      tasks: response.payload?.tasks || [],
      user_level: response.payload?.user_level || 0,
    };
  },

  taskJoined: async (data: any): Promise<any> => {
    const sessionId = useUnit($sessionId);
    if (!sessionId) {
      throw new Error('Session ID is missing');
    }
    return await postData<any>('/api/earn/complete_task.php', data, sessionId);
  },
};