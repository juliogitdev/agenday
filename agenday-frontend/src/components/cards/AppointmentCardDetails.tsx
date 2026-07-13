
import { useEffect, useState } from "react";
import styles from "./styles/appointmentCardDetails.module.css";
import type { AppointmentCardType } from "../../types/AppointmentTypes";


interface AppointmentDetailsProps {
	appointment: AppointmentCardType | null;
	loading?: boolean;
}

function formatDateTime(isoString: string): string {
	if (!isoString) return "—";
	try {
		const date = new Date(isoString);
		return date.toLocaleDateString("pt-BR", {
			weekday: "long",
			day: "2-digit",
			month: "long",
		}) + " às " + date.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return isoString;
	}
}

function formatShortDateTime(isoString: string): string {
	if (!isoString) return "—";
	try {
		const date = new Date(isoString);
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
		}) + " às " + date.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return isoString;
	}
}

function getStatusInfo(status: AppointmentCardType["status"]) {
	switch (status) {
		case "SCHEDULED": return { label: "aprovado", className: styles.statusApproved };
		case "CANCELED" : return { label: "recusado", className: styles.statusRecused };
		case "COMPLETED": return { label: "finalizado", className: styles.statusFinished };
		case "NO_SHOW"  : return { label: "pendente", className: styles.statusPending };
		default:          return { label: status, className: styles.statusPending };
	}
}

export function AppointmentCardDetails({ appointment, loading = false }: AppointmentDetailsProps) {
	const [currentAppointment, setCurrentAppointment] = useState<AppointmentCardType | null>(appointment);

	useEffect(() => {
		setCurrentAppointment(appointment);
	}, [appointment]);

	if (!currentAppointment && !loading) {
		return null;
	}

	const statusInfo = currentAppointment ? getStatusInfo(currentAppointment.status) : null;

	return (
		<div className={styles.container}>
			{loading && (
				<div className={styles.loadingOverlay}>
					<div className={styles.loadingContent}>
						<div className={styles.loadingSpinner} />
						<span className={styles.loadingText}>Carregando...</span>
					</div>
				</div>
			)}

			<div className={`${styles.card} ${loading ? styles.cardBlurred : ""}`}>
				{/* Header */}
				<header className={styles.header}>
					<h2 className={styles.title}>Detalhes do agendamento</h2>
				</header>

				{currentAppointment && (
					<>
						{/* Service Title + Status */}
						<div className={styles.serviceHeader}>
							<div>
								<h3 className={styles.serviceTitle}>{currentAppointment.catalogItemName}</h3>
								<p className={styles.serviceDateTime}>
									{formatDateTime(currentAppointment.startTime)}
								</p>
							</div>
							{statusInfo && (
								<span className={`${styles.statusBadge} ${statusInfo.className}`}>
									{statusInfo.label}
								</span>
							)}
						</div>

						{/* Info Grid */}
						<div className={styles.infoGrid}>
							<div className={styles.infoCard}>
								<span className={styles.infoLabel}>PROFISSIONAL</span>
								<span className={styles.infoValue}>{currentAppointment.professionalName}</span>
							</div>
							<div className={styles.infoCard}>
								<span className={styles.infoLabel}>AGENDADO EM</span>
								<span className={styles.infoValue}>
									{formatShortDateTime(currentAppointment.startTime)}
								</span>
							</div>
							<div className={styles.infoCardFull}>
								<span className={styles.infoLabel}>ESTABELECIMENTO</span>
								<span className={styles.infoValue}>{currentAppointment.customerName}</span>
							</div>
						</div>

						{/* Notes */}
						{currentAppointment.notes && currentAppointment.notes.trim() !== "" && (
							<div className={styles.notesSection}>
								<h4 className={styles.sectionTitle}>OBSERVAÇÕES</h4>
								<div className={styles.notesContent}>
									{currentAppointment.notes}
								</div>
							</div>
						)}

						{/* Footer - Mock Payment Info */}
						<footer className={styles.footer}>
							<div className={styles.paymentInfo}>
								<div className={styles.paymentRow}>
									<span className={styles.paymentLabel}>FORMA DE PAGAMENTO:</span>
									<span className={styles.paymentValue}>
										{currentAppointment.paymentMethod || "---"}
									</span>
								</div>
								<div className={styles.paymentRow}>
									<span className={styles.paymentLabel}>DATA DO PAGAMENTO:</span>
									<span className={styles.paymentValue}>
										{currentAppointment.paymentDate || "--/--/--"}
									</span>
								</div>
							</div>

							{currentAppointment.paymentReceiptUrl && (
								<button className={styles.receiptButton}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<polyline points="14 2 14 8 20 8" />
										<line x1="16" y1="13" x2="8" y2="13" />
										<line x1="16" y1="17" x2="8" y2="17" />
										<polyline points="10 9 9 9 8 9" />
									</svg>
									ver comprovante
								</button>
							)}
						</footer>
					</>
				)}
			</div>
		</div>
	);
}