import { EarnItem } from './types'
import { earnApi } from '@/shared/api/earn'
import { createEvent, createStore, sample, createEffect } from 'effector'
import { GetEarnDataResponse, GetEarnDataResponseItem } from '@/shared/api/earn/types'
import { TelegramWindow } from "@/shared/lib/hooks/useTelegram"

// Creating the fetch effect with logging
const fetchFx = createEffect(async () => {
    console.log("Fetching earn data...");
    const data = await earnApi.getData();
    console.log("Fetch successful, data received:", data);
    return data;
});

// Second left effect with logging
const secondLeftedFx = createEffect(async () => {
    console.log("Starting countdown...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Countdown finished.");
    return 60;
});

// Task joined effect with logging
const taskJoinedFx = createEffect(async (data: { id: number, link: string }) => {
    console.log(`Joining task with ID: ${data.id}, link: ${data.link}`);
    const tg = (window as unknown as TelegramWindow);

    try {
        await earnApi.taskJoined({
            id: data.id
        });
        console.log(`Task with ID: ${data.id} marked as joined.`);
        tg.Telegram.WebApp.openLink(data.link);
    } catch (error) {
        console.error(`Error joining task with ID: ${data.id}`, error);
    }
});

// Creating events
const tasksRequested = createEvent();
const taskSelected = createEvent<EarnItem>();
const taskClosed = createEvent();
const timeUpdated = createEvent<EarnItem>();

// Creating stores
const $activeTask = createStore<EarnItem | null>(null);
const $list = createStore<EarnItem[]>([]);
const $collabs = $list.map(item => item.length);
const $isLoading = fetchFx.pending;

// Handling success and failure for fetch effect
fetchFx.doneData.watch((data) => {
    console.log("Fetch succeeded:", data);
});
fetchFx.failData.watch((error) => {
    console.error("Fetch failed:", error);
});

// Starting countdown on initialization
secondLeftedFx().then();

// Updating active task every second
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

// Restarting countdown if there's no active task
sample({
    source: $activeTask,
    clock: secondLeftedFx.doneData,
    filter: activeItem => !activeItem,
    target: secondLeftedFx,
});

// Updating task list when time is updated
sample({
    source: $list,
    clock: timeUpdated,
    fn: (list, updated) => list.map(item => item.id === updated.id ? updated : item),
    target: $list,
});

// Fetching tasks when requested
sample({
    clock: tasksRequested,
    target: fetchFx,
});

// Processing the fetch result and updating the list
sample({
    clock: fetchFx.doneData,
    fn: (data) => {
        console.log("Processing fetched data:", data);
        const tasks = toDomain(data);
        if (tasks.length === 0) {
            console.warn("No tasks were created from the fetched data.");
        } else {
            console.log(`Successfully mapped ${tasks.length} tasks.`);
        }
        return tasks;
    },
    target: $list,
});

// Handling task selection
sample({
    clock: taskSelected,
    target: $activeTask,
});

// Handling task closing
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
}

// Converting raw data into domain-specific format
function toDomain(data: GetEarnDataResponse): EarnItem[] {
    console.log("Mapping payload to EarnItem[] format...");
    
    if (!data || !data.payload) {
        console.error("Data or payload is missing:", data);
        return [];
    }

    function getAmount(item: GetEarnDataResponseItem) {
        const level = data.payload!.user_level as 0 | 1 | 2 | 3; // Include 0 in the type
        const rewardKey = `reward${level}`;
        const sum = item[rewardKey] !== undefined ? item[rewardKey] : item.reward;
        
        console.log(`Item ID: ${item.id}, Reward Key: ${rewardKey}, Reward Value: ${sum}, Reward Symbol: ${item.reward_symbol}`);
        return `${sum} ${item.reward_symbol}`;
    }

    if (Array.isArray(data.payload.tasks)) {
        console.log("Payload contains valid tasks array with length:", data.payload.tasks.length);

        const tasks = data.payload.tasks.map((item, index) => {
            console.log(`Mapping task ${index + 1}/${data.payload.tasks.length}:`, item);

            const task = {
                id: item.id,
                avatar: item.image_link,
                name: item.name,
                amount: getAmount(item),
                description: item.description,
                time: item.end_time,
                tasks: item.task_list,
                link: item.link,
                participants: item.total_clicks,
            };

            // Log the created task object for further inspection
            console.log(`Mapped task object:`, task);
            return task;
        });

        console.log(`Successfully mapped ${tasks.length} tasks.`);
        return tasks;
    } else {
        console.error("Invalid payload or tasks data:", data.payload);
        return [];
    }
}