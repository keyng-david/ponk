import { EarnApi } from './types'

export const earnApi: EarnApi = {
    async getData() {
        await new Promise(resolve => setTimeout(resolve, 2000))

        return {
            error: false,
            payload: {
                tasks: new Array(10).fill(1).map((_, key) => ({
                    name: `name ${key}`,
                    description: 'Addickted is the greatest meme coin on ton blockchain! Hold your dick! Don’t be a pussy! Buy Dick! Grow your dick!',
                    reward: '10000',
                    reward1: '20000',
                    reward2: '30000',
                    reward3: '40000',
                    reward_symbol: '$COIN',
                    end_time: 5_205_705_000,
                    id: key,
                    total_clicks: 10000,
                    link: 'https://www.google.ru/?hl=ru',
                    image_link: '',
                    task_list: new Array(5).fill(1).map((_, index) => `task ${index}`),
                    isDone: 'pending'
                })),
                user_level: 2,
            }
        }
    },
    async taskJoined() {
        await new Promise(resolve => setTimeout(resolve, 2000))

        return {
            error: false,
            payload: null
        }
    }
}