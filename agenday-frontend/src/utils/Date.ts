
export const buildIsoZ = (dateStr: string, timeStr: string) => {
	const [year, month, day] = dateStr.split("-").map(Number);
  	const parts = timeStr.split(":").map(Number);
  	const hour = parts[0] ?? 0;
  	const minute = parts[1] ?? 0;
  	const second = parts[2] ?? 0;

  	const dt = new Date(Date.UTC(year, month - 1, day, hour, minute, second, 279));
  	return dt.toISOString();
};

export const parseTime = (timeStr: string) => {
  	const [hour, minute] = timeStr.split(':').map(Number);
  	return { hour: hour, minute: minute, second: 0, nano: 0};
};