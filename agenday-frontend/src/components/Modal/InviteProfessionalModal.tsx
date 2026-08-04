
import React, { useContext, useState } from 'react';
import type { InputCallback } from '../../types/Inputs';
import styles from './styles/inviteProfessionalModal.module.css';
import { EmailInput } from '../inputs/EmailInput';
import { DaysOfWeekSelector } from '../inputs/DaysOfWeekSelector';
import { ModalHook } from '../../hooks/ModalHook';
import { BlackWindow } from '../Ui/BlackWindow';
import { LoadingClock } from '../Alerts/LoadingClock';
import AuthContext from '../../context/AuthContext';
import { ErrorAlert } from '../Alerts/ErrorAlert';
import { SuccessAlert } from '../Alerts/SuccessAlert';
import { AlertHook } from '../../hooks/AlertsHook';

interface InviteProfessionalModalProps {
	establishmentId: string;
	isVisible: boolean;
	onClose: () => void;
}

type ContractType = 'clt' | 'freelancer';

export function InviteProfessionalModal({ establishmentId, isVisible, onClose}: InviteProfessionalModalProps) {
	const [contractType, setContractType] = useState<ContractType>('clt');
	const [emailData, setEmailData] = useState<InputCallback>({ value: '', errorMessage: null, isValid: false });
	const [workingDays, setWorkingDays] = useState<string[]>([]);

	const blackWindow  = ModalHook();
	const isLoadingMd  = ModalHook();
	const erroAlert    = AlertHook();
	const successAlert = AlertHook();

	const [cltHours, setCltHours] = useState('8'); 
	const [cltSalary, setCltSalary] = useState('');
	const [freeHours, setFreeHours] = useState('');
	const [freeValue, setFreeValue] = useState('');
	const { api } = useContext(AuthContext);

	if (!isVisible) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!emailData.isValid) return;

		const payload = {
			establishmentId,
			emailProfessional: emailData.value,
			// contractType,
			// workingDays,
			// details: contractType === 'clt'
			// 	? { hoursPerDay: cltHours, baseSalary: cltSalary }
			// 	: { hoursBank: freeHours, ratePerExecution: freeValue }
		};

		blackWindow.show();
		isLoadingMd.show();
		setTimeout(async ()=> {
			try {
    			await api.post("professional-establishments", payload);
    			successAlert.show("Sucesso", "Convite enviado com sucesso", 3000);
			} catch (error: any) { 
				const errorMsg =  error?.response?.data.message || "Desculpe, ouve um erro durante o processo..";
				erroAlert.show("Erro", errorMsg, 3000);
			}
			finally {
				isLoadingMd.hidden();
				blackWindow.hidden();
			}
		},1000);
	};

	return (
		<div className={styles.modalBox}>
			<button className={styles.closeTop} onClick={onClose}>&times;</button>

			<div className={styles.brandingHeader}>
				<h2>Convide um Funcionário</h2>
				<p>Insira os detalhes contratuais para vincular um novo profissional a este estabelecimento.</p>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<EmailInput
					label="E-mail do Profissional"
					placeholder="colaborador@empresa.com"
					onChangeField={(value) => setEmailData(value)}
				/>

				<div className={styles.radioGroupContainer}>
					<span className={styles.radioLabelSection}>Tipo de Regime</span>
					<div className={styles.radioOptions}>
						<label className={`${styles.radioCard} ${contractType === 'clt' ? styles.radioCardActive : ''}`}>
							<input
								type="radio"
								name="contractType"
								value="clt"
								checked={contractType === 'clt'}
								onChange={() => setContractType('clt')}
							/>
							<div className={styles.radioText}>
								<strong>CLT</strong>
								<span>Regime Tradicional</span>
							</div>
						</label>

						<label className={`${styles.radioCard} ${contractType === 'freelancer' ? styles.radioCardActive : ''}`}>
							<input
								type="radio"
								name="contractType"
								value="freelancer"
								checked={contractType === 'freelancer'}
								onChange={() => setContractType('freelancer')}
							/>
							<div className={styles.radioText}>
								<strong>Freelancer</strong>
								<span>Horas Flexíveis</span>
							</div>
						</label>
					</div>
				</div>


				<DaysOfWeekSelector
					label="Dias de Trabalho Semanal"
					onChangeDays={(days) => setWorkingDays(days)}
				/>


				<div className={styles.dynamicFieldsSection}>
					{contractType === 'clt' ? (
						<div className={styles.rowFields}>
							<div className={styles.inputWrapper}>
								<label>Horas de Trabalho Diárias</label>
								<input
									type="number"
									placeholder="Ex: 8"
									value={cltHours}
									onChange={(e) => setCltHours(e.target.value)}
								/>
							</div>
							<div className={styles.inputWrapper}>
								<label>Valor R$</label>
								<input
									className={styles.moneyInput}
									type="text"
									placeholder="0.00"
									value={cltSalary}
									onChange={(e) => setCltSalary(e.target.value)}
								/>
							</div>
						</div>
					) : (
						<div className={styles.rowFields}>
							<div className={styles.inputWrapper}>
								<label>Estimativa de Horas/Mês</label>
								<input
									type="number"
									placeholder="Banco de Horas"
									value={freeHours}
									onChange={(e) => setFreeHours(e.target.value)}
								/>
							</div>
							<div className={styles.inputWrapper}>
								<label>Valor R$</label>
								<input
									className={styles.moneyInput}
									type="text"
									placeholder="0.00"
									value={freeValue}
									onChange={(e) => setFreeValue(e.target.value)}
								/>
							</div>
						</div>
					)}
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
			<ErrorAlert   isVisible={erroAlert.isVisible} title={erroAlert.title} message={erroAlert.message}/>
			<SuccessAlert isVisible={successAlert.isVisible} title={successAlert.title} message={successAlert.message}/>
		</div>
	);
}