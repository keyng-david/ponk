import { FriendsApi, friendsApi } from "@/shared/api/friends";
import { createFetch } from "@/shared/lib/effector/createGateHook";
import { createStore, sample } from "effector";

import { FriendsData } from './types'
import {ResponseDefault} from "@/shared/lib/api/createRequest";
import {GetFriendsResponse} from "@/shared/api/friends/types";

const [ FetchGate, fetchFx, useFetchGate ] = createFetch<FriendsApi['getFriends']>(friendsApi.getFriends)

const $data = createStore<FriendsData>({
    link: '',
    points: 0,
    friends: 0,
    tg: 0,
    premium: 0
})

sample({
    clock: FetchGate.open,
    target: fetchFx,
})

sample({
    clock: fetchFx.doneData,
    fn: toDomain,
    target: $data,
})

export const friendsModel = {
    $data,
    useFetchGate,
}

function toDomain(data: ResponseDefault<GetFriendsResponse>): FriendsData {
    if (!data.error) {
        return {
            link: data.payload.link,
            points: data.payload.score,
            friends: data.payload.friends,
            tg: data.payload.default_reward,
            premium: data.payload.premium_reward,
        }
    }

    return {
        link: '',
        points: 0,
        friends: 0,
        tg: 0,
        premium: 0
    }
}
