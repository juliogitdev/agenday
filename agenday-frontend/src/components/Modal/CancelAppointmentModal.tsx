
import { X } from "lucide-react";
import type { ComboBoxOption } from "../../types/ComboBox";
import { ComboBox } from "../inputs/ComboBox";
import { TextInput } from "../inputs/TextInput";
import { SolidButton } from "../buttons/SolidButton";
import styles from "./styles/cancelappointmentmodal.module.css";
import { ErrorAlert } from "../Alerts/ErrorAlert";
import { SuccessAlert } from "../Alerts/SuccessAlert";
import { AlertHook } from "../../hooks/AlertsHook";
import AuthContext from "../../context/AuthContext";
import { useContext, useState } from "react";

export type CancelAppointmentModalProps = {
	appointmentId: string;
	updateList: ()=> void;
	isVisible: boolean;
	onClose: () => void;
};

export function CancelAppointmentModal({onClose, isVisible, updateList, appointmentId}: CancelAppointmentModalProps) {
	if (!isVisible) return null; 
	
	const [loading, setLoading] = useState<boolean>(false)
	const erroAlert    = AlertHook();
	const successAlert = AlertHook();
	const { api } = useContext(AuthContext);

	const cancellationReasons: ComboBoxOption = {
		options: [
			{ label: "Imprevisto pessoal", value: "personal_reason" },
			{ label: "Problema de saúde", value: "health_issue" },
			{ label: "Conflito de agenda", value: "schedule_conflict" },
			{ label: "Problema de transporte", value: "transport_issue" },
			{ label: "Erro no agendamento", value: "booking_error" },
			{ label: "Alteração de disponibilidade", value: "availability_change" },
			{ label: "Motivo operacional", value: "operational_reason" },
			{ label: "Condições climáticas / força maior", value: "force_majeure" },
			{ label: "Outro motivo", value: "other" }
		]
	};

	const cancelAppointment =  async ()=> {
		setLoading(true)
		setTimeout(async ()=> {
			const r = await api.delete(`appointments/${appointmentId}`);
			if (r.status == 204 ) {
				updateList();
				setTimeout(()=>{ onClose();}, 2300);
				successAlert.show("Sucesso","O horário foi cancelado com sucesso", 2000);
			}else {
				setLoading(false)
				erroAlert.show("Erro", "Não foi possível cancelar esté horário, por favor tente outra hora", 3000);
			}
		}, 500);
	}

	return (
		<div className={styles.CancelAppointmentModal}>
			{loading && (
				<div className={styles.loadingOverlay}>
					<div className={styles.loadingContent}>
						<div className={styles.loadingSpinner} />
						<span className={styles.loadingText}>Por favor aguarde...</span>
					</div>
				</div>
			)}

			<button className={styles.closeButton} onClick={onClose}> <X size={18}/></button>
			<div className={styles.header}>
				<h1 className={styles.title}> Cancelar Agendamento</h1>
			</div>

			<div className={styles.form}>
				<ComboBox
					label="Motivo do cancelamento"
					initialValue={{
						value: cancellationReasons,
						errorMessage: null,
						isValid: false
					}}
				/>
				<TextInput
					initialValue=""
					label="Observações (opcional)"
					placeholder="Adicione mais detalhes sobre o motivo do cancelamento..."
					_height={120}
					onChangeField={(value:any)=>console.log(value)}
				/>
			</div>

			<div className={styles.footer}>
				<div className={styles.infoBox}>
					<strong>Atenção</strong>
					<span> Depois da confirmação o horário será cancelado e os envolvidos receberão uma notificação.</span>
				</div>
				<div className={styles.actions}>
					<SolidButton
						text="Confirmar cancelamento"
						isActive={true}
						isLoading={false}
						onClick={()=>{
							cancelAppointment();
						}}
					/>
				</div>
			</div>
			<ErrorAlert   isVisible={erroAlert.isVisible} title={erroAlert.title} message={erroAlert.message}/>
			<SuccessAlert isVisible={successAlert.isVisible} title={successAlert.title} message={successAlert.message}/>
		</div>
	);
}