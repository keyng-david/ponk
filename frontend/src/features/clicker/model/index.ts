import { createEvent, createStore, sample } from "effector";
import { useUnit } from "effector-react";
import { usePoints } from "@/app/socketProvider";

// Define events for initializing and updating values
const valueInited = createEvent<number>();
const availableInited = createEvent<number>();
const availableUpdated = createEvent<number>();
const clickStepUpdated = createEvent<number>();

const clicked = createEvent<{
  score: number,
  click_score: number,
  available_clicks: number,
}>();
const errorUpdated = createEvent<boolean>();

const $isMultiAccount = createStore(false);
const $value = createStore(0).on(valueInited, (_, payload) => payload);
const $available = createStore(500).on(availableInited, (_, payload) => payload); // Initialize with a default value

// Create store for CLICK_STEP
const $clickStep = createStore(1).on(clickStepUpdated, (_, payload) => payload); // Initialize with default clickStep value

const $earnedPoint = createStore(0); // Store for accumulated points
const $canBeClicked = $available.map(state => state >= $clickStep.getState()); // Check if available clicks are >= CLICK_STEP

// Function to handle optimistic UI update
function updateOptimisticUI(points: number) {
  clicked({
    score: $value.getState() + points,
    available_clicks: $available.getState() - points,
    click_score: points,
  });
}

// Sample logic
sample({
  clock: availableUpdated,
  target: $available,
});

sample({
  clock: clicked,
  fn: ({ score }) => score,
  target: $value,
});

sample({
  clock: clicked,
  fn: ({ available_clicks }) => available_clicks,
  target: $available,
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
  clock: clickStepUpdated,
  target: $clickStep,
});

sample({
  clock: errorUpdated,
  target: $isMultiAccount,
});

// Refill mechanism
setInterval(() => {
  const currentAvailable = $available.getState();
  const clickStep = $clickStep.getState();
  if (currentAvailable < $available.getState()) {
    const newAvailable = Math.min(currentAvailable + clickStep, $available.getState());
    availableUpdated(newAvailable);
  }
}, 2000);  // Refill every 2 seconds

const useCanBeClicked = () => useUnit($canBeClicked);

const useClicker = () => {
  const { points, incrementPoints } = usePoints(); // Access points and incrementPoints from SocketProvider

  function onClick() {
    const newPoints = $clickStep.getState(); // Use dynamic CLICK_STEP
    updateOptimisticUI(newPoints);
    incrementPoints(newPoints); // Triggers the debounce
  }

  return {
    value: useUnit($value),
    available: useUnit($available),
    canBeClicked: useUnit($canBeClicked),
    isMultiError: useUnit($isMultiAccount),
    onClick,
  };
};

// Export dynamic values as constants for other parts of the app
export const MAX_AVAILABLE = $available.getState(); // Export current available clicks
export const CLICK_STEP = $clickStep.getState(); // Export current clickStep

export const clickerModel = {
  valueInited,
  availableInited,
  availableUpdated,
  clickStepUpdated,
  clicked,
  errorUpdated,
  useCanBeClicked,
  useClicker,
  $value,
  $available,
  $earnedPoint,
};