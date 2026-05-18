
import { Contact, IdCardLanyard, LayoutDashboard, NotebookPen, Scissors, Store, UserRoundCog } from "lucide-react"
import styles from "./styles/panel.module.css"
import { PanelButton } from "../components/buttons/PanelButton"

export function Panel() {
	return (
		<nav className={styles.panelBox}>
			<img src="/resource/icons/versao_sem_texto_v1.svg" className={styles.panelLogo}/>
			<div className={styles.panelButtonsMiddle}>
				<PanelButton 
					to="/dashboard"
					icon={<LayoutDashboard />}
					toastHoverText="Dashboard"
					notificationsCount={10}
				/>
				<PanelButton 
					to="/agenda"
					icon={<NotebookPen />}
					toastHoverText="Agenda"
					notificationsCount={0}
				/>
				<PanelButton 
					to="/establishments"
					icon={<Store />}
					toastHoverText="Estabelecimentos"
					notificationsCount={0}
				/>
				<PanelButton 
					to="/employees"
					icon={<IdCardLanyard />}
					toastHoverText="Funcionários"
					notificationsCount={0}
				/>
				<PanelButton 
					to="/services"
					icon={<Scissors />}
					toastHoverText="Serviços"
					notificationsCount={0}
				/>
				<PanelButton 
					to="/clients"
					icon={<Contact />}
					toastHoverText="Clientes"
					notificationsCount={0}
				/>
			</div>
			<div className={styles.panelButtonsBottom}>
				<PanelButton 
					to="/configurations"
					icon={<UserRoundCog />}
					toastHoverText="Configurações"
					notificationsCount={0}
				/>		
			</div>
		</nav>
	);
}