import { createEvent, createStore, sample } from "effector";
import { useUnit } from "effector-react";
import { usePoints } from "@/app/socketProvider";

export const MAX_AVAILABLE = 500;
export const CLICK_STEP = 1;

// Define events for initializing and updating values
const valueInited = createEvent<number>();
const availableInited = createEvent<number>();
const availableUpdated = createEvent<number>();

const clicked = createEvent<{
    score: number,
    click_score: number,
    available_clicks: number,
}>();
const errorUpdated = createEvent<boolean>();

const $isMultiAccount = createStore(false);
const $value = createStore(0).on(valueInited, (_, payload) => payload);
const $available = createStore(MAX_AVAILABLE).on(availableInited, (_, payload) => payload);

const $earnedPoint = createStore(0); // New store for accumulated points

const $canBeClicked = $available.map(state => state >= CLICK_STEP);

// New function to handle optimistic UI update
function updateOptimisticUI(points: number) {
    clicked({ score: $value.getState() + points, available_clicks: $available.getState() - points, click_score: points });
}

// Integrating optimistic update to the sample
sample({
    clock: availableUpdated,
    target: $available
});

sample({
    clock: clicked,
    fn: ({ score }) => score,
    target: $value,
});

sample({
    clock: clicked,
    fn: ({ available_clicks }) => available_clicks,
    target: $available
});

sample({
    clock: valueInited,
    target: $value,
});

sample({
    clock: availableInited,
    target: $available,
});

sample({
    clock: errorUpdated,
    target: $isMultiAccount
});

// Refill mechanism
setInterval(() => {
  const currentAvailable = $available.getState();
  if (currentAvailable < MAX_AVAILABLE) {
    const newAvailable = Math.min(currentAvailable + CLICK_STEP, MAX_AVAILABLE);
    availableUpdated(newAvailable);
  }
}, 2000);  // Refill every 2 seconds

const useCanBeClicked = () => useUnit($canBeClicked);

const useClicker = () => {
    const { points, incrementPoints } = usePoints(); // Access points and incrementPoints from SocketProvider

    function onClick() {
        const newPoints = CLICK_STEP; // Points to increment
        updateOptimisticUI(newPoints);

        incrementPoints(newPoints);
    }

    return {
        value: useUnit($value),
        available: useUnit($available),
        canBeClicked: useUnit($canBeClicked),
        isMultiError: useUnit($isMultiAccount),
        onClick,
    };
};

export const clickerModel = {
    valueInited,
    availableInited,
    availableUpdated,
    clicked,
    errorUpdated,
    useCanBeClicked,
    useClicker,
    $value,
    $available,
    $earnedPoint,
};