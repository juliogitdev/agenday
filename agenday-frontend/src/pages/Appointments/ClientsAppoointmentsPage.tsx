
import { useContext, useEffect, useState } from "react";
import { SolidButton } from "../../components/buttons/SolidButton";
import AuthContext from "../../context/AuthContext";
import styles from "./styles/clientsAppoointmentsPage.module.css"
import type { User } from "../../types/User";
import { ClientAppointmentsTable } from "../../components/tables/ClientAppointmentsTable";
import { BlackWindow} from "../../components/Ui/BlackWindow";
import { ModalHook } from "../../hooks/ModalHook";
import { NewAppointmentModal } from "../../components/Modal/NewAppointmentModal";

export function ClientsAppoointmentsPage() {
	const {api} = useContext(AuthContext);
	const [user, setUser] = useState<User>()
	const blackWidow  = ModalHook();
	const newAppointmentModal  = ModalHook();


	useEffect(()=> {
		let active:boolean = true;
		const getUserDetails = async ()=> {
			const r = await api.get('auth/me');
			if (r.status == 200 ) {
				setUser({
					token: 0,
  					name: '',
  					email: r.data.email,
					image: r.data.profileImageUrl,
  					fullName: r.data.fullName,
					numberPhone: ''
				})
			}
		}
		getUserDetails();
		return ()=>{active=false}
	},[api]);

	return (
		<section className={styles.page}>
			<header className={styles.pageHeader}>
				<div className={styles.pageHeaderUserInfos}>
					<img className={styles.pageHeaderUserProfile} src={user?.image ? user.image : "https://randomuser.me/api/portraits/lego/4.jpg"}/>
					<p className={styles.pageHeaderUserName}> <span>Seja bem vindo de volta</span> {user?.fullName || "Sem nome"}</p>
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
			<main>
				<ClientAppointmentsTable/>
				<div></div>
			</main>
			<BlackWindow isVisible={blackWidow.visible}>
				<NewAppointmentModal
 					isVisible={newAppointmentModal.visible} 
					onClose={function (): void {
						blackWidow.hidden()
						newAppointmentModal.hidden();
					}} 
				/>
			</BlackWindow>
		</section>
	);
}