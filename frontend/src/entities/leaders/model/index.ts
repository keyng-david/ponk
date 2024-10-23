import { createEffect, createEvent, createStore, sample } from 'effector';
import { LeaderData } from './types';
import { leadersApi } from '@/shared/api/leaders';
import { GetLeaderListResponse } from '@/shared/api/leaders/types';

const fetchFx = createEffect(leadersApi.getList);

const leadersRequested = createEvent();
const $data = createStore<LeaderData[]>([]);
const $userLeaderData = createStore<LeaderData | null>(null);
const $isLoading = fetchFx.pending;

sample({
  clock: leadersRequested,
  target: fetchFx,
});

sample({
  clock: fetchFx.doneData,
  fn: data => {
    if (data.payload) {
      const leaders = data.payload.leaders.map((item, index) => ({
        position: index + 1,
        name: item.username,
        score: item.score,
      }));
      return leaders;
    }
    return [];
  },
  target: $data,
});

sample({
  clock: fetchFx.doneData,
  fn: data => {
    if (data.payload && data.payload.userLeaderData) {
      return {
        position: data.payload.userLeaderData.position,
        name: data.payload.userLeaderData.username,
        score: data.payload.userLeaderData.score,
      };
    }
    return null;
  },
  target: $userLeaderData,
});

export const leadersModel = {
  $list: $data,
  $userLeaderData,
  $isLoading,
  leadersRequested,
};