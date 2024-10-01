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
  data: GetEarnDataResponse,
  userTasks: { task_id: number, status: string }[],
  getAmountFn: (item: GetEarnDataResponseItem, level: number) => string
): EarnItem[] {
  const userLevel = data.payload?.user_level as 1 | 2 | 3;

  return data.payload?.tasks.map((item: GetEarnDataResponseItem) => {
    const isCompleted = userTasks.some(task => task.task_id === item.id && task.status === 'completed');
    return {
      id: item.id,
      avatar: item.image_link,
      name: item.name,
      amount: getAmountFn(item, userLevel),
      description: item.description,
      time: item.end_time,
      tasks: item.task_list,
      link: item.link,
      participants: item.total_clicks,
      completed: isCompleted  // Assign completion status
    };
  }) || [];
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
  return earnApi.taskJoined({ id: taskId, reward });
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
  const earnData = await earnApi.getData();
  const userTasks = await earnApi.getUserTasks();

  if (earnData.error || !earnData.payload) throw new Error('Failed to fetch earn data');

  const task = earnData.payload.tasks.find(t => t.id === data.id);
  if (!task) throw new Error('Task not found');

  const reward = toDomain(earnData, userTasks, getAmount).find(t => t.id === data.id)?.amount || '0';

  // Handle task completion
  await handleTaskCompletion(task.id, reward);

  // Open the task link
  tg.Telegram.WebApp.openLink(data.link);
});

// Define an effect to fetch data and user tasks
const fetchFx = createEffect(async () => {
  const earnData = await earnApi.getData();
  const userTasks = await earnApi.getUserTasks();

  // Check if earnData is a success response and contains tasks
  if (earnData.error || !earnData.payload || !Array.isArray(earnData.payload.tasks)) {
    throw new Error("Failed to fetch tasks or tasks are not available");
  }

  // Map the tasks with their completion status
  const tasksWithCompletion = toDomain(earnData, userTasks, getAmount);
  const tasksWithCompletionAndStatus = tasksWithCompletion.map(task => ({
    ...task,
    completed: userTasks.some(userTask => userTask.task_id === task.id && userTask.status === 'completed'),
  }));

  return { ...earnData.payload, tasks: tasksWithCompletionAndStatus };
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

// Effect to handle task joining and task completion
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

// Sample logic for task selection and completion
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

// Other necessary parts of the code remain unchanged
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