import { LeadersApi } from './types';
import { $sessionId } from "@/shared/model/session";

export const leadersApi: LeadersApi = {
  getList: async () => {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/game/leaders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });
    return response.json();
  },
};
