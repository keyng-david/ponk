import { FriendsApi, ResponseDefault, GetFriendsResponse } from './types';
import { $sessionId } from "@/shared/model/session";

export const friendsApi: FriendsApi = {
  getFriends: async (): Promise<ResponseDefault<GetFriendsResponse>> => {
    const sessionId = $sessionId.getState();
    const response = await fetch(`/api/friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });

    const data = await response.json();

    return {
      error: data.error || !data.payload,
      payload: data.payload || null,
    };
  },
};