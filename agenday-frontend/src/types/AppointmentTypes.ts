
export type AppointmentCardType = {
	id: string;
	customerId: string;
	customerName: string;
	professionalEstablishmentId: string;
	professionalName: string;
	catalogItemName: string;
	startTime: string;
	endTime: string;
	status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
	notes: string;
	paymentMethod?: string;
	paymentDate?: string;
	paymentReceiptUrl?: string;
};