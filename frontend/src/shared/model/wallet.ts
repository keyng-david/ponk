import {createEvent, createStore} from "effector";
import {useUnit} from "effector-react";

const walletUpdated = createEvent<string>()

const $wallet = createStore<string | null>(null)
    .on(walletUpdated, (_, payload) => payload)

const useWalletModel = () => ({
    wallet: useUnit($wallet),
    updateWallet: useUnit(walletUpdated)
})

export const walletModel = {
    useWalletModel,
}