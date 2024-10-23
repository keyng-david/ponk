import { LeadersApi } from './types'

export const leadersApi: LeadersApi = {
  async getList() {
    await new Promise(resolve => setTimeout(resolve, 7000));
    return {
      error: false,
      payload: {
        leaders: [
          { username: 'Alice', score: 9500 },
          { username: 'Bob', score: 9000 },
          // ... other leaders
        ],
        userLeaderData: {
          position: 15,
          username: 'YourUsername',
          score: 7500,
        },
      },
    };
  },
};