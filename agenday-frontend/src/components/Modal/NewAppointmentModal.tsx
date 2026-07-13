import { CircleCheck, Search, X } from "lucide-react";
import { ComboBox } from "../inputs/ComboBox";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import type { ComboBoxOptionItem } from "../../types/ComboBox";
import { TextInput } from "../inputs/TextInput";
import styles from "./styles/newAppointmentModal.module.css"
import { SolidButton } from "../buttons/SolidButton";
import { BallName } from "../Ui/BallName";
import { buildIsoZ } from "../../utils/Date";
import { BlackWindow } from "../Ui/BlackWindow";
import { LoadingClock } from "../Alerts/LoadingClock";
import { ModalHook } from "../../hooks/ModalHook";
import { ErrorAlert } from "../Alerts/ErrorAlert";
import { SuccessAlert } from "../Alerts/SuccessAlert";
import { AlertHook } from "../../hooks/AlertsHook";

type props = {
	isVisible: boolean;
	establishmentId?: string | undefined;
	onClose: () => void;
}

export function NewAppointmentModal({isVisible, establishmentId, onClose}: props) {
	if (!isVisible) return null;

	const {api} = useContext(AuthContext);
	const image_url = import.meta.env.VITE_STORAGE_BASE_URL + '/agenday-images/';

	const [catalogOptions, setCatalogOptions] = useState<ComboBoxOptionItem[]>([]);
	const [selectedCatalog, setSelectedCatalog] = useState<ComboBoxOptionItem>();
	const [professionalsOptions, setProfessionalsOptions] = useState<ComboBoxOptionItem[]>([]);
	const [selectedProfessional, setSelectedProfessional] = useState<string>();
	const [establishmentsList, setStablishmentList] = useState<any[]>([]);
	const [selectedEstablishment, setSelectedEstablishment] = useState<string>('');
	const today = new Date().toISOString().split("T")[0];
	const [selectedDate, setSelectedDate] = useState<string>(today);
	const [selectedTime, setSelectedTime] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [availableTimes, setAvailableTimes] = useState<ComboBoxOptionItem[]>([]);

	const blackWindow = ModalHook();
	const isLoadingMd = ModalHook();
	const erroAlert = AlertHook();
	const successAlert = AlertHook();

	const catalogList = {
		value: {
			selectedValue: "",
			selectedLabel: "",
			options: catalogOptions
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

	const timesList = {
		value: {
			selectedValue: selectedTime || "",
			selectedLabel: selectedTime || "",
			options: availableTimes
		},
		errorMessage: null,
		isValid: null,
	};

	useEffect(() => {
		let active = true;
		const loadEstablishments = async () => {
			if (establishmentId != null) return;
			const r = await api.get("establishment/public", { params: {page: 0, size: 10, sort: "name,asc", name: ""}});
			if (!active) return;
			if (r.status === 200) {
				setStablishmentList(r.data?.content ?? []);
			}
		};
		loadEstablishments();
		return () => { active = false;};
	}, [establishmentId]);

	useEffect(() => {
		if (!selectedCatalog?.data) {
			setProfessionalsOptions([]);
			return;
		}
		const list = selectedCatalog.data.professionals.map((p) => ({ label: p.name, value: p.professionalEstablishmentId}));
		setProfessionalsOptions(list);
	}, [selectedCatalog]);

	useEffect(() => {
		const selected = establishmentsList.find((e) => e.establishmentId === selectedEstablishment);
		const catalogs = selected?.catalogs;
		setCatalogOptions([]);
		setProfessionalsOptions([]);
		if (!catalogs?.length) return;
		const catalogList: ComboBoxOptionItem[] = catalogs.map((d:any) => ({
			label: d.name,
			value: d.catalogItemId,
			data: {
				price: d.price,
				time: d.duration,
				professionals: d.professionals,
			},
		}));
		setCatalogOptions(catalogList);
	}, [selectedEstablishment, establishmentsList]);

	useEffect(() => {
		const loadAvailableTimes = async () => {
			if (!selectedCatalog?.selectedValue || !selectedProfessional || !selectedDate) {
				setAvailableTimes([]);
				setSelectedTime(undefined);
				return;
			}

			try {
				const r = await api.get('appointments/available-slots', {
					params: {
						professionalEstabId: selectedProfessional,
						catalogItemId: selectedCatalog.selectedValue,
						date: selectedDate
					}
				});

				if (r.status === 200 && Array.isArray(r.data)) {
					const times = r.data.map((slot: any) => {
						const time = slot.startTime.split('T')[1].substring(0, 5);
						return {
							label: time,
							value: time
						};
					});
					setAvailableTimes(times);
					setSelectedTime(undefined);
				}
			} catch (error) {
				setAvailableTimes([]);
				setSelectedTime(undefined);
			}
		};

		loadAvailableTimes();
	}, [selectedCatalog, selectedProfessional, selectedDate]);

	const createAppointment = () => {
		blackWindow.show();
		isLoadingMd.show();
		if (
			!selectedCatalog?.selectedValue ||
			!selectedEstablishment ||
			!selectedDate ||
			!selectedTime ||
			!selectedProfessional
		) {
			isLoadingMd.hidden();
			blackWindow.hidden();	
			erroAlert.show("Erro", "Por favor verifique as informações preenchdias.", 4000);
			return;
		}
		setTimeout(async () => {
			try {
				const userSelectedDate = buildIsoZ(selectedDate, selectedTime);
				const body = {
					professionalEstablishmentId: selectedProfessional,
					catalogItemId: selectedCatalog.selectedValue,
					startTime: userSelectedDate,
					notes: description ?? "",
				};
				const r = await api.post("appointments", body);
				if (r.status === 200 || r.status == 201) {
					isLoadingMd.hidden();
					blackWindow.hidden();	
					successAlert.show("Sucesso", "A sua solicitação de agendamento foi enviada !!", 3000);
				}
			} catch (error: any) {
				isLoadingMd.hidden();
				blackWindow.hidden();
				const errorMsg = error?.response?.data?.message || "Desculpe, ouve um erro durante o processo..";
				erroAlert.show("Erro", errorMsg, 4000);
			}
		}, 1000);
	};

	function formatAddress(address:any) {
		const full = `${address.street}, ${address.number} • ${address.neighborhood} • ${address.city}/${address.state} • CEP ${address.cep}`;
		return full.length > 70 ? `${full.slice(0, 70)}...` : full;
	}

	return (
		<div className={styles.modalContainer}>
			<header>
				<h1>Novo Agendamento</h1>
				<button onClick={onClose}><X size={16}/></button>
			</header>
			<div className={styles.modalContent}>
				<div className={styles.modalLeft}>
					<p className={styles.modalLeftTitle} >Selecione um estabelecimento</p>
					<div className={styles.modalInputBox}> 
						<Search size="18" color="gray"/>
						<input className={styles.modalInput} type="text" placeholder="Buscar estabelecimentos"/>
					</div>
					<div className={styles.modalTableBox}>
						<p className={styles.modalTableBoxTitle} >ESTABELECIMENTOS</p>
						<ul className={styles.modalTableList}> {establishmentsList.length ? (
							establishmentsList.map((e) => {
								const formattedAddress = formatAddress(e.address);
								const isSelected = e.establishmentId === selectedEstablishment;
								const itemClass = isSelected ? styles.modalTableListItemsSelected : styles.modalTableListItems;
								return (
									<li
										key={e.establishmentId}
										className={itemClass}
										onClick={() => {
											setSelectedCatalog(undefined)
											setSelectedProfessional(undefined)
											setSelectedTime(undefined)	
											setSelectedDate("")
											setSelectedEstablishment(e.establishmentId)
										}}
									>
										{e.imageUrl ? (
											<img
												className={styles.modalTableListImg}
												src={`${image_url}/${e.imageUrl}`}
												alt={e.name}
											/>
										) : ( <BallName name={e.name} />)}
										<div className={styles.modalTableListDetails}>
											<span className={styles.modalTableListDatailsName}>{e.name}</span>
											<span className={styles.modalTableListDatailsAdrs}>
											{formattedAddress}
											</span>
										</div>
										<CircleCheck size={15} className={styles.modalTableListDatailsIcon} />
									</li>
								);
							})
						) : (
							<p>Nenhum estabelecimento encontrado para seu endereço!</p>
						)}
						</ul>	
					</div>
				</div>
				<div className={ selectedEstablishment ? styles.modalMiddle : styles.modalMiddleBlocked}>
					<ComboBox 
						label="Selecione um serviço"
						initialValue={catalogList}
						onChangeField={(e:any)=>{  setSelectedCatalog(e.value);}}
					/>
					<ComboBox 
						label="Selecione um Profissional"
						initialValue={professionalsList}
						onChangeField={(e:any)=> {
							setSelectedProfessional(e.value.selectedValue);
						}}
					/>
					<div className={styles.modalMiddle2collumns}>
						<div className={ selectedCatalog && selectedProfessional ? styles.formGroup : styles.formGroupDisabled}>
							<span  className={styles.formGroupSpan}>Selecione uma data</span>
							<input 
								className={styles.formGroupInput}
								id="appointment-date"
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								required
								type="date" 
							/>
						</div>
						
						<ComboBox 
							disabled={availableTimes.length <= 0}
							label={"Horários (" + availableTimes.length + " Disponiveis )" }
							initialValue={timesList}
							onChangeField={(e:any)=> {
								setSelectedTime(e.value.selectedValue);
							}}
						/>
					</div>
					<TextInput 
						initialValue={''}
						label="Observações (opcional)" 
						placeholder="Digite aqui alguma observação para o profissional" 
						_height={140}
						onChangeField={(d)=>{setDescription(d.value)}} 
					/>
					<div className={styles.modalMiddleFooter}>
						<SolidButton 
							
							text={"Agendar"} 
							isActive={ 
								(selectedCatalog && selectedDate && selectedTime && selectedProfessional) ? true : false
							} 
							onClick={function (): void { createAppointment();}} 
							isLoading={false} 
						/>
						<div className={styles.modalMiddleFooterStatus}>
							<p>valor do serviço: <span>{selectedCatalog?.data?.price || 0.00 } R$</span></p>
							<p>tempo estimado: <span>{selectedCatalog?.data?.time || 0} m</span></p>
						</div>
					</div>
				</div>
			</div>
			<BlackWindow isVisible={blackWindow.visible}>
				<LoadingClock 
					isLoading={isLoadingMd.visible} 
					text='Solicitando agendamento, por favor aguarde'
				/>
			</BlackWindow>
			<ErrorAlert   isVisible={erroAlert.isVisible} title={erroAlert.title} message={erroAlert.message}/>
			<SuccessAlert isVisible={successAlert.isVisible} title={successAlert.title} message={successAlert.message}/>
		</div>
	);
}