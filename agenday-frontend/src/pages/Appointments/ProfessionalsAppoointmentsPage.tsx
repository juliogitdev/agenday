
import { AppointmentsDetailsCard } from "../../components/cards/AppointmentsDetailsCard";
import styles from "./styles/professionalsAppoointmentsPage.module.css"
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { AlertHook } from "../../hooks/AlertsHook";
import { ComboBox } from "../../components/inputs/ComboBox";
import { type EstablishmentSummary } from "../../types/Estableshment";
import { ModalHook } from "../../hooks/ModalHook";
import { BlackWindow } from "../../components/Ui/BlackWindow";
import { NotificationModal } from "../../components/Modal/NotificationModal";
import { NewAppointmentModal } from "../../components/Modal/NewAppointmentModal";
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import { ClientAppointmentsList } from "../../components/tables/ClientAppointmentsList";
import { RealTimeClock } from "../../components/Ui/RealTimeClock";
import { useQuery } from "@tanstack/react-query";

export function ProfessionalsAppoointmentsPage() {
	const {api, user} = useContext(AuthContext);
	const errorAlert  = AlertHook();
	const blackWidow  = ModalHook();
	const newAppoint  = ModalHook();
	const notifications  = ModalHook();

	const image_url = import.meta.env.VITE_STORAGE_BASE_URL+/agenday-images/;
	// const [appointments, setAppointments] = useState<AppointmentCardType[]>([]);
	// const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);


	const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
	const [selectedEstablishment, setSelectedEstablishment] = useState<EstablishmentSummary | null>(null);
	const NO_ESTABLISHMENTS = [{ label: "Nenhum estabelecimento encontrado", value: '' }];

	const [comboBoxState, setComboBoxState] = useState({
		value: {
			selectedValue: '',
			selectedLabel: '',
			options: NO_ESTABLISHMENTS
		},
		errorMessage: null,
		isValid: true
	});

	 useEffect(()=> {
		let active:boolean = true;
		const getEstablishements = async (): Promise<EstablishmentSummary[] | null > => {
			try {
				const r = await api.get('establishment/my-units/summary');
				if (r.status === 200 && active) {  
					setEstablishments(r.data); 
					return r.data
				}
				return null;

			}catch { 
				errorAlert.show("Erro", "Não foi possível atualizar a lista de estabelecimentos",5000);
				return null;
			}
		}
		
		const updateComboBox = async () => {
			const data = await getEstablishements(); 
			if (!data || !active || data.length == 0) return; 

			const newOptions = data.map((d: any) => ({ label: d.name, value: d.id }));
			const finalOptions = newOptions.length > 0 ? newOptions : NO_ESTABLISHMENTS;
			setSelectedEstablishment(data[0]);

			setComboBoxState(prevState => ({
				...prevState,
				value: {
					selectedLabel: data[0].name,
					selectedValue: data[0].id,
					options: finalOptions
				}
			}));
		};

		updateComboBox();
		return ()=>{active=false}
	},[api]);


const {data: appointments = [], isLoading: loadingAppointments, error: appointmentsError } = useQuery({
	queryKey: ["professional-schedule", selectedEstablishment?.id, user?.userInformations?.uuid],
	queryFn: async () => {
		if (!selectedEstablishment || !user?.userInformations) return [];
		const responseEst = await api.get(`professional-establishments/establishment/${selectedEstablishment.id}`);
		const links = responseEst.data;
		const myLink = links.find((link: any) => link.professionalName === user.userInformations?.fullName);
		if (!myLink) return [];

		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date();
		end.setDate(end.getDate() + 7);
		end.setHours(23, 59, 59, 999);

		const responseAppointments = await api.get(`appointments/professional/${myLink.id}`,
			{params: {start: start.toISOString(),end: end.toISOString()}
		});
		return responseAppointments.data;
	},

	enabled: !!selectedEstablishment && !!user?.userInformations,
	refetchInterval: 10000, 
	refetchIntervalInBackground: true,
});

	return (
		<section className={styles.appointmentsPage}>
			<div className={styles.servicesHeader}>
				<div className={styles.servicesHeaderInfoContainer}>
					<div  className={styles.establismentInfoContainer}>
						<img 
							src={selectedEstablishment?.imageUrl ? (image_url + selectedEstablishment.imageUrl) : ''} 
							alt={selectedEstablishment?.name || "Estabelecimento"}
							className={styles.servicesHeaderImg}/>

						<h1 className={styles.serviceHeaderTitle}>
							{selectedEstablishment?.name || 'Nenhúm estabelecimento Encontrado'}
							<span  className={styles.serviceHeaderSubtitle}>{selectedEstablishment?.slogan || '... ..'}</span> 
						</h1>
					</div>
					<ComboBox 
						label="" 
						initialValue={comboBoxState}
						onChangeField={(d)=>{
							const found = establishments.find(est => est.id === d.value.selectedValue);
							setSelectedEstablishment(found || null);
						}}
					/>
				</div>
				<div className={styles.servicesHeaderComboboxContainer}>
					{/* <SolidButton 
						text={"Novo Agendamento"} 
						isActive={true} 
						onClick={function (): void {
							blackWidow.show();
							newAppoint.show();
						}} 
						isLoading={false} 
					/> */}
					<RealTimeClock/>
					{/* <NotificationButton 
						onClick={(asModified) => {
							notifications.show(asModified);
							blackWidow.show();
						}}
					 /> */}
				</div>
			</div> 
			<div className={styles.appointmentsContent}>
				<ClientAppointmentsList 
					isProfessional={true}
					appointmentList={appointments}
					onChose={function (e: AppointmentCardType): void {
						alert("aki")
					}} 
					updateList={false} 
				/>


				<AppointmentsDetailsCard
					appointmentId="h6asdasd"
					serviceName = "Corte de Cabelo"
					serviceCreatedAt = " 20/10/2023 as 14:30"
					serviceDeadline = "20/10/2023 as 15:30"
					profissinalName = "João Silva"
					observations = "Cliente prefere um corte mais curto nas laterais e um pouco mais longo no topo. Ele também mencionou que gostaria de manter a barba aparada, mas não muito curta. Além disso, ele pediu para usar um pouco de pomada para dar um acabamento mais estilizado ao corte."		
					disabled = {false}
					clientAppointmentsCaount = {3}
					firstClientAppointmentDate = "20/10/2023"
					loading = {false}
					clienteName = "Maria Oliveira"
					clientPicture = "https://randomuser.me/api/portraits/women/44.jpg"
					showCloseBtn = {false}
					onClose = {() => console.log("Fechar detalhes do agendamento")}
				/>
			</div>
			<BlackWindow isVisible={blackWidow.visible}>
				<NotificationModal 
					isVisible={notifications.visible}
					onClose={()=>{ 
						notifications.hidden();
						blackWidow.hidden()
					}}
				/>
				<NewAppointmentModal 
					establishmentId={selectedEstablishment?.id}
					isVisible={newAppoint.visible}
					onClose={()=>{
						newAppoint.hidden();
						blackWidow.hidden();
					}}		
				/>
			</BlackWindow>
		</section> 
	);
}