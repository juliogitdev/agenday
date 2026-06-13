
import { Check, X } from 'lucide-react';
import styles from './styles/notifications.module.css';
import {NotificationsMock}  from "./../../mocks/NotificationsMock"

export type NotificationModalProps = {
	onClose: () => void; // Define any props you want to pass to the NotificationModal here
}

export function NotificationModal({ onClose }: NotificationModalProps) {

  	return (
		<div className={styles.notifications}>
			<div className={styles.header}>
				<h2>Solicitações de agendamento</h2>
				<button onClick={onClose}><X/></button>
			</div>

			<ul className={styles.tableHeader}>
				<li className={styles.tableHeaderItem}>Cliente</li>
				<li className={styles.tableHeaderItem}>Serviço e Horário</li>
				<li className={styles.tableHeaderItem}>Data da Solicitação</li>
				<li className={styles.tableHeaderItem}>Ações</li>
			</ul>
			<ul className={styles.tableBody}>
				{NotificationsMock.map((n, i) => (
					<li className={styles.tableRow}>
						<div className={styles.clientInfo}>
							<img src={n.clientImageUrl} alt="" className={styles.clientImage}/>
							<div className={styles.clientDetails}>
								<span className={styles.clientName}>{n.clientName}</span>
								<span className={styles.clientFirstAppointment}> {n.clientHistory}</span>
							</div>
						</div>
						<div className={styles.serviceInfoContainer}>
							<span className={styles.serviceInfo}>{n.serviceName}</span>
							<span className={styles.deadline}>{n.serviceDeadLine}</span>
						</div>
						<span className={styles.requestDate}>{n.serviceRequestDate}</span>
						<div className={styles.actions}>
							<button><Check color="green"/></button>
							<button><X color="red"/></button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}