import {createEvent, createStore} from "effector";
import {useUnit} from "effector-react/effector-react.umd";

export enum Steps {
    HOME = 1,
    FRENS,
    BOARD,
    EARN
}

const stepChanged = createEvent<Steps>()

const $step = createStore<Steps>(Steps.HOME)
    .on(stepChanged, (_, payload) => payload)

export const useNavigatorModel = () => ({
    step: useUnit($step),
    stepChanged: useUnit(stepChanged)
})
