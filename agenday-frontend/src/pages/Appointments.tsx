
import { AppointmentsDetailsCard } from "../components/cards/AppointmentsDetailsCard";
import styles from "./styles/appointments.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { AlertHook } from "../hooks/AlertsHook";
import { ComboBox } from "../components/inputs/ComboBox";
import { type EstablishmentSummary } from "../types/Estableshment";
import image404 from './../../public/resource/icons/image_404.png';
import { NotificationButton } from "../components/buttons/NotificationButton";
import { ModalHook } from "../hooks/ModalHook";
import { BlackWindow } from "../components/Ui/BlackWindow";
import { NotificationModal } from "../components/Modal/NotificationModal";

export function Appointments() {
	const {api} = useContext(AuthContext);
    const errorAlert  = AlertHook();
    const blackWidow  = ModalHook();

    const image_url = import.meta.env.VITE_STORAGE_BASE_URL+/agenday-images/;
    const [updateTable, setUpdateTable] = useState<boolean>(false);
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

	 useEffect(()=>{
        let active:boolean = true;
        const getEstablishements = async (): Promise<EstablishmentSummary[] | null > => {
            try {
                const r = await api.get('establishment/my-units/summary');
                if (r.status === 200 && active) {  
                    setEstablishments(r.data); 
                    setUpdateTable(!updateTable);
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
 	return (
		<section className={styles.appointmentsPage}>
			<div className={styles.servicesHeader}>
                <div className={styles.servicesHeaderInfoContainer}>
                    <img 
                        src={selectedEstablishment?.imageUrl ? (image_url + selectedEstablishment.imageUrl) : image404} 
                        alt={selectedEstablishment?.name || "Estabelecimento"}
                        className={styles.servicesHeaderImg}/>

                    <h1 className={styles.serviceHeaderTitle}>
                        {selectedEstablishment?.name || 'Nenhúm estabelecimento Encontrado'}
                        <span  className={styles.serviceHeaderSubtitle}>{selectedEstablishment?.slogan || '... ..'}</span> 
                    </h1>
                </div>
                <div className={styles.servicesHeaderComboboxContainer}>
                    <ComboBox 
                        label="Selecione um estabelecimento" 
                        initialValue={comboBoxState}
                        onChangeField={(d)=>{
                            const found = establishments.find(est => est.id === d.value.selectedValue);
                            setUpdateTable(!updateTable);
                            setSelectedEstablishment(found || null);
                        }}
                    />
					<NotificationButton 
						onClick={
							(asModified) => blackWidow.show(asModified)
						}
					 />
                </div>
            </div> 
			<div className={styles.appointmentsContent}>
				<p>Ola</p>
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
				<NotificationModal onClose={()=> blackWidow.hidden()}/>
			</BlackWindow>
		</section> 
	);
}