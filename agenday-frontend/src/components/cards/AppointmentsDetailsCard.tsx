
import type { ComboBoxOption } from "../../types/ComboBox";
import styles from "./styles/appointmentsDetailsCard.module.css";
import { ComboBox } from "../inputs/ComboBox";
import { SolidButton } from "../buttons/SolidButton";
import { SendFile } from "../inputs/SendFile";

export interface AppointmentsDetailsProps {
	appointmentId: string;
	serviceName: string;
	serviceCreatedAt: string;
	firstClientAppointmentDate?: string;
	clientAppointmentsCaount?: number;
	serviceDeadline: string;
	profissinalName: string;
	disabled: boolean;
	loading: boolean;
	observations: string;
	clienteName: string;
	clientPicture: string | null;
	showCloseBtn?: boolean;
	onClose?: () => void;
}

export function AppointmentsDetailsCard({
	appointmentId,
	serviceName,
	serviceCreatedAt,
	firstClientAppointmentDate,
	clientAppointmentsCaount,
	serviceDeadline,
	profissinalName,
	observations,
	clienteName,
	clientPicture,
	disabled,
	loading,
	showCloseBtn = false,
	onClose
}: AppointmentsDetailsProps) {

	const paymentOptions: ComboBoxOption = {
		options: [
			{label: "Pix", value: "pix"},
			{label: "Dinheiro", value: "money"},
			{label: "Cartão de Crédito",value: "credit_card"},
			{label: "Cartão de Débito", value: "debit_card"},
			{label: "Transferência Bancária", value: "bank_transfer"}
		]
	};

	return (
		<section className={styles.container}>
			<h1 className={styles.appointmentsDetailsTitle}>Detalhes do serviço</h1>
			<p className={styles.appointmentsDetailsHeadline}> 
				{serviceName} <span className={styles.appointmentsDetailsDeadline}> prazo final, - {serviceDeadline}</span>
			</p>

			<div className={styles.appointmentsClientDetailsContent}>
				<img className={styles.clientPicture} src={clientPicture || "https://via.placeholder.com/150"} alt={clienteName} />
				<div className={styles.appointmentsClientDetails}>
					<p className={styles.clientName}>{clienteName}</p>
					<p className={styles.clientLabel}>cliente desde {firstClientAppointmentDate}</p>
					<p className={styles.clientLabel}>{clientAppointmentsCaount}° agendamento deste cliente</p>
				</div>
			 </div>

			<div className={styles.serviceDetailsContent}>
				<p className={styles.serviceDetails}> Profissional  <span>{profissinalName}</span> </p>
				<p className={styles.serviceDetails}> Agendado em <span>{serviceCreatedAt}</span></p>
			</div>

			<p className={styles.serviceObservationsTitle}> Observações <span>{observations}</span> </p>
			<div className={styles.paymentOptionsContent}>
				<h1 className={styles.paymentOptionsTitle}>Opções de Pagamento</h1>
				<ComboBox
					label=""
					initialValue={{
						value: paymentOptions,
						errorMessage: null,
						isValid: false
					}}
				/>
				<SendFile 
					label=""
						initialValue={{
							value: {file: null},
							errorMessage: null,
							isValid: false
						}}
						onChangeField={(value) => console.log(value)}
					/>
				</div>

				<SolidButton 
					text="Registrar Pagamento"
					isActive={true}
					onClick={() => console.log("Registrar pagamento")}
					isLoading={false}
				/>
				<button className={styles.cancelButton}>Cancelar Serviço</button>
	

		</section>
	);
}