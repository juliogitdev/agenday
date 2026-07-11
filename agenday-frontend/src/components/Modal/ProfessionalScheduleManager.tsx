
import React, { useContext, useState, useEffect } from 'react';
import styles from './styles/professionalScheduleManager.module.css';
import { DaysOfWeekSelector, type selected_day } from '../inputs/DaysOfWeekSelector';
import { ModalHook } from '../../hooks/ModalHook';
import { BlackWindow } from '../Ui/BlackWindow';
import { LoadingClock } from '../Alerts/LoadingClock';
import AuthContext from '../../context/AuthContext';
import { ErrorAlert } from '../Alerts/ErrorAlert';
import { SuccessAlert } from '../Alerts/SuccessAlert';
import { AlertHook } from '../../hooks/AlertsHook';
import { CalendarDays } from 'lucide-react';

interface ProfessionalScheduleManagerProps {
	establishmentId: string;
	isVisible: boolean;
	onClose: () => void;
}

interface DaySchedule {
	start: string;
	end: string;
}

export function ProfessionalScheduleManager({ establishmentId, isVisible, onClose }: ProfessionalScheduleManagerProps) {
	if (isVisible === false ) return;
	const [workingDays, setWorkingDays] = useState<selected_day[]>([]);
	const [workingHours, setWorkingHours] = useState<Record<string, DaySchedule>>({});
	const [hasExistingData, setHasExistingData] = useState<boolean>(false);
	const [professionalEstablishmentId, setProfessionalEstablishmentId] = useState("nada");
	const { api, user } = useContext(AuthContext);
	const blackWindow = ModalHook();
	const isLoadingMd = ModalHook();
	const erroAlert = AlertHook();
	const successAlert = AlertHook();

	useEffect(() => {
		const loadInitialData = async () => {
			if (!establishmentId) return;

			try {
				let localProfEstabId = "";
				const lr = await api.get(`professional-establishments/establishment/${establishmentId}`);
				
				if (lr.status === 200 ) {
					const professional = lr.data.find((d: any) => d.professionalName === user?.userInformations?.fullName);
					
					if (professional) {
						localProfEstabId = professional.id;
						setProfessionalEstablishmentId(localProfEstabId);
					}
				} else {
					throw new Error("Falha ao buscar estabelecimento do profissional");
				}

				if (localProfEstabId) {
					const { status, data } = await api.get(`professional-schedules/establishment/${localProfEstabId}`);
					
					if (status === 200 && data && data.length > 0) {
						setHasExistingData(true);
						const fetchedDays: selected_day[] = [];
						const fetchedHours: Record<string, DaySchedule> = {};

						data.forEach((schedule: any) => {
							const dayId = schedule.dayOfWeek;
							fetchedDays.push({ id: dayId, label: dayId }); 
							fetchedHours[dayId] = {
								start: schedule.startTime,
								end: schedule.endTime
							};
						});

						setWorkingDays(fetchedDays);
						setWorkingHours(fetchedHours);
					}
				}
			} catch (error) {
				erroAlert.show("Aviso", "Não foi possível obter informações para esta funcionalidade", 3000);
			}
		};

		loadInitialData();
	}, [establishmentId]);


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

		if (workingDays.length === 0 || Object.keys(workingHours).length === 0) {
			erroAlert.show("Erro", "Nenhum horário foi definido para o profissional", 3000);
			return;
		}

		blackWindow.show();
		isLoadingMd.show();

		try {
			for (const day of workingDays) {
				const times = workingHours[day.id];
				if (!times || !times.start || !times.end) continue;

				const payload = {
					professionalEstablishmentId: professionalEstablishmentId,
					dayOfWeek: day.id,
					startTime: times.start,
					endTime: times.end
				};

				await api.post("professional-schedules", payload);
			}
			setHasExistingData(true);
			successAlert.show("Sucesso", "Horários atualizados com sucesso!", 3000);
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message || "Houve um erro ao processar os horários.";
			erroAlert.show("Erro", errorMsg, 3000);
		} finally {
			isLoadingMd.hidden();
			blackWindow.hidden();
		}
	};

	return (
		<div className={styles.containerBox}>
			<div className={styles.brandingHeader}>
				<h2>
					Configurar Jornada de Trabalho
					<span>Defina os dias e horários da sua jornada de atendimento.</span>
				</h2>
				<button className={styles.closeTop} onClick={onClose}>&times;</button>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<DaysOfWeekSelector
					label="Dias de Trabalho Semanal"
					onChangeDays={(days) => setWorkingDays(days)}
				/>

				<div className={styles.dynamicFieldsSection}>
					<div className={styles.sectionHeaderRow}>
						<span className={styles.radioLabelSection}>Horários</span>
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
								<span className={styles.scheduleDayName}> <CalendarDays /> {day.label} </span>
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
					<button 
						type="submit" 
						className={styles.submitBtn} 
						disabled={workingDays.length === 0}
					>
						{hasExistingData ? "Atualizar Horários" : "Salvar Horários"}
					</button>
				</div>
			</form>

			<BlackWindow isVisible={blackWindow.visible}>
				<LoadingClock 
					isLoading={isLoadingMd.visible} 
					text='Processando horários, por favor aguarde'
				/>
			</BlackWindow>
			<ErrorAlert isVisible={erroAlert.isVisible} title={erroAlert.title} message={erroAlert.message}/>
			<SuccessAlert isVisible={successAlert.isVisible} title={successAlert.title} message={successAlert.message}/>
		</div>
	);
}