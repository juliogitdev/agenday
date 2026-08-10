import { useContext, useEffect, useState, useMemo } from "react";
import { AppointmentCard, type CardAction } from "../cards/AppointmentCard";
import AuthContext from "../../context/AuthContext";
import styles from "./styles/clientAppointmentsList.module.css";
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import { BlackWindow } from "../Ui/BlackWindow";
import { ModalHook } from "../../hooks/ModalHook";
import { CancelAppointmentModal } from "../Modal/CancelAppointmentModal";
import {
	AppointmentsFilterToolbar,
	applyAppointmentsFilter,
	type PeriodFilterType,
	type StatusFilterType,
} from "./AppointmentsFilterToolbar";

type clientAppointmentsListProps = {
	isProfessional?: boolean;
	appointmentList?: AppointmentCardType[];
	onChose: (e: AppointmentCardType) => void;
	updateList: boolean;
};

export function ClientAppointmentsList({
	onChose,
	updateList,
	isProfessional = false,
	appointmentList,
}: clientAppointmentsListProps) {
	const [rawAppointments, setRawAppointments] = useState<AppointmentCardType[]>([]);
	const { api } = useContext(AuthContext);
	const [update, setUpdate] = useState<boolean>();
	const blackWindow = ModalHook();
	const cancelModal = ModalHook();

	// Filter state
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilterType>("all");
	const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>("ALL");
	const [customStartDate, setCustomStartDate] = useState<string>("");
	const [customEndDate, setCustomEndDate] = useState<string>("");

	useEffect(() => {
		if (isProfessional) {
			const list = appointmentList || [];
			setRawAppointments(list);
			if (list.length > 0) {
				onChose(list[0]);
			}
			return;
		}

		let active = true;
		const fetchAppointments = async () => {
			try {
				const r = await api.get("appointments/my-appointments");
				if (r.status === 200 && active) {
					const list = Array.isArray(r.data) ? r.data : [];
					setRawAppointments(list);
					if (list.length > 0) {
						onChose(list[0]);
					}
				}
			} catch (error) {
				if (active) {
					setRawAppointments([]);
				}
			}
		};

		fetchAppointments();
		return () => {
			active = false;
		};
	}, [api, updateList, appointmentList, isProfessional, update]);

	// Filtered appointments list calculation
	const filteredAppointments = useMemo(() => {
		const result = applyAppointmentsFilter(
			rawAppointments,
			selectedPeriod,
			selectedStatus,
			customStartDate,
			customEndDate
		);

		return [...result].sort((a, b) => {
			const dataA = new Date(a.startTime).getTime();
			const dataB = new Date(b.startTime).getTime();
			return dataA - dataB;
		});
	}, [rawAppointments, selectedPeriod, selectedStatus, customStartDate, customEndDate]);

	// Update selected appointment details card when filter changes
	useEffect(() => {
		if (filteredAppointments.length > 0) {
			onChose(filteredAppointments[0]);
		}
	}, [filteredAppointments]);

	const handleResetFilters = () => {
		setSelectedPeriod("all");
		setSelectedStatus("ALL");
		setCustomStartDate("");
		setCustomEndDate("");
	};

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
	}

	return (
		<div className={styles.cardsListWrapper}>
			<AppointmentsFilterToolbar
				selectedPeriod={selectedPeriod}
				onChangePeriod={setSelectedPeriod}
				selectedStatus={selectedStatus}
				onChangeStatus={setSelectedStatus}
				customStartDate={customStartDate}
				onChangeStartDate={setCustomStartDate}
				customEndDate={customEndDate}
				onChangeEndDate={setCustomEndDate}
				totalResults={filteredAppointments.length}
				totalOriginal={rawAppointments.length}
				onResetFilters={handleResetFilters}
			/>

			{filteredAppointments.length === 0 ? (
				<div className={styles.appointmentsVoidTable}>
					<img src="resource/icons/versao_sem_texto_v2.png" alt="" />
					<p>Nenhum agendamento encontrado para os filtros selecionados</p>
					<button
						type="button"
						style={{
							marginTop: "12px",
							padding: "8px 16px",
							borderRadius: "8px",
							border: "none",
							background: "#135184",
							color: "#fff",
							fontWeight: 600,
							cursor: "pointer",
						}}
						onClick={handleResetFilters}
					>
						Limpar Filtros
					</button>
				</div>
			) : (
				<div className={styles.cardsList}>
					{filteredAppointments.map((appointment) => (
						<AppointmentCard
							onChose={(e: AppointmentCardType) => {
								onChose(e);
							}}
							key={appointment.id}
							appointment={appointment}
							showCustomer={isProfessional}
							actions={buildActions(appointment)}
						/>
					))}
				</div>
			)}

			<BlackWindow isVisible={blackWindow.visible}>
				<CancelAppointmentModal
					appointmentId={cancelModal.data}
					updateList={() => {
						setUpdate(!update);
					}}
					isVisible={cancelModal.visible}
					onClose={() => {
						cancelModal.hidden();
						blackWindow.hidden();
					}}
				/>
			</BlackWindow>
		</div>
	);
}
