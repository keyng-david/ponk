import { LeadersApi, GetLeaderListResponse } from './types';
import { $sessionId } from '@/shared/model/session';

export const leadersApi: LeadersApi = {
  async getList() {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/api/leaders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });

    const data = await response.json();

    // Ensure the data conforms to GetLeaderListResponse
    const result: GetLeaderListResponse = {
      error: data.error,
      payload: {
        leaders: data.payload.leaders,
        userLeaderData: data.payload.userLeaderData || null, // Ensure userLeaderData is included
      },
    };

    return result;
  },
};