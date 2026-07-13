
// 98% vipe code
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import styles from "./styles/appointmentCard.module.css";

export type CardAction = {
	label: string;
	variant: "primary" | "danger" | "outline" | "secondary";
	onClick: () => void;
	disabled?: boolean;
};

export interface AppointmentCardProps {
	onChose: (e: AppointmentCardType)=> void;
	appointment: AppointmentCardType;
	actions?: CardAction[];
	showCustomer?: boolean; // quando true, mostra o cliente (visão do profissional)
}

function formatDateTime(isoString: string): string {
	if (!isoString) return "—";
	try {
		const date = new Date(isoString);
		return (
			date.toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}) + " às " +
			date.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			})
		);
	} catch { return isoString; }
}

function getStatusInfo(status: AppointmentCardType["status"]) {
	switch (status) {
		case "SCHEDULED" : return { label: "Aprovado", className: "approved" };
		case "CANCELED" : return { label: "Recusado", className: "recused" };
		case "COMPLETED": return { label: "Finalizado", className: "finished" };
		case "NO_SHOW" : return { label: "Pendente", className: "pending" };
		default:         return { label: status, className: "pending" };
	}
}

export function AppointmentCard({appointment, actions = [], showCustomer = false,onChose}: AppointmentCardProps) {
	const statusInfo = getStatusInfo(appointment.status);
	const subtitle = showCustomer ? appointment.customerName || "Cliente" : appointment.professionalName || "Profissional";

	return (
		<article className={styles.card} onClick={()=> onChose(appointment)}>
			<div className={`${styles.statusBar} ${styles[statusInfo.className]}`} />

			<header className={styles.header}>
				<h3 className={styles.serviceTitle}>
					{appointment.catalogItemName || "Serviço sem nome"}
				</h3>
				<span className={styles.subtitle}>{subtitle}</span>
			</header>

			<div className={styles.body}>
				<div className={styles.infoRow}>
					<svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<rect x="3" y="4" width="18" height="18" rx="2" />
						<line x1="16" y1="2" x2="16" y2="6" />
						<line x1="8" y1="2" x2="8" y2="6" />
						<line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					<span className={styles.infoValue}> {formatDateTime(appointment.startTime)}</span>
				</div>

				<span className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
					{statusInfo.label}
				</span>
			</div>

			{actions.length > 0 && (
				<footer className={styles.footer}>
					{actions.map((action, index) => (
						<button
							key={index}
							className={`${styles.button} ${styles[`button-${action.variant}`]}`}
							disabled={action.disabled}
							onClick={action.onClick}
						> {action.label} </button>
					))}
				</footer>
			)}
		</article>
	);
}