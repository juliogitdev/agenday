import type { AppointmentCardType } from '../types/AppointmentTypes';

export type LegacyAppointment = {
	id: string;
	client: string;
	professional: string;
	serviceType: string;
	start: Date;
	end: Date;
	status: string;
};

// Helper function to create relative ISO date strings for dynamic mocking
const getRelativeIsoDate = (dayOffset: number, hour: number, minute: number): string => {
	const d = new Date();
	d.setDate(d.getDate() + dayOffset);
	d.setHours(hour, minute, 0, 0);
	return d.toISOString();
};

const getNextMonthIsoDate = (dayOfMonth: number, hour: number, minute: number): string => {
	const d = new Date();
	d.setMonth(d.getMonth() + 1);
	d.setDate(dayOfMonth);
	d.setHours(hour, minute, 0, 0);
	return d.toISOString();
};

const getPastIsoDate = (dayOffset: number, hour: number, minute: number): string => {
	const d = new Date();
	d.setDate(d.getDate() - dayOffset);
	d.setHours(hour, minute, 0, 0);
	return d.toISOString();
};

export const MOCK_APPOINTMENT_CARDS: AppointmentCardType[] = [
	// --- HOJE (TODAY) ---
	{
		id: 'mock-1',
		customerId: 'c-1',
		customerName: 'Maria Silva',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte Feminino',
		startTime: getRelativeIsoDate(0, 9, 0),
		endTime: getRelativeIsoDate(0, 10, 0),
		status: 'SCHEDULED',
		notes: 'Cliente prefere um corte mais suave nas pontas.',
	},
	{
		id: 'mock-2',
		customerId: 'c-2',
		customerName: 'João Santos',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte + Barba',
		startTime: getRelativeIsoDate(0, 11, 30),
		endTime: getRelativeIsoDate(0, 12, 30),
		status: 'COMPLETED',
		notes: 'Atendimento realizado com sucesso.',
		paymentMethod: 'PIX',
	},
	{
		id: 'mock-3',
		customerId: 'c-3',
		customerName: 'Ana Lima',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carla Lima',
		catalogItemName: 'Hidratação Profunda',
		startTime: getRelativeIsoDate(0, 14, 0),
		endTime: getRelativeIsoDate(0, 15, 0),
		status: 'CANCELED',
		notes: 'Cliente desmarcou por imprevisto de trabalho.',
	},
	{
		id: 'mock-4',
		customerId: 'c-4',
		customerName: 'Marcos Oliveira',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Barba Modelada',
		startTime: getRelativeIsoDate(0, 16, 30),
		endTime: getRelativeIsoDate(0, 17, 15),
		status: 'NO_SHOW',
		notes: 'Aguardando confirmação de chegada do cliente.',
	},

	// --- AMANHÃ (TOMORROW) ---
	{
		id: 'mock-5',
		customerId: 'c-5',
		customerName: 'Lucas Mendes',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Barba Premium',
		startTime: getRelativeIsoDate(1, 10, 0),
		endTime: getRelativeIsoDate(1, 11, 0),
		status: 'SCHEDULED',
		notes: 'Cliente de primeira viagem.',
	},
	{
		id: 'mock-6',
		customerId: 'c-6',
		customerName: 'Patrícia Souza',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Sofia Santos',
		catalogItemName: 'Escova & Penteado',
		startTime: getRelativeIsoDate(1, 14, 0),
		endTime: getRelativeIsoDate(1, 15, 30),
		status: 'SCHEDULED',
		notes: 'Penteado para evento especial.',
	},
	{
		id: 'mock-7',
		customerId: 'c-7',
		customerName: 'Ricardo Almeida',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte Masculino',
		startTime: getRelativeIsoDate(1, 16, 0),
		endTime: getRelativeIsoDate(1, 16, 45),
		status: 'CANCELED',
		notes: 'Reagendado para outra semana.',
	},

	// --- PRÓXIMOS 7 DIAS (NEXT 7 DAYS) ---
	{
		id: 'mock-8',
		customerId: 'c-8',
		customerName: 'Fernanda Rocha',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Mariana Castro',
		catalogItemName: 'Coloração Completa',
		startTime: getRelativeIsoDate(3, 9, 30),
		endTime: getRelativeIsoDate(3, 11, 30),
		status: 'SCHEDULED',
		notes: 'Tom castanho iluminado.',
	},
	{
		id: 'mock-9',
		customerId: 'c-9',
		customerName: 'Camila Nogueira',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carla Lima',
		catalogItemName: 'Escova Profunda',
		startTime: getRelativeIsoDate(4, 13, 0),
		endTime: getRelativeIsoDate(4, 14, 30),
		status: 'COMPLETED',
		notes: 'Cliente fidelizada.',
	},
	{
		id: 'mock-10',
		customerId: 'c-10',
		customerName: 'Gustavo Ribeiro',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte Degradê',
		startTime: getRelativeIsoDate(5, 15, 0),
		endTime: getRelativeIsoDate(5, 16, 0),
		status: 'SCHEDULED',
		notes: 'Degradê navalhado.',
	},
	{
		id: 'mock-11',
		customerId: 'c-11',
		customerName: 'Juliana Costa',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Sofia Santos',
		catalogItemName: 'Maquiagem & Penteado',
		startTime: getRelativeIsoDate(6, 11, 0),
		endTime: getRelativeIsoDate(6, 12, 30),
		status: 'NO_SHOW',
		notes: 'Aguardando pagamento do sinal.',
	},

	// --- PRÓXIMO MÊS (NEXT CALENDAR MONTH) ---
	{
		id: 'mock-12',
		customerId: 'c-12',
		customerName: 'Paulo Henrique',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte + Sobrancelha',
		startTime: getNextMonthIsoDate(5, 10, 0),
		endTime: getNextMonthIsoDate(5, 11, 0),
		status: 'SCHEDULED',
		notes: 'Agendamento recorrente mensal.',
	},
	{
		id: 'mock-13',
		customerId: 'c-13',
		customerName: 'Beatriz Martins',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carla Lima',
		catalogItemName: 'Luzes & Matização',
		startTime: getNextMonthIsoDate(12, 14, 0),
		endTime: getNextMonthIsoDate(12, 17, 0),
		status: 'COMPLETED',
		notes: 'Tratamento pós-luzes incluído.',
	},
	{
		id: 'mock-14',
		customerId: 'c-14',
		customerName: 'Roberto Lima',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte Masculino',
		startTime: getNextMonthIsoDate(18, 09, 0),
		endTime: getNextMonthIsoDate(18, 09, 45),
		status: 'CANCELED',
		notes: 'Cancelado com antecedência.',
	},
	{
		id: 'mock-15',
		customerId: 'c-15',
		customerName: 'Larissa Fernandes',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Mariana Castro',
		catalogItemName: 'Design de Sobrancelha',
		startTime: getNextMonthIsoDate(22, 16, 0),
		endTime: getNextMonthIsoDate(22, 16, 45),
		status: 'SCHEDULED',
		notes: 'Henna marrom escuro.',
	},

	// --- PASSADOS (PAST DATES FOR ALL FILTER) ---
	{
		id: 'mock-16',
		customerId: 'c-16',
		customerName: 'Eduardo Costa',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Carlos Bruno',
		catalogItemName: 'Corte + Barba',
		startTime: getPastIsoDate(5, 14, 0),
		endTime: getPastIsoDate(5, 15, 0),
		status: 'COMPLETED',
		notes: 'Atendimento concluído semana passada.',
	},
	{
		id: 'mock-17',
		customerId: 'c-17',
		customerName: 'Vanessa Paes',
		professionalEstablishmentId: 'est-1',
		professionalName: 'Sofia Santos',
		catalogItemName: 'Manicure Profunda',
		startTime: getPastIsoDate(12, 10, 0),
		endTime: getPastIsoDate(12, 11, 0),
		status: 'COMPLETED',
		notes: 'Atendimento mensal.',
	},
];

export const MOCK_APPOINTMENTS: LegacyAppointment[] = MOCK_APPOINTMENT_CARDS.map((item) => ({
	id: item.id,
	client: item.customerName,
	professional: item.professionalName,
	serviceType: item.catalogItemName,
	start: new Date(item.startTime),
	end: new Date(item.endTime),
	status: item.status === 'SCHEDULED' ? 'accepted' : item.status === 'COMPLETED' ? 'accepted' : 'pending',
}));