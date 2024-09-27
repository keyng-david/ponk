import { EarnItem } from './types';
import { earnApi } from '@/shared/api/earn';
import { createEvent, createStore, sample, createEffect } from 'effector';
import { GetEarnDataResponse, GetEarnDataResponseItem } from '@/shared/api/earn/types';
import { TelegramWindow } from "@/shared/lib/hooks/useTelegram";

// Effect to fetch task data
const fetchFx = createEffect(earnApi.getData);

// Effect to handle task join event
const taskJoinedFx = createEffect(async (data: { id: number, link: string }) => {
    const tg = (window as unknown as TelegramWindow);

    try {
        console.log(`Task with ID ${data.id} is being joined...`);
        const response = await earnApi.taskJoined({ id: data.id });
        console.log("Task joined response:", response);

        if (!response.error) {
            tg.Telegram.WebApp.openLink(data.link);
        } else {
            console.error("Error in taskJoined:", response);
        }
    } catch (error) {
        console.error("Error during taskJoinedFx:", error);
    }
});

// Event triggers
const tasksRequested = createEvent();
const taskSelected = createEvent<EarnItem>();
const taskClosed = createEvent();

// Effect to simulate countdown or timeout for tasks
const secondLeftedFx = createEffect(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 60; // Simulating seconds countdown, update as needed
});

// Store for active task
const $activeTask = createStore<EarnItem | null>(null);

// Store for the task list
const $list = createStore<EarnItem[]>([])
    .on(fetchFx.doneData, (_, payload) => toDomain(payload))
    .on(fetchFx.failData, (state, error) => {
        console.error("Failed to fetch tasks:", error);
        return state;
    });

// Loading state store
const $isLoading = fetchFx.pending;

// Track task selection and close events
sample({
    clock: taskSelected,
    target: $activeTask,
});

sample({
    clock: taskClosed,
    fn: () => null,
    target: $activeTask
});

// Effect to manage time updates
sample({
    source: $activeTask,
    clock: secondLeftedFx.doneData,
    filter: activeTask => !!activeTask,
    fn: activeTask => ({
        ...activeTask!,
        time: activeTask!.time - 1000, // Reduce time by 1 second
    }),
    target: $activeTask,
});

// Trigger next second countdown
secondLeftedFx().then(() => {
    sample({
        source: $activeTask,
        clock: secondLeftedFx.doneData,
        filter: activeItem => !activeItem,
        target: secondLeftedFx,
    });
});

// Trigger task fetching
sample({
    clock: tasksRequested,
    target: fetchFx,
});

// Debugging: Fetch task data logs
fetchFx.done.watch(({ result }) => {
    console.log("Fetch effect completed. Result:", result);
    if (result.payload && Array.isArray(result.payload.tasks)) {
        console.log("Fetched tasks count:", result.payload.tasks.length);
    } else {
        console.error("Invalid tasks payload received:", result.payload);
    }
});

fetchFx.fail.watch(({ error }) => {
    console.error("Fetch effect failed. Error:", error);
});

// Function to map API response to the domain-specific format
function toDomain(data: GetEarnDataResponse): EarnItem[] {
    function getAmount(item: GetEarnDataResponseItem) {
        const level = data.payload!.user_level as 0 | 1 | 2 | 3;
        const sum = level && item[`reward${level}`] ? item[`reward${level}`] : item.reward;
        return `${sum} ${item.reward_symbol}`;
    }

    console.log("Mapping data to domain format. Payload:", data.payload);

    if (data.payload && Array.isArray(data.payload.tasks)) {
        return data.payload.tasks.map(item => ({
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
    } else {
        console.error("Invalid or missing tasks in payload:", data.payload);
        return [];
    }
}

// Exports
export const earnModel = {
    $list,
    $activeTask,
    $isLoading,
    tasksRequested,
    taskSelected,
    taskClosed,
    taskJoinedFx,
};