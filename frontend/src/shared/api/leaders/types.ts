import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type GetLeaderListResponse = {
    leaders: {
        username: string
        score: number
    }[]
}

export type LeadersApi = {
    getList: () => Promise<ResponseDefault<GetLeaderListResponse>>
}