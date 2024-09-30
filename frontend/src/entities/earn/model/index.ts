import { EarnItem } from './types';
import { earnApi } from '@/shared/api/earn';
import { createEvent, createStore, sample, createEffect } from 'effector';
import { GetEarnDataResponse, GetEarnDataResponseItem } from '@/shared/api/earn/types';
import { TelegramWindow } from "@/shared/lib/hooks/useTelegram";
import { clickerModel } from "@/features/clicker/model";

// Move getAmount outside to make it globally accessible
function getAmount(item: GetEarnDataResponseItem, userLevel: number): string {
  // Explicitly assert that item has dynamic keys of type `string`
  const rewardKey = `reward${userLevel}` as keyof GetEarnDataResponseItem;
  const sum = item[rewardKey] !== undefined ? item[rewardKey] : item.reward; // Check for existence
  return `${sum} ${item.reward_symbol}`;
}

// Modify toDomain to accept getAmount as an argument

function toDomain(
  data: GetEarnDataResponse,
  userTasks: { task_id: number, status: string }[],
  getAmountFn: (item: GetEarnDataResponseItem, level: number) => string
): EarnItem[] {
  const userLevel = data.payload?.user_level as 1 | 2 | 3;

  if (data.payload && Array.isArray(data.payload.tasks)) {
    return data.payload.tasks.map((item: GetEarnDataResponseItem) => {
      // Check if this task is marked as completed in userTasks
      const isCompleted = userTasks.some(userTask => userTask.task_id === item.id && userTask.status === 'completed');
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
        completed: isCompleted // Assign completion status
      };
    });
  }

  return [];
}


const fetchFx = createEffect(async () => {
  const earnData = await earnApi.getData();
  const userTasks = await earnApi.getUserTasks();

  // Check if earnData is a success response and contains tasks
  if (earnData.error || !earnData.payload || !Array.isArray(earnData.payload.tasks)) {
    throw new Error("Failed to fetch tasks or tasks are not available");
  }

  // Pass getAmount function to toDomain
  const tasksWithCompletion = toDomain(earnData, userTasks, getAmount); // Pass the getAmount function

  // Map task completion status, ensuring completed property is included
  const tasksWithCompletionAndStatus = tasksWithCompletion.map((task) => ({
    ...task,
    completed: userTasks.some((userTask) => userTask.task_id === task.id && userTask.status === 'completed'),
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

// Function to calculate the new score
function calculateNewScore(reward: string): number {
  const currentScore = clickerModel.$value.getState();
  const numericReward = Number(reward);
  return currentScore + numericReward;
}

const taskJoinedFx = createEffect(async (data: { id: number, link: string }) => {
  const tg = (window as unknown as TelegramWindow);
  const earnData = await earnApi.getData();
  const userTasks = await earnApi.getUserTasks();

  if (earnData.error || !earnData.payload) throw new Error('Failed to fetch earn data');

  const task = earnData.payload.tasks.find((t) => t.id === data.id);
  if (!task) throw new Error('Task not found');

  const reward = toDomain(earnData, userTasks, getAmount).find((t) => t.id === data.id)?.amount || '0';

  const updatedTasks = earnModel.$list.getState().map((t) =>
    t.id === data.id ? { ...t, completed: true } : t
  );
  tasksUpdated(updatedTasks);

  await earnApi.taskJoined({ id: data.id, reward });

  // Calculate and update the score optimistically
  const newScore = calculateNewScore(reward);
  clickerModel.clicked({ score: newScore, click_score: Number(reward), available_clicks: clickerModel.$available.getState() - Number(reward) });

  tg.Telegram.WebApp.openLink(data.link);
});

const tasksRequested = createEvent();
const taskSelected = createEvent<EarnItem>();
const taskClosed = createEvent();
const timeUpdated = createEvent<EarnItem>();

const $activeTask = createStore<EarnItem | null>(null);
const $collabs = $list.map(item => item.length);
const $isLoading = fetchFx.pending;

secondLeftedFx().then();

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

sample({
  source: $activeTask,
  clock: secondLeftedFx.doneData,
  filter: activeItem => !activeItem,
  target: secondLeftedFx,
});

sample({
  source: $list,
  clock: timeUpdated,
  fn: (list, updated) => list.map(item => item.id === updated.id ? updated : item),
  target: $list,
});

sample({
  clock: tasksRequested,
  target: fetchFx,
});

sample({
  clock: fetchFx.doneData,
  fn: (data) => toDomain(data, userTasks, getAmount),
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