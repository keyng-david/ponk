import { EarnApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";

export const earnApi: EarnApi = {
  getData: async () =>
    await createRequest({
      endpoint: 'game/tasks',
      method: 'GET',
      // onError is omitted if not needed
    }),
  taskJoined: async (body) =>
    await createRequest({
      endpoint: 'game/completeTask',
      method: 'POST',
      body,
      // onError is omitted if not needed
    }),
};