import { EarnApi } from './types';
import { $sessionId } from "@/shared/model/session";

export const earnApi: EarnApi = {
  getData: async () => {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/game/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });
    return response.json();
  },
  taskJoined: async (body) => {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/game/completeTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },
};
