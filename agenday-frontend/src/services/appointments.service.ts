import { api } from './api';

export const appointmentsService = {
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: unknown) => api.post('/appointments', data),
  confirm: (id: string) => api.patch(`/appointments/${id}/confirm`),
  cancel: (id: string, reason: string) =>
    api.patch(`/appointments/${id}/cancel`, { reason }),
};
