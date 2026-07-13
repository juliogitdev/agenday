
import { useContext, useEffect, useState } from "react";
import { AppointmentCard, type AppointmentCardType, type CardAction } from "../cards/AppointmentCard";
import AuthContext from "../../context/AuthContext";
import styles from "./styles/clientAppointmentsList.module.css";

export function ClientAppointmentsList({ onChose }: { onChose: (e: AppointmentCardType) => void }) {
	const [appointments, setAppointments] = useState<AppointmentCardType[]>([]);
	const { api } = useContext(AuthContext);

	useEffect(() => {
		let active = true;
		const fetchAppointments = async () => {
			const r = await api.get("appointments/my-appointments");
			if (r.status === 200 && active) {
				setAppointments(r.data);
			}
		};
		fetchAppointments();
		return () => { active = false; };
	}, [api]);

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

		actions.push({
			label: "Avaliar",
			variant: "primary",
			disabled: !canFeedback,
			onClick: () => handleFeedback(appointment.id),
		});

		return actions;
	}

	async function handleCancel(id: string) {
		console.log("Cancelar:", id);
		// TODO: api.put(`appointments/${id}/cancel`)
	}

	async function handleFeedback(id: string) {
		console.log("Avaliar:", id);
		// TODO: abrir modal de avaliação
	}

	if (appointments.length === 0) {
		return (
			<div className="appointmentsVoidTable">
				<img src="resource/icons/versao_sem_texto_v2.png" alt="" />
				<p>Você ainda não tem agendamentos</p>
			</div>
		);
	}

	return (
		<div className={styles.cardsList}>
			{appointments.map((appointment) => (
				<AppointmentCard
					onChose={(e:AppointmentCardType)=>{
						onChose(e)
					}}			
					key={appointment.id}
					appointment={appointment}
					actions={buildActions(appointment)}
				/>
			))}
		</div>
	);
}

