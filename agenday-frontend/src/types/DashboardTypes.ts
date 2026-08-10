export type DashboardPeriod = '7d' | '30d' | '90d' | 'year';

export interface DashboardSummary {
	attendancesThisMonth: number;
	attendancesGrowth: number;
	todayAppointments: number;
	todayAppointmentsGrowth: number;
	monthlyRevenue: number;
	revenueGrowth: number;
	todayRevenue: number;
	averageTicket: number;
	averageTicketGrowth: number;
	newClientsThisMonth: number;
	newClientsGrowth: number;
	occupancyPercentage: number;
	occupancyGrowth: number;
}

export interface DashboardStatusBreakdownItem {
	name: string;
	value: number;
	color: string;
	percentage: number;
}

export interface DashboardDailyAttendanceItem {
	day: string;
	fullDate: string;
	attendances: number;
	revenue: number;
}

export interface DashboardServiceMetric {
	id: string;
	name: string;
	category: string;
	bookings: number;
	revenue: number;
	sharePercentage: number;
}

export interface DashboardUpcomingAppointment {
	id: string;
	clientName: string;
	clientPicture?: string;
	serviceName: string;
	professionalName: string;
	time: string;
	status: 'Agendado' | 'Em andamento' | 'Concluído' | 'Cancelado';
	price: number;
}

export interface DashboardPeakHourItem {
	label: string;
	count: number;
	capacityPercentage: number;
}

export interface DashboardTopClient {
	id: string;
	name: string;
	profilePicture?: string;
	appointmentsCount: number;
	totalSpent: number;
	firstVisit: string;
	lastVisit: string;
}

export interface DashboardOccupancyData {
	occupiedSlots: number;
	totalSlots: number;
	percentage: number;
	peakHoursText: string;
	freeSlots: string[];
}

export interface DashboardPlanUsageData {
	planName: string;
	used: number;
	limit: number;
	percentage: number;
	renewalDate: string;
}

export interface DashboardData {
	summary: DashboardSummary;
	statusBreakdown: DashboardStatusBreakdownItem[];
	dailyAttendance: DashboardDailyAttendanceItem[];
	mostBookedServices: DashboardServiceMetric[];
	topRevenueServices: DashboardServiceMetric[];
	nextAppointments: DashboardUpcomingAppointment[];
	peakHours: DashboardPeakHourItem[];
	occupancy: DashboardOccupancyData;
	topClients: DashboardTopClient[];
	planUsage: DashboardPlanUsageData;
}
