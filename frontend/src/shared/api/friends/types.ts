import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type GetFriendsResponse = {
    link: string
    friends: number
    score: number
    default_reward: number
    premium_reward: number
}

export type FriendsApi = {
    getFriends: () => Promise<ResponseDefault<GetFriendsResponse>>
}