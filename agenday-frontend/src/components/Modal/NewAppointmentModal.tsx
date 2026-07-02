
import { X } from "lucide-react";
import { ComboBox } from "../inputs/ComboBox";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import type {ComboBoxOptionItem } from "../../types/ComboBox";
import { TextInput } from "../inputs/TextInput";
import styles from "./styles/newAppointmentModal.module.css"
import { SolidButton } from "../buttons/SolidButton";


type props = {
	isVisible: boolean;
  	establishmentId?: string | undefined;
  	onClose: () => void;
}

interface ServiceOption {
  label: string;
  value: string | number;
  price: number;
  time: number;
}


export function NewAppointmentModal({isVisible,establishmentId, onClose}:props) {
	if (!isVisible) return null;

	const {api} = useContext(AuthContext);
	const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
	const [professionalsOptions, setProfessionalsOptions] = useState<ComboBoxOptionItem[]>([]);
	const [establishmentOptions, setEstablishmentOptions] = useState<ComboBoxOptionItem[]>([]);

	const [selectedService, setSelectedService ] = useState<string>();
	const [selectedProfess, setSelectedProfess ] = useState<string>();
	const [selectedEstablishment, setSelectedEstablishment] = useState<string>();

	const today = new Date().toISOString().split("T")[0];
	const [selectedDate, setSelectedDate] = useState<string>(today);
	const [selectedTime, setSelectedTime] = useState<string>();
	const [selectedDescription, setSelectedDescription] = useState<string>();

	const servicesList = {
		value: {
			selectedValue: "",
			selectedLabel: "",
			options: serviceOptions
		},
		errorMessage: null,
		isValid: null,
	};

	const professionalsList = {
		value: {
			selectedValue: "",
			selectedLabel: "",
			options: professionalsOptions
		},
		errorMessage: null,
		isValid: null,
	};

	const establishmentsList = {
		value: {
			selectedValue: "",
			selectedLabel: "",
			options: establishmentOptions
		},
		errorMessage: null,
		isValid: null,
	};


	useEffect(()=>{
		let active:boolean = true;
		const getServices = async() => {
			const r = await api.get(`catalogItem/establishment/${establishmentId}`);
			const optionsTmp: ServiceOption[] = [];

			if (r.status == 200) {
				r.data.forEach((d: any)=>optionsTmp.push({label: d.name, value: d.id, price: d.defaultPrice, time: d.defaultDurationMinutes}));
				setServiceOptions(optionsTmp);
			} 
		}

		getServices();
		return ()=>{active=false}
	},[]);

	const updateProfessionalsList = async(catalogId:string) => {
		const body = {
			establishmentId: establishmentId,
  			catalogItemId: catalogId
		}

		const r = await api.post('catalogItem/professionals-with-service-status',body);
		const optionsTmp:ComboBoxOptionItem[] = [];

		if (r.status == 200) {
			r.data.forEach((d: any)=>optionsTmp.push({label: d.professionalName, value: d.professionalEstablishmentId}));
			setProfessionalsOptions(optionsTmp);
		} 
	}

	const onSelectDate = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setSelectedDate(newDate);
		const r = await api.get('appointments/available-slots',{
			params: {
				professionalEstabId: selectedProfess,
				catalogItemId: selectedService,
				date: selectedDate
			}
		});
		
		if (r.status == 200 ) { console.log(r.data)}
		return 0;
	}

	return (
		<div className={styles.modalContainer}>
			<header>
				<h1>Novo Agendamento</h1>
				<button onClick={onClose}><X size={16}/></button>
			</header>
			<div className={styles.modalContent}>
				<div className={styles.modalLeft}>
					{!establishmentId && <ComboBox 
						label="Selecione um Estabelecimento"
						initialValue={establishmentsList}
						onChangeField={(e:any)=>{ setSelectedEstablishment(e.value.selectedValue);}}
					/>}

					<div className={styles.inputGrid}>
						<ComboBox 
							label="Selecione um serviço"
							initialValue={servicesList}
							onChangeField={(e:any)=>{
								setSelectedService(e.value.selectedValue);
								updateProfessionalsList(e.value.selectedValue);
							}}
						/>

						<ComboBox 
							label="Selecione um Profissional"
							initialValue={professionalsList}
							onChangeField={(e:any)=>{
								setSelectedProfess(e.value.selectedValue);
							}}
						/>
					</div>
					<div className={styles.formRow}>
						<div className={styles.formGroup}>
							<span>Selecione uma data</span>
							<input 
								id="appointment-date"
								value={selectedDate}
								onChange={onSelectDate}
								required
								type="date" 
							/>
						</div>
						<div className={styles.formGroup}>
							<span>Selecione um horário</span>
							<input 
								id="appointment-time"
								disabled={!selectedDate}
								value={selectedTime} 
								onChange={(e)=>setSelectedTime(e.target.value)}
								required
								type="time" 
							/>
						</div>
					</div>

					<TextInput 
						initialValue={''}
						label="Observações" 
						placeholder="Digite aqui alguma observação para o profissional" 
						_height={120}
						onChangeField={(d)=>{setSelectedDescription(d.value)}} 
					/>
					<SolidButton 
						text={"Agendar"} 
						isActive={false} 
						onClick={function (): void {
							throw new Error("Function not implemented.");
						}} 
						isLoading={false} 
					/>
				</div>

				<div className={styles.modalRight}>
					<p>duração <span>45 min</span></p>
					<p>Valor Estimado <span>R$ 45,99</span></p>
				</div>
			</div>	
		</div>
	);


}