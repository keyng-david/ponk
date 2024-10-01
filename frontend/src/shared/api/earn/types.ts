export type SuccessResponse<T> = {
  error: false;
  payload: T;
};

export type FailureResponse = {
  error: true;
  payload: null;
};

export type ResponseDefault<T> = SuccessResponse<T> | FailureResponse;

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


export type taskStatus = {
  task_id: number;
  status: string;
};


export type GetEarnDataResponse = ResponseDefault<{
  tasks: GetEarnDataResponseItem[];
  user_level: number;
  getUserTasks: taskStatus[];
}>;

export type EarnApi = {
  getData: () => Promise<GetEarnDataResponse>;
  getUserTasks: () => Promise<{ task_id: number; status: string }[]>;
  taskJoined: (data: { id: number; reward: string }) => Promise<ResponseDefault<any>>;
};