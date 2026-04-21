export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  dateTime: string;
  status: AppointmentStatus;
  durationMinutes: number;
}
