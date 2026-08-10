import { mockDashboardData } from '../mocks/dashboardMock';
import type { DashboardData, DashboardPeriod } from '../types/DashboardTypes';
import type { AxiosInstance } from 'axios';

/**
 * Service for fetching Dashboard Analytics data.
 * 
 * NOTE: Currently returns realistic mock data.
 * When real API endpoints are available, uncomment the API call below
 * and replace the mock return without modifying any UI components.
 */
export async function getDashboardData(
	_api?: AxiosInstance | null,
	_establishmentId?: string | null,
	_period: DashboardPeriod = '30d'
): Promise<DashboardData> {
	// Simulated API network latency (400ms) for realistic UX and loading states test
	await new Promise((resolve) => setTimeout(resolve, 400));

	/* 
	 * FUTURE API INTEGRATION:
	 * 
	 * if (api && establishmentId) {
	 *   const response = await api.get<DashboardData>(`/dashboard/analytics`, {
	 *     params: { establishmentId, period }
	 *   });
	 *   return response.data;
	 * }
	 */

	return mockDashboardData;
}
