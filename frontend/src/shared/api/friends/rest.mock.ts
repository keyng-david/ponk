import { FriendsApi } from './types'

export const friendsApi: FriendsApi = {
    async getFriends() {
        await new Promise(resolve => setTimeout(resolve, 2000))

        return {
            error: false,
            payload: {
                link: '',
                score: 20050,
                friends: 10,
                default_reward: 1000,
                premium_reward: 2000
            }
        }
    }
}