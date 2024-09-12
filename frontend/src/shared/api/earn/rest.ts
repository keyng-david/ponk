import { EarnApi, GetEarnDataResponse } from './types';
import { $sessionId } from "@/shared/model/session";

export const earnApi: EarnApi = {
    getData: async (): Promise<GetEarnDataResponse> => {
        const sessionId = $sessionId.getState();
        const response = await fetch('/api/earn/task', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionId}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    },

    taskJoined: async (data: { id: number }) => {
        const sessionId = $sessionId.getState();
        const response = await fetch('/api/earn/complete_task', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionId}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error joining task: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    }
}