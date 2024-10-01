import { EarnItem } from './types';
import { earnApi } from '@/shared/api/earn';
import { createEvent, createStore, sample, createEffect } from 'effector';
import { GetEarnDataResponse, GetEarnDataResponseItem } from '@/shared/api/earn/types';
import { TelegramWindow } from "@/shared/lib/hooks/useTelegram";
import { clickerModel } from "@/features/clicker/model";

// Globally accessible function to calculate the reward based on user level
function getAmount(item: GetEarnDataResponseItem, userLevel: number): string {
  const rewardKey = `reward${userLevel}` as keyof GetEarnDataResponseItem;
  const sum = item[rewardKey] !== undefined ? item[rewardKey] : item.reward;
  return `${sum} ${item.reward_symbol}`;
}

// Function to map tasks into the correct format and mark them as completed if necessary
function toDomain(
  data: GetEarnDataResponse
): EarnItem[] {
  function getAmountFn(item: GetEarnDataResponseItem): string {
    const level = data.payload!.user_level as 1 | 2 | 3;
    const sum = level && item[`reward${level}`] ? item[`reward${level}`] : item.reward;
    return `${sum} ${item.reward_symbol}`;
  }

  if (data.payload) {
    return data.payload.tasks.map((item: GetEarnDataResponseItem) => ({
      id: item.id,
      avatar: item.image_link,
      name: item.name,
      amount: getAmountFn(item),
      description: item.description,
      time: item.end_time,
      tasks: item.task_list,
      link: item.link,
      participants: item.total_clicks,
      completed: false  // Add 'completed' state to tasks
    }));
  }

  return [];
}

// Optimistic task completion handler
function handleTaskCompletion(taskId: number, reward: string) {
  // Update the UI optimistically
  const updatedTasks = $list.getState().map(task => 
    task.id === taskId ? { ...task, completed: true } : task
  );
  tasksUpdated(updatedTasks);

  // Calculate and update score
  const newScore = calculateNewScore(reward);
  clickerModel.clicked({
    score: newScore,
    click_score: Number(reward),
    available_clicks: clickerModel.$available.getState() - Number(reward),
  });

  // Confirm task completion via backend
  return earnApi.taskJoined({ id: taskId, reward }); // Ensure reward is passed here
}

// Helper to calculate the new score
function calculateNewScore(reward: string): number {
  const currentScore = clickerModel.$value.getState();
  const numericReward = Number(reward);
  return currentScore + numericReward;
}

// Effect to join a task and handle task completion
const taskJoinedFx = createEffect(async (data: { id: number, link: string }) => {
  const tg = (window as unknown as TelegramWindow);

  // Fetch the task from the list to get its reward
  const task = $list.getState().find(t => t.id === data.id);
  if (!task) throw new Error('Task not found');
  const reward = task.amount; // Extract reward for the task

  // Optimistically mark the task as completed and update score
  await handleTaskCompletion(task.id, reward); // Pass reward to handleTaskCompletion

  // Confirm task completion via API
  await earnApi.taskJoined({ id: data.id, reward }); // Pass both id and reward here

  // Open the task link
  tg.Telegram.WebApp.openLink(data.link);
});

// Effect to fetch data and tasks
const fetchFx = createEffect(async () => {
  const earnData = await earnApi.getData();

  // Check if earnData is valid and contains tasks
  if (earnData.error || !earnData.payload) {
    throw new Error("Failed to fetch tasks or tasks are not available");
  }

  return toDomain(earnData);
});

const secondLeftedFx = createEffect(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 60;
});

// Define an event to update the task list
const tasksUpdated = createEvent<EarnItem[]>();

// Define store for the list of tasks
const $list = createStore<EarnItem[]>([])
  .on(tasksUpdated, (_, updatedTasks) => updatedTasks);

// Event to request tasks
const tasksRequested = createEvent();

// Define an effect to fetch data when tasks are requested
sample({
  clock: tasksRequested,
  target: fetchFx,
});

// Set the time update logic
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

// Sample logic for task selection and task closing
sample({
  clock: fetchFx.doneData,
  fn: toDomain,
  target: $list,
});

sample({
  clock: taskSelected,
  target: $activeTask,
});

sample({
  clock: taskClosed,
  fn: () => null,
  target: $activeTask,
});

// Define stores and events for the model
const $activeTask = createStore<EarnItem | null>(null);
const $collabs = $list.map(item => item.length);
const $isLoading = fetchFx.pending;

// Trigger secondLeftedFx at the start
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