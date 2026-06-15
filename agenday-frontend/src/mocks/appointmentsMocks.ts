import type { Appointment } from '../components/tables/AppointmentsTable'

export const MOCK_APPOINTMENTS: Appointment[] = [
	{
		id: '1',
		client: 'Maria Silva',
		professional: 'Carlos Bruno',
		serviceType: 'Corte Feminino',
		start: new Date(2026, 5, 1, 9, 0),
		end: new Date(2026, 5, 1, 10, 0),
		status: 'accepted'
	},
	{
		id: '2',
		client: 'João Santos',
		professional: 'Carlos Bruno',
		serviceType: 'Corte + Barba',
		start: new Date(2026, 5, 1, 10, 30),
		end: new Date(2026, 5, 1, 11, 30),
		status: 'accepted'
	},
	{
		id: '3',
		client: 'Ana Lima',
		professional: 'Carlos Bruno',
		serviceType: 'Hidratação',
		start: new Date(2026, 5, 2, 8, 30),
		end: new Date(2026, 5, 2, 9, 30),
		status: 'pending'
	},
	{
		id: '4',
		client: 'Marcos Oliveira',
		professional: 'Carlos Bruno',
		serviceType: 'Barba',
		start: new Date(2026, 5, 2, 14, 0),
		end: new Date(2026, 5, 2, 14, 30),
		status: 'accepted'
	},
	{
		id: '5',
		client: 'Patrícia Souza',
		professional: 'Carlos Bruno',
		serviceType: 'Escova',
		start: new Date(2026, 5, 2, 15, 0),
		end: new Date(2026, 5, 2, 16, 0),
		status: 'accepted'
	},
	{
		id: '6',
		client: 'Ricardo Almeida',
		professional: 'Carlos Bruno',
		serviceType: 'Corte Masculino',
		start: new Date(2026, 5, 3, 9, 0),
		end: new Date(2026, 5, 3, 9, 45),
		status: 'accepted'
	},
	{
		id: '7',
		client: 'Fernanda Rocha',
		professional: 'Carlos Bruno',
		serviceType: 'Coloração',
		start: new Date(2026, 5, 3, 13, 0),
		end: new Date(2026, 5, 3, 15, 0),
		status: 'pending'
	},
	{
		id: '8',
		client: 'Lucas Mendes',
		professional: 'Carlos Bruno',
		serviceType: 'Barba Premium',
		start: new Date(2026, 5, 4, 11, 0),
		end: new Date(2026, 5, 4, 12, 0),
		status: 'accepted'
	},
	{
		id: '9',
		client: 'Camila Nogueira',
		professional: 'Carlos Bruno',
		serviceType: 'Progressiva',
		start: new Date(2026, 5, 4, 14, 0),
		end: new Date(2026, 5, 4, 17, 0),
		status: 'accepted'
	},
	{
		id: '10',
		client: 'Gustavo Ribeiro',
		professional: 'Carlos Bruno',
		serviceType: 'Corte Degradê',
		start: new Date(2026, 5, 5, 8, 0),
		end: new Date(2026, 5, 5, 8, 45),
		status: 'accepted'
	},
	{
		id: '11',
		client: 'Juliana Costa',
		professional: 'Carlos Bruno',
		serviceType: 'Penteado',
		start: new Date(2026, 5, 5, 16, 0),
		end: new Date(2026, 5, 5, 17, 30),
		status: 'pending'
	},
	{
		id: '12',
		client: 'Paulo Henrique',
		professional: 'Carlos Bruno',
		serviceType: 'Corte + Sobrancelha',
		start: new Date(2026, 5, 6, 9, 30),
		end: new Date(2026, 5, 6, 10, 30),
		status: 'accepted'
	},
	{
		id: '13',
		client: 'Beatriz Martins',
		professional: 'Carlos Bruno',
		serviceType: 'Luzes',
		start: new Date(2026, 5, 6, 13, 30),
		end: new Date(2026, 5, 6, 16, 30),
		status: 'conflict'
	},
	{
		id: '14',
		client: 'Roberto Lima',
		professional: 'Carlos Bruno',
		serviceType: 'Corte Masculino',
		start: new Date(2026, 5, 7, 10, 0),
		end: new Date(2026, 5, 7, 10, 45),
		status: 'pending'
	},
	{
		id: '15',
		client: 'Larissa Fernandes',
		professional: 'Carlos Bruno',
		serviceType: 'Maquiagem',
		start: new Date(2026, 5, 7, 15, 0),
		end: new Date(2026, 5, 7, 17, 0),
		status: 'accepted'
	}
]