import {combine, createEffect, createEvent, createStore, sample} from "effector";
import { LeaderData } from './types';
import { leadersApi } from "@/shared/api/leaders";
import { GetLeaderListResponse } from "@/shared/api/leaders/types";

const fetchFx = createEffect(leadersApi.getList);

const leadersRequested = createEvent();
const $data = createStore<LeaderData[]>([{
    position: 1,
    name: '',
    score: 1,
}]);

const $firstPosition = combine($data, list => list[0]);
const $list = combine($data, list => list.slice(1));
const $isLoading = fetchFx.pending;

sample({
    clock: leadersRequested,
    target: fetchFx,
});

sample({
    clock: fetchFx.doneData,
    fn: leadersToDomain, // Modified to handle GetLeaderListResponse type
    target: $data,
});

export const leadersModel = {
    $list,
    $firstPosition,
    $isLoading,
    leadersRequested,
};

// Adjust the function to expect GetLeaderListResponse
function leadersToDomain(data: GetLeaderListResponse): LeaderData[] {
    if (data.payload) {
        return data.payload.leaders.map((item, key) => ({
            position: key + 1,
            name: item.username,
            score: item.score,
        }));
    }
    return [];
}