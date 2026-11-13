import { apiRequest } from './api';

export const dashboardService = {
    getSummary() {
        return apiRequest('dashboard/summary');
    },
};
