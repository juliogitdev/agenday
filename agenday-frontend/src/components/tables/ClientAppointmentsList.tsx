
import { useContext, useEffect, useState } from "react";
import { AppointmentCard, type CardAction } from "../cards/AppointmentCard";
import AuthContext from "../../context/AuthContext";
import styles from "./styles/clientAppointmentsList.module.css";
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import { BlackWindow } from "../Ui/BlackWindow";
import { ModalHook } from "../../hooks/ModalHook";
import { CancelAppointmentModal } from "../Modal/CancelAppointmentModal";

type clientAppointmentsListProps = {
	isProfessional?:boolean;
	appointmentList?: AppointmentCardType[];
	onChose: (e: AppointmentCardType) => void;
	updateList :boolean;
}


export function ClientAppointmentsList({ onChose, updateList, isProfessional=false, appointmentList }: clientAppointmentsListProps) {
	const [appointments, setAppointments] = useState<AppointmentCardType[]>([]);
	const { api } = useContext(AuthContext);
	const [update, setUpdate] = useState<boolean>()
	const blackWindow  = ModalHook();
	const cancelModal  = ModalHook();

	

	useEffect(() => {
		if (isProfessional) {
			setAppointments(appointmentList || []);
			return;
		}

		let active = true;
		const fetchAppointments = async () => {
			const r = await api.get("appointments/my-appointments");
			if (r.status === 200 && active) {
				setAppointments(r.data);
				console.log(r.data[0])
				onChose(r.data[0]);
			}
		};
		fetchAppointments();
		return () => { active = false; };
	}, [api, updateList,appointmentList,isProfessional,update]);

	function buildActions(appointment: AppointmentCardType): CardAction[] {
		const actions: CardAction[] = [];

		const canCancel = appointment.status !== "COMPLETED" && appointment.status !== "CANCELED";
		const canFeedback = appointment.status === "COMPLETED";

		actions.push({
			label: "Cancelar",
			variant: "danger",
			disabled: !canCancel,
			onClick: () => handleCancel(appointment.id),
		});
		

		if (isProfessional) {
			actions.push({
				label: "Aceitar",
				variant: "secondary",
				disabled: !canCancel,
				onClick: () => handleFeedback(appointment.id),
			});
		} else {
			actions.push({
				label: "Avaliar",
				variant: "primary",
				disabled: !canFeedback,
				onClick: () => handleFeedback(appointment.id),
			});
		}
		return actions;
	}

	async function handleCancel(id: string) {
		blackWindow.show();
		cancelModal.show(id);
	}

	async function handleFeedback(id: string) {
		console.log("Avaliar:", id);
		// TODO: abrir modal de avaliação
	}

	if (appointments.length === 0) {
		return (
			<div className={styles.appointmentsVoidTable}>
				<img src="resource/icons/versao_sem_texto_v2.png" alt="" />
				<p>Você ainda não tem agendamentos</p>
			</div>
		);
	}

	let now = new Date().getTime()
	return (
		<div className={styles.cardsList}>
			{[...appointments]
				.filter((app) => new Date(app.startTime).getTime() >= now)
				.sort((a, b) => {
					const dataA = new Date(a.startTime).getTime();
					const dataB = new Date(b.startTime).getTime();
					return dataA - dataB; }
				)
				.map((appointment) => (
					<AppointmentCard
						onChose={(e: AppointmentCardType) => {onChose(e);}}			
						key={appointment.id}
						appointment={appointment}
						showCustomer={isProfessional}
						actions={buildActions(appointment)}
					/>
				))
			}

			<BlackWindow  isVisible={blackWindow.visible}>
				<CancelAppointmentModal 
					appointmentId={cancelModal.data}
					updateList={()=>{
						setUpdate(!update);
					}}
					isVisible={cancelModal.visible}
					onClose={()=>{
						cancelModal.hidden();
						blackWindow.hidden();
					}}			
				/>
			</BlackWindow>
		</div>
	);
}

