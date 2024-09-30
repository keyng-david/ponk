import { EarnItem } from './types'
import { earnApi } from '@/shared/api/earn'
import { createEvent, createStore, sample, createEffect } from 'effector'
import { GetEarnDataResponse, GetEarnDataResponseItem } from '@/shared/api/earn/types'
import {TelegramWindow} from "@/shared/lib/hooks/useTelegram";

const fetchFx = createEffect(async () => {
  const earnData = await earnApi.getData();
  const userTasks = await earnApi.getUserTasks(); // Fetch user's task status from user_tasks

  // Map task completion status
  const tasksWithCompletion = earnData.tasks.map((task) => ({
    ...task,
    completed: userTasks.some((userTask) => userTask.task_id === task.id && userTask.status === 'completed'),
  }));

  return { ...earnData, tasks: tasksWithCompletion };
});

const secondLeftedFx = createEffect(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return 60
})

const taskJoinedFx = createEffect(async (data: { id: number, link: string }) => {
    const tg = (window as unknown as TelegramWindow);

    // Make API request to mark the task as completed
    const response = await earnApi.taskJoined({ id: data.id });

    if (!response.error) {
        // Open the task link if the API request was successful
        tg.Telegram.WebApp.openLink(data.link);
    } else {
        // Handle error, prevent the link from opening
        console.error("Failed to mark task as completed:", response);
        alert("Failed to complete the task. Please try again.");
    }
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