export type GetLeaderListResponse = {
  error: boolean;
  payload: {
    leaders: {
      username: string;
      score: number;
    }[];
    userLeaderData: {
      position: number;
      username: string;
      score: number;
    } | null;
  } | null;
};

export type LeadersApi = {
  getList: () => Promise<GetLeaderListResponse>;
};