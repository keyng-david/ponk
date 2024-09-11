import { EarnApi } from './types';
import { $sessionId } from "@/shared/model/session";

export const earnApi: EarnApi = {
  getData: async () => {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/api/earn/tasks`, {
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
    const response = await fetch(`/api/earn/completeTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    
    // Ensure a message field is present in the response
    if (!result.message) {
      return {
        error: result.error,
        message: result.error ? 'Task completion failed' : 'Task completed successfully'
      };
    }
    
    return result;
  },
};