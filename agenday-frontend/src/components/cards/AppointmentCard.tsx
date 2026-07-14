
import { Calendar, Scissors, User, Clock } from "lucide-react"; // Adicionei o Clock
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import styles from "./styles/appointmentCard.module.css";

export type CardAction = {
	label: string;
	variant: "primary" | "danger" | "outline" | "secondary";
	onClick: () => void;
	disabled?: boolean;
};

export interface AppointmentCardProps {
	onChose: (e: AppointmentCardType) => void;
	appointment: AppointmentCardType;
	actions?: CardAction[];
	showCustomer?: boolean;
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
		case "SCHEDULED": return { label: "Agendado", className: "approved" };
		case "CANCELED": return { label: "Cancelado", className: "recused" };
		case "COMPLETED": return { label: "Finalizado", className: "finished" };
		case "NO_SHOW": return { label: "Pendente", className: "pending" };
		default: return { label: status, className: "pending" };
	}
}

function getProximityAlert(isoString: string, status: string) {
	if (status !== "SCHEDULED") return null;
	const now = new Date();
	const appDate = new Date(isoString);
	const diffMs = appDate.getTime() - now.getTime();
	const diffMinutes = Math.floor(diffMs / 60000);

	if (diffMinutes < 0) return null;
	if (diffMinutes <= 60) { return { text: `Em ${diffMinutes} min!`, isUrgent: true };}
	if (
		appDate.getDate() === now.getDate() &&
		appDate.getMonth() === now.getMonth() &&
		appDate.getFullYear() === now.getFullYear()
	) {
		const diffHours = Math.floor(diffMinutes / 60);
		return { text: `Hoje (em ${diffHours}h)`, isUrgent: false };
	}

	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (
		appDate.getDate() === tomorrow.getDate() &&
		appDate.getMonth() === tomorrow.getMonth() &&
		appDate.getFullYear() === tomorrow.getFullYear()
	) {
		return { text: "Amanhã", isUrgent: false };
	}

	return null;
}

export function AppointmentCard({ appointment, actions = [], showCustomer = false, onChose }: AppointmentCardProps) {
	const statusInfo = getStatusInfo(appointment.status);
	const subtitle = showCustomer ? appointment.customerName || "Cliente" : appointment.professionalName || "Profissional";
	const proximity = getProximityAlert(appointment.startTime, appointment.status);

	return (
		<article className={styles.card} onClick={() => onChose(appointment)}>
			<div className={`${styles.statusBar} ${styles[statusInfo.className]}`} />

			<header className={styles.header}>
				<h3 className={styles.serviceTitle}>
					<Scissors size={16} color={"#135184"} />
					{appointment.catalogItemName || "Serviço sem nome"}
				</h3>
				<span className={styles.subtitle}> <User size={16} color="#135184" /> {subtitle}</span>
			</header>

			<div className={styles.body}>
				<div className={styles.infoRow}>
					<Calendar size={16} color="#135184" />
					<span className={styles.infoValue}> {formatDateTime(appointment.startTime)}</span>
				</div>

				<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
					{proximity && (
						<span className={`${styles.proximityBadge} ${proximity.isUrgent ? styles.urgent : styles.soon}`}>
							<Clock size={14} />
							{proximity.text}
						</span>
					)}

					<span className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
						{statusInfo.label}
					</span>
				</div>
			</div>

			{actions.length > 0 && (
				<footer className={styles.footer}>
					{actions.map((action, index) => (
						<button
							key={index}
							className={`${styles.button} ${styles[`button-${action.variant}`]}`}
							disabled={action.disabled}
							onClick={(e) => {
								e.stopPropagation();
								action.onClick();
							}}
						> {action.label} </button>
					))}
				</footer>
			)}
		</article>
	);
}