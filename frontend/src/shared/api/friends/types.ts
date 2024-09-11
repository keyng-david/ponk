export type GetFriendsResponse = {
  error: boolean;
  payload: {
    link: string;
    friends: number;
    score: number;
    default_reward: number;
    premium_reward: number;
  } | null;
};

export type FriendsApi = {
  getFriends: () => Promise<GetFriendsResponse>; // Adjusted to match native fetch response
};
