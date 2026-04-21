import dayjs from 'dayjs';

export const formatDate = (date: string) =>
  dayjs(date).format('DD/MM/YYYY');

export const formatDateTime = (date: string) =>
  dayjs(date).format('DD/MM/YYYY [às] HH:mm');

export const isPast = (date: string) =>
  dayjs(date).isBefore(dayjs());
