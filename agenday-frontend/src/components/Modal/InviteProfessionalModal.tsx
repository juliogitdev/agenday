
import React, { useContext, useState } from 'react';
import type { InputCallback } from '../../types/Inputs';
import styles from './styles/inviteProfessionalModal.module.css';
import { EmailInput } from '../inputs/EmailInput';
import { DaysOfWeekSelector, type selected_day } from '../inputs/DaysOfWeekSelector';
import { ModalHook } from '../../hooks/ModalHook';
import { BlackWindow } from '../Ui/BlackWindow';
import { LoadingClock } from '../Alerts/LoadingClock';
import AuthContext from '../../context/AuthContext';
import { ErrorAlert } from '../Alerts/ErrorAlert';
import { SuccessAlert } from '../Alerts/SuccessAlert';
import { AlertHook } from '../../hooks/AlertsHook';
import { CalendarDays } from 'lucide-react';

interface InviteProfessionalModalProps {
	establishmentId: string;
	isVisible: boolean;
	onClose: () => void;
}

interface DaySchedule {
	start: string;
	end: string;
}

export function InviteProfessionalModal({ establishmentId, isVisible, onClose }: InviteProfessionalModalProps) {
	const [emailData, setEmailData] = useState<InputCallback>({ value: '', errorMessage: null, isValid: false });
	const [workingDays, setWorkingDays] = useState<selected_day[]>([]);
	const [workingHours, setWorkingHours] = useState<Record<string, DaySchedule>>({});
	const [professionalEstablishmentId, setProfessionalEstablishmentId] = useState<string>("");

	const blackWindow = ModalHook();
	const isLoadingMd = ModalHook();
	const erroAlert = AlertHook();
	const successAlert = AlertHook();
	const { api } = useContext(AuthContext);

	if (!isVisible) return null;

	const handleHourChange = (dayId: string, field: keyof DaySchedule, value: string) => {
		setWorkingHours(prev => ({
			...prev,
			[dayId]: { ...prev[dayId], [field]: value }
		}));
	};

	const handleReplicateHours = () => {
		if (workingDays.length <= 1) return;
		const firstDay = workingDays[0].id;
		const firstDaySchedule = workingHours[firstDay];

		if (!firstDaySchedule || !firstDaySchedule.start || !firstDaySchedule.end) {
			erroAlert.show("Aviso", "Preencha o horário do primeiro dia antes de replicar.", 3000);
			return;
		}

		const updatedHours = { ...workingHours };
		workingDays.forEach(day => {
			updatedHours[day.id] = { ...firstDaySchedule };
		});

		setWorkingHours(updatedHours);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!emailData.isValid) return;

		if (workingHours && Object.keys(workingHours).length === 0 ) {
			erroAlert.show("Erro", "Nenhúm horário foi definido para o profissional", 3000);
			return;
		}
		const payload = {
			establishmentId,
			emailProfessional: emailData.value,
		};

		blackWindow.show();
		isLoadingMd.show();
		
		setTimeout(async () => {
			try {
				const r = await api.post("professional-establishments", payload);
				if (r.status == 201) {
					const professionalEstablishmentId =  r.data.id;
					const hoursEntries = Object.entries(workingHours);
					
					for (const [day, times] of hoursEntries) {
      					const workingHoursPayload = {
        					professionalEstablishmentId: professionalEstablishmentId,
        					dayOfWeek: day, 
        					startTime: (times.start),
        					endTime: times.end
      					};
						console.log(workingHoursPayload)
      					await api.post("professional-schedules", workingHoursPayload);
    				}
					successAlert.show("Sucesso", `O convite foi enviado para o profissional ${emailData.value}`, 3000);
				}
			} catch (error: any) { 
				const errorMsg = error?.response?.data.message || "Desculpe, houve um erro durante o processo..";
				erroAlert.show("Erro", errorMsg, 3000);
			} finally {
				isLoadingMd.hidden();
				blackWindow.hidden();
			}
		}, 1000);
	};

	return (
		<div className={styles.modalBox}>
			<button className={styles.closeTop} onClick={onClose}> &times;</button>
			<div className={styles.brandingHeader}>
				<h2>Convide um Funcionário</h2>
				<p>Insira os detalhes para vincular um novo profissional a este estabelecimento.</p>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<EmailInput
					label="E-mail do Profissional"
					placeholder="colaborador@empresa.com"
					onChangeField={(value) => setEmailData(value)}
				/>
				<br />
				<DaysOfWeekSelector
					label="Dias de Trabalho Semanal"
					onChangeDays={(days) => setWorkingDays(days)}
				/>
				
				
					<div className={styles.dynamicFieldsSection}>
						<div className={styles.sectionHeaderRow}>
							<span className={styles.radioLabelSection}>Configurar Horários</span>
							{workingDays.length > 1 && (
								<button 
									type="button" 
									className={styles.replicateBtn}
									onClick={handleReplicateHours}
									title="Copia o horário do primeiro dia para todos os demais"
								> 
									Repetir horário p/ todos 
								</button>
							)}
						</div>
						
						<div className={styles.scheduleListGrid}>
							{workingDays.map(day => (
								<div key={day.id} className={styles.scheduleRowItem}>
									<span className={styles.scheduleDayName}>  <CalendarDays /> {day.label}</span>
									<div className={styles.scheduleInputsGroup}>
										<input 
											type="time" 
											value={workingHours[day.id]?.start || ''}
											onChange={(e) => handleHourChange(day.id, 'start', e.target.value)}
											required
										/>
										<span className={styles.separatorText}>até</span>
										<input
											type="time"
											min={workingHours[day.id]?.start} 
											value={workingHours[day.id]?.end || ''}
											onChange={(e) => handleHourChange(day.id, 'end', e.target.value)}
											required
										/>
									</div>
								</div>
							))}
						</div>
					</div>

				<div className={styles.actions}>
					<button type="button" className={styles.cancelBtn} onClick={onClose}>
						Cancelar
					</button>
					<button 
						type="submit" 
						className={styles.submitBtn} 
						disabled={!emailData.isValid}
					>
						Enviar Convite
					</button>
				</div>
			</form>
			
			<BlackWindow isVisible={blackWindow.visible}>
				<LoadingClock 
					isLoading={isLoadingMd.visible} 
					text='Convidando Profissional, por favor aguarde'
				/>
			</BlackWindow>
			<ErrorAlert isVisible={erroAlert.isVisible} title={erroAlert.title} message={erroAlert.message}/>
			<SuccessAlert isVisible={successAlert.isVisible} title={successAlert.title} message={successAlert.message}/>
		</div>
	);
}