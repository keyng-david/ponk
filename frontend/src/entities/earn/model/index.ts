import { EarnItem } from './types'
import { earnApi } from '@/shared/api/earn'
import { createEvent, createStore, sample, createEffect } from 'effector'
import { GetEarnDataResponse, GetEarnDataResponseItem } from '@/shared/api/earn/types'
import {TelegramWindow} from "@/shared/lib/hooks/useTelegram";

const fetchFx = createEffect(async () => {
  const earnData = await earnApi.getData();
  const userTasks = await earnApi.getUserTasks();

  // Check if earnData is a success response and contains tasks
  if (earnData.error || !earnData.payload || !Array.isArray(earnData.payload.tasks)) {
    throw new Error("Failed to fetch tasks or tasks are not available");
  }

  // Map task completion status
  const tasksWithCompletion = earnData.payload.tasks.map((task) => ({
    ...task,
    completed: userTasks.some((userTask) => userTask.task_id === task.id && userTask.status === 'completed'),
  }));

  return { ...earnData.payload, tasks: tasksWithCompletion };
});

const secondLeftedFx = createEffect(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return 60
})

const taskJoinedFx = createEffect(async (data: {
  id: number,
  link: string,
}) => {
  const tg = (window as unknown as TelegramWindow);

  // Get the current task reward based on user level using toDomain
  const earnData = await earnApi.getData();
  const task = earnData.tasks.find((t) => t.id === data.id);
  if (!task) throw new Error('Task not found');

  const reward = toDomain({ payload: earnData }).find((t) => t.id === data.id)?.amount || '0';
  
  // Optimistic UI update
  const updatedTasks = earnModel.$list.getState().map((t) => 
    t.id === data.id ? { ...t, completed: true } : t
  );
  earnModel.$list.setState(updatedTasks);  // Update the task list optimistically

  // Send task completion request to the backend
  await earnApi.taskJoined({ id: data.id, reward });

  // Optionally update the score
  const newScore = calculateNewScore();  // Function to calculate the new score based on task reward
  earnModel.$points.setState(newScore);

  // Open the task link
  tg.Telegram.WebApp.openLink(data.link);
});

const tasksRequested = createEvent()
const taskSelected = createEvent<EarnItem>()
const taskClosed = createEvent()

const timeUpdated = createEvent<EarnItem>()

const $activeTask = createStore<EarnItem | null>(null)
const $list = createStore<EarnItem[]>([])
const $collabs = $list.map(item => item.length)

const $isLoading = fetchFx.pending

secondLeftedFx().then()

sample({
    source: $activeTask,
    clock: secondLeftedFx.doneData,
    filter: activeItem => !!activeItem,
    fn: activeTask => ({
        ...activeTask!,
        time: activeTask!.time - 1000,
    }),
    target: [$activeTask, timeUpdated, secondLeftedFx],
})

sample({
    source: $activeTask,
    clock: secondLeftedFx.doneData,
    filter: activeItem => !activeItem,
    target: secondLeftedFx,
})

sample({
    source: $list,
    clock: timeUpdated,
    fn: (list, updated) => list.map(item => item.id === updated.id ? updated : item),
    target: $list,
})

sample({
    clock: tasksRequested,
    target: fetchFx,
})

sample({
    clock: fetchFx.doneData,
    fn: toDomain,
    target: $list,
})

sample({
    clock: taskSelected,
    target: $activeTask,
})

sample({
    clock: taskClosed,
    fn: () => null,
    target: $activeTask
})

export const earnModel = {
    $list,
    $activeTask,
    $collabs,

    $isLoading,

    tasksRequested,
    taskSelected,
    taskClosed,

    taskJoinedFx,
}

function toDomain(data: GetEarnDataResponse): EarnItem[] {
    function getAmount(item: GetEarnDataResponseItem): string {
        const level = data.payload!.user_level as 1 | 2 | 3;
        const sum = level && item[`reward${level}`] ? item[`reward${level}`] : item.reward;
        return `${sum} ${item.reward_symbol}`;
    }

    if (data.payload) {
        return data.payload.tasks.map((item: GetEarnDataResponseItem) => ({
            id: item.id,
            avatar: item.image_link,
            name: item.name,
            amount: getAmount(item),
            description: item.description,
            time: item.end_time,
            tasks: item.task_list,
            link: item.link,
            participants: item.total_clicks,
        }));
    }

    return [];
}