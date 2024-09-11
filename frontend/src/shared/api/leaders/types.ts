export type GetLeaderListResponse = {
  error: boolean;
  payload: {
    leaders: {
      username: string;
      score: number;
    }[];
  } | null;
};

export type LeadersApi = {
  getList: () => Promise<GetLeaderListResponse>; // Adjusted to match native fetch response
};
