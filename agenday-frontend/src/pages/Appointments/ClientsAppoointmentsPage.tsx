
import { useContext, useState } from "react";
import { SolidButton } from "../../components/buttons/SolidButton";
import AuthContext from "../../context/AuthContext";
import styles from "./styles/clientsAppoointmentsPage.module.css"
import { BlackWindow} from "../../components/Ui/BlackWindow";
import { ModalHook } from "../../hooks/ModalHook";
import { NewAppointmentModal } from "../../components/Modal/NewAppointmentModal";
import { BallName } from "../../components/Ui/BallName";
import { ClientAppointmentsList } from "../../components/tables/ClientAppointmentsList";
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import { AppointmentCardDetails } from "../../components/cards/AppointmentCardDetails";


export function ClientsAppoointmentsPage() {
	const {api, user} = useContext(AuthContext);
	const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardType | null>(null);
	const [loading, setLoading] = useState(false);
	const [updateList, setUpdateList] = useState(false);

	const blackWidow  = ModalHook();
	const newAppointmentModal  = ModalHook();

	return (
		<section className={styles.page}>
			<header className={styles.pageHeader}>
				<div className={styles.pageHeaderUserInfos}>
					{user?.userInformations?.profileImageUrl ? (
						<img src={user?.userInformations?.profileImageUrl} alt="Profile Image" />) : (
							<BallName size={45} name={user?.userInformations?.fullName || "Sem Nome"} />
						)}
					<p className={styles.pageHeaderUserName}> <span>Seja bem vindo de volta</span> {user?.userInformations?.fullName || "Sem nome"}</p>
				</div>
				<div className={styles.pageHeaderButtonWrapper}>
					<SolidButton 
						text={"novo agendamento"} 
						isActive={true} 
						onClick={function (): void {
							blackWidow.show();
							newAppointmentModal.show();
						}} 
						isLoading={false}				
					/>
				</div>
			</header>
			<main className={styles.pageContent}>
				<div className={styles.appointmentsTable}>
					<ClientAppointmentsList
						updateList={updateList}
						onChose={(e:AppointmentCardType)=> { 
							setLoading(true);
							setTimeout(()=> {setSelectedAppointment(e); setLoading(false)}, 290);
						}}
					/>
				</div>
				<div className={styles.appointmentsDetails}>
					<AppointmentCardDetails
						appointment={selectedAppointment}
						loading={loading}
					/>
				</div>
			</main>
			<BlackWindow isVisible={blackWidow.visible}>
				<NewAppointmentModal
 					isVisible={newAppointmentModal.visible} 
					onClose={function (): void {
						setUpdateList(!updateList);
						blackWidow.hidden()
						newAppointmentModal.hidden();
					}} 
				/>
			</BlackWindow>
		</section>
	);
}

