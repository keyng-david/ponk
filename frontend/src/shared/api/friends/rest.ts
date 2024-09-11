import { FriendsApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";

export const friendsApi: FriendsApi = {
    getFriends: async () => await createRequest({
        endpoint: '/api/friends',
        method: 'GET'
    })
}