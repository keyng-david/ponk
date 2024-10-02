import { EarnItem } from './types';
import { earnApi } from '@/shared/api/earn';
import { createEvent, createStore, sample, createEffect } from 'effector';
import { GetEarnDataResponse, GetEarnDataResponseItem, taskStatus } from '@/shared/api/earn/types';
import { TelegramWindow } from "@/shared/lib/hooks/useTelegram";
import { clickerModel } from "@/features/clicker/model";

// Globally accessible function to calculate the reward based on user level
function getAmount(item: GetEarnDataResponseItem, userLevel: number): string {
  const rewardKey = `reward${userLevel}` as keyof GetEarnDataResponseItem;
  const sum = item[rewardKey] !== undefined ? item[rewardKey] : item.reward;
  return `${sum} ${item.reward_symbol}`;
}


function toDomain(data: GetEarnDataResponse, taskStatuses: taskStatus[]): EarnItem[] {
  const getAmountFn = (item: GetEarnDataResponseItem): string => {
    const level = data.payload!.user_level as 1 | 2 | 3;
    const sum = level && item[`reward${level}`] ? item[`reward${level}`] : item.reward;
    return `${sum} ${item.reward_symbol}`;
  };

  return data.payload ? data.payload.tasks.map((item: GetEarnDataResponseItem) => {
 const taskStatus = taskStatuses.find(status => status.task_id === item.id);
        return {
            id: item.id,
            avatar: item.image_link,
            name: item.name,
            amount: getAmountFn(item),
            description: item.description,
            time: item.end_time,
            tasks: item.task_list,
            link: item.link,
            participants: item.total_clicks,
            completed: taskStatus ? taskStatus.status === 'completed' : false
        };
    }) : [];
}

// Optimistic task completion handler
function handleTaskCompletion(taskId: number, reward: string) {
  const updatedTasks = $list.getState().map(task =>
    task.id === taskId ? { ...task, completed: true } : task
  );
  tasksUpdated(updatedTasks);

  const newScore = calculateNewScore(reward);
  clickerModel.clicked({
    score: newScore,
    click_score: Number(reward),
    available_clicks: clickerModel.$available.getState() - Number(reward),
  });

  return earnApi.taskJoined({ id: taskId, reward });
}

// Helper to calculate the new score
function calculateNewScore(reward: string): number {
  const currentScore = clickerModel.$value.getState();
  return currentScore + Number(reward);
}

// Effect to join a task and handle task completion
const taskJoinedFx = createEffect(async (data: { id: number, link: string }) => {
  const tg = (window as unknown as TelegramWindow);
  const task = $list.getState().find(t => t.id === data.id);
  if (!task) throw new Error('Task not found');
  const reward = task.amount;

  await handleTaskCompletion(task.id, reward);
  await earnApi.taskJoined({ id: data.id, reward });

  tg.Telegram.WebApp.openLink(data.link);
});

// Corrected Effect to fetch data and tasks
const fetchFx = createEffect(async (): Promise<GetEarnDataResponse> => {
  const earnData = await earnApi.getData();
  if (earnData.error || !earnData.payload) {
    throw new Error("Failed to fetch tasks or tasks are not available");
  }
  return earnData;
});

const statusFx = createEffect(async (): Promise<taskStatus[]> => {
  const statusData = await earnApi.getUserTasks();
  
  if (!Array.isArray(statusData) || statusData.length === 0) {
    throw new Error("Failed to fetch taskStatus or no task statuses available");
  }
  
  return statusData;
});

// Effect to handle timing for tasks
const secondLeftedFx = createEffect(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 60;
});

// Event to update the task list
const tasksUpdated = createEvent<EarnItem[]>();

// Store for the list of tasks
const $list = createStore<EarnItem[]>([])
  .on(tasksUpdated, (_, updatedTasks) => updatedTasks);

// Store and events for task management
const $activeTask = createStore<EarnItem | null>(null);
const $collabs = $list.map(item => item.length);
const $isLoading = fetchFx.pending;
const timeUpdated = createEvent<EarnItem>();

// Event to request tasks
const tasksRequested = createEvent();

// Sample for fetching data when tasks are requested
sample({
  clock: tasksRequested,
  target: [fetchFx, statusFx],
});

sample({
  clock: fetchFx.doneData,
  source: statusFx.doneData,
  fn: (taskStatuses, earnData) => toDomain(earnData, taskStatuses),
  target: $list,
});

// Sample logic for task selection and task closing
const taskSelected = createEvent<EarnItem>();
const taskClosed = createEvent();

sample({
  clock: taskSelected,
  target: $activeTask,
});

sample({
  clock: taskClosed,
  fn: () => null,
  target: $activeTask,
});

// Set time update logic
sample({
  source: $activeTask,
  clock: secondLeftedFx.doneData,
  filter: activeItem => !!activeItem,
  fn: activeTask => ({
    ...activeTask!,
    time: activeTask!.time - 1000,
  }),
  target: [$activeTask, timeUpdated, secondLeftedFx],
});

secondLeftedFx().then();

export const earnModel = {
  $list,
  $activeTask,
  $collabs,
  $isLoading,
  tasksRequested,
  taskSelected,
  taskClosed,
  taskJoinedFx,
};