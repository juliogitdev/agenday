
import { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../components/navigation/Breadcrumb";
import styles from "./styles/home.module.css";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { AgendaJwt } from "../types/Jwt";
import { BlackWindow } from "../components/Ui/BlackWindow";
import { Welcome } from "../components/Alerts/Welcome";
import { ChosePlan } from "../components/Alerts/ChosePlan";
import { Settings } from "lucide-react";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { MESSAGES, statusMap } from "../constants/messages";


export const Home = function () {
	const { user, setUser } = useContext(AuthContext);
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);
	const [showPlanChose, setShowPlanChose] = useState(false);
	const [errorMessage,   setErrorMessage]   = useState<{title: string, message: string} | null >();
	const [showSuccess, setShowSuccess] = useState(false);
	const [planAsUpdating, setPlanAsUpdating] = useState(false);
	const userData: AgendaJwt = jwtDecode(user?.accessToken || "");
	
	useEffect(()=> {
		const userIsClient =  !userData.roles.includes('ROLE_PROFESSIONAL');
		const isShowWelcome = ( window.localStorage.getItem('AGD_ShowAgain') == null ) ? true : false;

		if (  userIsClient && isShowWelcome) { 
			setShowWelcome(true);
			setShowOnboarding(true);
		}
	},[]);
	
	const wellComeHandler = (userOption: boolean) => {
		const planChoseVisiblityStatus = (userOption) ? true : false;
		setTimeout(()=> { 
			setShowWelcome(false);
			setShowPlanChose(planChoseVisiblityStatus);
		},100);

		if (!userOption) 
			setTimeout(()=> { 
				setShowWelcome(false);
				setShowOnboarding(false);
			},100);
	}

	const changeAccountType = async (planId: string) => {
		let statusCode = 0;
		try {
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
				setPlanAsUpdating(false);
				setShowOnboarding(false);
			
				setTimeout(()=>{setShowSuccess(true)},300)
				setTimeout(()=>{setShowSuccess(false)},5000)		
			} else 
				throw new Error('Failed to change account type'); 
		} 
		catch {
			const key = statusMap[statusCode] ?? "unknownError";
			let msg = MESSAGES[key];
	
			setShowOnboarding(false);
			setPlanAsUpdating(false);
			setTimeout(()=>{ setErrorMessage({title: msg.title, message: msg.message});},300)
			setTimeout(()=>{ setErrorMessage(null);},5000)
		}
	}

	const changeAccountTypeHandler = async (planId: string | null ) => {
		if ( planId == null ) {
			setShowPlanChose(false);
			setShowOnboarding(false);

		} else {
			setShowWelcome(false);   // por garantia
			setShowPlanChose(false);
			setTimeout(() => {
				setPlanAsUpdating(true);
				changeAccountType(planId);
			}, 300);
		}
	}

    return (
		<main className={styles.homePage}> 
			<Breadcrumb/>
			{showSuccess  && <SuccessAlert title="Parabéns" message="Agora você é um usuário profissional"/>}
			{errorMessage && <ErrorAlert title={errorMessage.title} message={errorMessage.message}/>}
			<BlackWindow isOpen={showOnboarding}>
				<Welcome isVisible={showWelcome} onFinish={wellComeHandler}/>
				<ChosePlan isVisible={showPlanChose} onChose={(p)=>changeAccountTypeHandler(p)}/>
				{ planAsUpdating ? (
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
