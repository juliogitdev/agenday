
import { useContext, useEffect } from "react";
import { Breadcrumb } from "../components/navigation/Breadcrumb";
import styles from "./styles/home.module.css";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { AgendaJwt } from "../types/Jwt";
import { BlackWindow } from "../components/Ui/BlackWindow";
import { Onboarding } from "../components/Modal/Onboarding";
import { ChosePlan } from "../components/Alerts/ChosePlan";
import { Settings } from "lucide-react";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { MESSAGES, statusMap } from "../constants/messages";
import { ModalHook } from "../hooks/ModalHook";
import { AlertHook } from "../hooks/AlertsHook";


export const Home = function () {
	const { user, setUser } = useContext(AuthContext);
	const blackWindw   = ModalHook();
	const onBoarding   = ModalHook();
	const chosePlans   = ModalHook();
	const errorAlert   = AlertHook();
	const successAlert = AlertHook();
	const userData: AgendaJwt = jwtDecode(user?.accessToken || "");
	
	useEffect(()=> {
		const userIsClient =  !userData.roles.includes('ROLE_PROFESSIONAL');
		const isShowWelcome = ( window.localStorage.getItem('AGD_ShowAgain') == null ) ? true : false;

		if (  userIsClient && isShowWelcome) { 
			blackWindw.show();
			onBoarding.show();
		}
	},[]);
	
	const changeAccountType = async (planId: string) => {
		let statusCode = 0;
		try {
			chosePlans.setLoading(true);
			const API_URL = import.meta.env.VITE_API_URL;
			const response = await fetch(`${API_URL}professional/promote`, {
				method: 'POST',
				credentials: "include",
				headers: {
           	 		'Content-Type': 'application/json',
            		'Authorization': `Bearer ${user?.accessToken}`
        		},
				body: JSON.stringify({planId: planId})
			});
			
			statusCode = response.status;

			if (response.ok) {
				const data = await response.json();
				setUser(prev => ({...prev!,accessToken: data.accessToken}));
				chosePlans.hidden();
				blackWindw.hidden();
				chosePlans.setLoading(false);
				successAlert.show("Sucesso", "Plano atualizado com sucesso!", 5000);
			} else 
				throw new Error('Failed to change account type'); 
		} 
		catch {
			const key = statusMap[statusCode] ?? "unknownError";
			let msg = MESSAGES[key];
	
			chosePlans.hidden();
			blackWindw.hidden();
			chosePlans.setLoading(false);
			errorAlert.show(msg.title, msg.message,5000);
		}
	}

	const changeAccountTypeHandler = async (planId: string | null ) => {
		if ( planId == null ) {
			onBoarding.hidden();
			chosePlans.hidden();
			blackWindw.hidden();
		} else {
			onBoarding.hidden();
			chosePlans.hidden();
			changeAccountType(planId);
		}
	}

    return (
		<main className={styles.homePage}> 
			<Breadcrumb/>
			<SuccessAlert isVisible={successAlert.isVisible} title="Parabéns" message="Agora você é um usuário profissional"/>
			<ErrorAlert   isVisible={errorAlert.isVisible} title={errorAlert.title} message={errorAlert.message}/>

			<BlackWindow isVisible={blackWindw.visible}>
				<Onboarding 
					isVisible={onBoarding.visible} 
					onFinish={(e:boolean)=> {
						onBoarding.hidden();
						blackWindw.hidden();
						if (e) { 
							chosePlans.show(); 
							blackWindw.show();
						}
					}}
				/>

				<ChosePlan isVisible={chosePlans.visible} onChose={(p)=>changeAccountTypeHandler(p)}/>

				{ chosePlans.loading ? (
					<div className={styles.planAplyLoadingContainer}>
						<Settings className={styles.planAplyLoadingContainerIcon}/>
						<span className={styles.planAplyLoadingContainerText}>
							Por favor, aguarde um instante, estamos processando sua solicitação...
						</span>
					</div> 
				): <></> }		
			</BlackWindow>
		</main> 
	);
}
