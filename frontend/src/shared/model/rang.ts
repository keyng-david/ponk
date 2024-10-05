import {createEvent, createStore} from "effector";
import {useUnit} from "effector-react";

const rangUpdated = createEvent<number>()

const $rang = createStore(0)
    .on(rangUpdated, (_, payload) => payload)

const useRang = () => ({
    rang: useUnit($rang),
    update: rangUpdated
})

export const randModel = {
    useRang,
}