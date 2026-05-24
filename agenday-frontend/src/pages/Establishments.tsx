
import { CirclePlus } from "lucide-react";
import { Breadcrumb } from "../components/navigation/Breadcrumb";
import { EstablishmentTable } from "../components/tables/EstableshmentTable";
import { mock_fakeEstablishments } from "../mocks/fakeEstablishments";
import { mock_establishmentDashboard } from "../mocks/establishmentDashboardMock";
import { EstablishmentDashboardCard } from "../components/cards/EstablishmentDashboardCard";
import { useState } from "react";
import { BlackWindow } from "../components/Ui/BlackWindow";
import { FormStep } from "../components/Forms/FormStep";
import { BasicEstablishmentDataForm } from "../components/Forms/estableshimentForms/EstablishmentFormBasic";
import style from "./styles/estableshments.module.css";
import { EstablishmentFormVisual } from "../components/Forms/estableshimentForms/EstablishmentFormVisual";
import { EstablishmentFormAdress } from "../components/Forms/estableshimentForms/EstablishmentFormAdress";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { validateFields } from "../utils/Validations";



export function Establishments() {
	const handleRowClick = (index: number) => { console.log(index);};
	const [isBlackWindowOpen, setIsBlackWindowOpen] = useState(false);
	const [asError, setAsError] = useState(false);
	const [errorTitle, setErrorTitle] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const forms = [
		{ title: "Informações Básicas", name: "basicInfo", content: <BasicEstablishmentDataForm/> },
		{ title: "Endereço", name: "address", content: <EstablishmentFormAdress/> },
		{ title: "Personalização", name: "visual", content: <EstablishmentFormVisual/> }
	]


	const validationData = (data: any) => {
		const error = validateFields(data);
		if (error) { showMessage( error.title, error.description); return;}
		alert("craindo")
	}

	const showMessage = (title: string, message: string) => {
		setErrorTitle(title);
		setErrorMessage(message);
		setAsError(true);
		setTimeout(() => { setAsError(false)}, 4000);
	}

    return (
		<section className={style.estableshmentPage}> 
			<Breadcrumb/>
			<header className={style.estableshmentHeader}>
				<h1 className={style.estableshmentHeaderTitle}>
					Estabelecimentos 
					<span className={style.estableshmentHeaderSubtitle}>
						Controle o branding e a performance das sua unidades
					</span>
				</h1>
				<button 
					className={style.estableshmentHeaderButton}
					onClick={() => setIsBlackWindowOpen(true)}
				> 
					<CirclePlus /> novo
				</button>
			</header>

			<main className={style.estableshmentContent}>
				<EstablishmentTable data={mock_fakeEstablishments} onClick={handleRowClick} />
				<EstablishmentDashboardCard data={mock_establishmentDashboard} />
			</main>
			<BlackWindow isOpen={isBlackWindowOpen}>
				<FormStep
					asError={asError} 
					title="estabelecimento"
					type="edit"
					forms={forms as any}
					close={() => setIsBlackWindowOpen(false)}
					onFinished={(data) => {validationData(data)}} />
				
				<div className={style.errorsContainer}>
					{ asError && (
						<ErrorAlert 
							title={errorTitle}
							message={errorMessage}
						/>
					)}
				</div>
			</BlackWindow>
			<footer></footer>
		</section> 
	);
}