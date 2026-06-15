
import { X } from "lucide-react";
import type { ComboBoxOption } from "../../types/ComboBox";
import { ComboBox } from "../inputs/ComboBox";
import { TextInput } from "../inputs/TextInput";
import styles from "./styles/cancelappointmentmodal.module.css"
import { SolidButton } from "../buttons/SolidButton";

export type CancelAppointmentModalProps = {
	onClose: ()=> void;
}


export function CancelAppointmentModal({onClose}:CancelAppointmentModalProps) {
	const cancellationReasons: ComboBoxOption = {
		options: [
			{ label: "Imprevisto Pessoal / Familiar", value: "personal_reason" },
			{ label: "Problema de Saúde", value: "health_issue" },
			{ label: "Conflito de Agenda / Trabalho", value: "schedule_conflict" },
			{ label: "Problema no Transporte / Trânsito", value: "transport_issue" },
			{ label: "Erro no Agendamento", value: "booking_error" },
			{ label: "Mudança de Planos", value: "change_of_plans" },
			{ label: "Solicitado pelo Estabelecimento", value: "merchant_request" },
			{ label: "Clima / Força Maior", value: "weather_force_majeure" },
			{ label: "Outro Motivo", value: "other" }
		]
	};
	return (
		<div className={styles.CancelAppointmentModal}>
			<div className={styles.header}>
				<h1 className={styles.headerTitle }>
					Cancelar Agendamento 
					<button 
						className={styles.headerCloseBnt}
						onClick={onClose}
					><X size={24}/></button> 
				</h1>
				<span className={styles.headerText}>
					Realmente deseja cancelar o horário do 
					<mark className={styles.headerClientName}>CLIENTE-NAME</mark> ?
				</span>
				<span className={styles.headerTextObs}>obs: O cliente será notificado imediatamente !</span>
			</div>
			<ComboBox
				label="Motivo do Cancelamento"
				initialValue={{
					value: cancellationReasons,
					errorMessage: null,
					isValid: false
				}}
			/>
			<div className={styles.space}></div>
			<TextInput 
				initialValue={''}
				label="Descrição" 
				placeholder="Descreva melhor o motivo do cancelamento" 
				_height={120}
				onChangeField={(d:any)=>{console.log(d)}} 
			/>
			<div className={styles.space}></div>
			<SolidButton 
				text={"Cancelar horário"} 
				isActive={true} 
				onClick={function (): void {
					throw new Error("Function not implemented.");
				}} 
				isLoading={false}				
			/>
		</div>
	);
}