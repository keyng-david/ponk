export type GetEarnDataResponseItem = {
  name: string;
  description: string;
  reward: string;
  reward1: string;
  reward2: string;
  reward3: string;
  reward_symbol: string;
  end_time: number;
  id: number;
  total_clicks: number;
  link: string;
  image_link: string;
  task_list: string[];
};

// Directly matches the backend response structure for tasks and user level
export type GetEarnDataResponse = {
  error: boolean; // Adjusted to fit the backend error response
  payload: {
    tasks: GetEarnDataResponseItem[];
    user_level: number;
  } | null;
};

export type EarnApi = {
  getData: () => Promise<GetEarnDataResponse>; // Adjusted to match native fetch response
  taskJoined: (data: { id: number }) => Promise<{ error: boolean; message: string }>;
};
