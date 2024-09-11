export type GetFriendsResponse = {
  link: string;
  friends: number;
  score: number;
  default_reward: number;
  premium_reward: number;
};

export type ResponseDefault<T> = {
  error: boolean;
  payload: T | null;
};

export type FriendsApi = {
  getFriends: () => Promise<ResponseDefault<GetFriendsResponse>>; // Adjusted to wrap in ResponseDefault
};