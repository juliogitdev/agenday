import { useEffect, useState } from 'react';
import { appointmentsService } from '../services/appointments.service';
import type { Appointment } from '../types/appointment.types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentsService.getAll()
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { appointments, loading };
}
