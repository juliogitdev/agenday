
import { Pen, TriangleAlert } from "lucide-react";
import { SolidButton } from "../components/buttons/SolidButton";
import styles from "./styles/configurations.module.css";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { AgendaJwt } from "../types/Jwt";
import { BallName } from "../components/Ui/BallName";

export function Configurations() {
	const {user} = useContext(AuthContext);
	let userRoles: string[] = [];

	if (user != null) {
		const userData: AgendaJwt = jwtDecode(user.accessToken || "");
		userRoles = userData.roles ?? []; 
	}

	return (
		<section className={styles.configurations}> 
			<header className={styles.configurationsHeader}>
				<div className={styles.configurationsHeaderImage}>
					{user?.userInformations?.profileImageUrl ? (
						<img src={user?.userInformations?.profileImageUrl} alt="Profile Image" />
						) : (
							<BallName size={52} name={user?.userInformations?.fullName || "Sem Nome"} />
					)}
					<button><Pen size="18"/></button>
				</div>
				<div className={styles.configurationsHeaderText}>
					<h1>Configurações</h1>		
					<p>Gerencie sua conta, planos e preferências do agenday.</p>
				</div>
			</header>

			<div className={styles.accountInfo}>
				<h1 className={styles.accountInfoTitle}>Informações da Conta</h1>
				<div className={styles.fourColumns}>
					<label className={styles.fourColumnsInputs}>  NOME COMPLETO <span>{user?.userInformations?.fullName || 'Nome completo' } <Pen size="18" className={styles.editIcon}/> </span></label>
					<label className={styles.fourColumnsInputs}>  EMAIL <span>{user?.userInformations?.email || 'Email' } <Pen size="18" className={styles.editIcon}/> </span></label>
					<label className={styles.fourColumnsInputs}>  NÚMERO DE CELULAR <span>{'Número de celular' } <Pen size="18" className={styles.editIcon}/> </span></label>
					<label className={styles.fourColumnsInputs}>  SENHA <span>•••••••• <Pen size="18" className={styles.editIcon}/> </span></label>
				</div>
				<div className={styles.twoColumns}>
					<p className={styles.infoText}> 
						TIPO DE CONTA 
						<span className={styles.infoValueLabel}>
							Seu perfil atual é do tipo: 
							<i className={styles.infoValue}>{userRoles.includes('ROLE_PROFESSIONAL') ? 'PROFISSIONAL' : 'USUÁRIO'}</i>
						</span> 
					</p>
					<SolidButton 
						text={"Mudar tipo de conta"} 
						isActive={false} 
						onClick={function (): void {
							throw new Error("Function not implemented.");
						} } 
						isLoading={false}
					/>
				</div>
			</div>


			<div className={ userRoles.includes('ROLE_PROFESSIONAL') ? styles.plansInfo : styles.plansInfoUser }>
				<div className={styles.plansInfoHeader}>
					<h1 className={styles.plansInfoHeaderTitle}>PLANOS E FATURAMENTOS</h1>
					<span className={styles.plansInfoHeaderStatusOk}>CONTA EM DIA</span>
				</div>
				<div className={styles.plansInfoContent}>
					<div className={styles.planInfo}>
						<span className={styles.planInfoLabel}>Data Do proximo pagamento</span>
						<span className={styles.planInfoDate}>15 de Outubro</span>
						<span className={styles.planInfoValue}>Valor: R$ 99,90</span>
					</div>

					<div className={styles.planDetails}>
						<p className={styles.planDetailsText}> 
							Sua conta está em dia. Caso o pagamento não seja identificado até a data de vencimento, 
							o acesso as ferramentas de gestão sera <mark>suspenso</mark> 
						</p>
						<div className={styles.planDetailsButtons}>
							<button className={styles.planDetailsPayButton}>Pagar Agora (PIX)</button>
							<button className={styles.planDetailsChangeButton}>Alterar Meu Plano</button>
						</div>
					</div>
				</div>
			</div>


			<div className={styles.dangerZone}>
				<h1> <TriangleAlert size="18"/> ZONA DE PERIGO</h1>
				<div className={styles.dangerZoneContent}>
					<div className={styles.dangerZoneContentText}>
						<h2>Excluir Conta</h2>
						<p>Ao excluir sua conta, todos os dados serão perdidos e não poderão ser recuperados.</p>
					</div>
					<button className={styles.dangerZoneContentButton}>Excluir Conta</button>
				</div>
			</div>
		</section> 
	);
}