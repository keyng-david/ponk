import { EarnApi } from './types';
import { $sessionId } from "@/shared/model/session";

const baseUrl = '/api';

export const earnApi: EarnApi = {
    getData: async () => {
        const sessionId = $sessionId.getState();
        const response = await fetch(`${baseUrl}/earn/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionId}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch task data');
        }

        return response.json();
    },
    taskJoined: async (data) => {
        const sessionId = $sessionId.getState();
        const response = await fetch(`${baseUrl}/earn/completeTask`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionId}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            return {
                error: true,
                message: 'Failed to join task',
                payload: null
            };
        }

        const responseData = await response.json();

        // Ensure both `error` and `message` fields are included
        return {
            error: responseData.error ?? false,
            message: responseData.message || 'Task joined successfully',
            payload: responseData.payload || null // Payload can be optional
        };
    }
};