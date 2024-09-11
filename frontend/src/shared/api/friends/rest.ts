import { FriendsApi } from './types';
import { $sessionId } from "@/shared/model/session";

export const friendsApi: FriendsApi = {
  getFriends: async () => {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/api/friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });
    const data = await response.json();
    return data;
  },
};
