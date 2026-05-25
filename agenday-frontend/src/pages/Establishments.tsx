
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
import { validEstablishmentForm, type EstablishmentFormValidCallBack } from "../utils/ValidEstablishmentForm";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import { MESSAGES, statusMap } from "../constants/messages";


export function Establishments() {
	const handleRowClick = (index: number) => { console.log(index);};
	const [isBlackWindowOpen, setIsBlackWindowOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [asError, setAsError] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorTitle, setErrorTitle] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const forms = [
		{ title: "Informações Básicas", name: "basicInfo", content: <BasicEstablishmentDataForm/> },
		{ title: "Endereço", name: "address", content: <EstablishmentFormAdress/> },
		{ title: "Personalização", name: "visual", content: <EstablishmentFormVisual/> }
	]


	const validationData = async (data: any) => {
		const error: EstablishmentFormValidCallBack | true = validEstablishmentForm(data); 
		if (error !== true) { showErrorMessage( error.title, error.message);  return;}
		
		setIsLoading(true);
		const API_URL = import.meta.env.VITE_API_URL;
		let formStatusCode  = 0;
		let imageStatusCode = 0;

		try {
			const coresRaw = [
				data.visual.palette.value.text_color,
				data.visual.palette.value.back_color,
				data.visual.palette.value.main_color
			];

			const resultadoString = coresRaw
				.map(cor => cor.replace(/[\n\t\r]/g, "").trim())
				.join(";");

			const request_body = {
				name: data.basicInfo.name.value,
				slogan: data.visual.slogan.value,
				numberPhone: data.basicInfo.numberPhone.value,
				imageUrl: "default.jpg",
				template: 1,
				palette: resultadoString,
				addressRequest: {
					cep: data.address.cep.value,
					state: data.address.state.value,
					city: data.address.city.value,
					street: data.address.street.value,
					number: data.address.number.value,
					neighborhood: data.address.neighborhood,					
				}
			}

			try {
				const image = await fetch(`${API_URL}upload/image-url?folder=establishments&extension=png`, {
					method: 'POST',
					credentials: "include",
					headers: { 'Content-Type': 'application/json' },
				});	

				imageStatusCode = image.status;
				if (image.ok && (imageStatusCode == 200 || imageStatusCode == 201 )) {
					
					const form = await fetch(`${API_URL}establishments/register`, {
						method: 'POST',
						credentials: "include",
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(request_body)
					});
					
					formStatusCode = form.status;
					
					if (form.ok && (formStatusCode === 201 || formStatusCode === 200)) {
						setSuccessMessage("Estabelecimento criado com sucesso");
						setTimeout(() => { 
							setSuccessMessage("");
							setIsBlackWindowOpen(false);
							setIsLoading(false);
						}, 3000);		
					} else { throw new Error("Failed to create establishment"); }
				}
			} catch (error) { throw error;}
		} catch (error) {
			const key = statusMap[formStatusCode] ?? "unknownError";
			const msg = MESSAGES[key];
			setIsLoading(false);
			showErrorMessage(msg.title, msg.message);
		}
	}

	const showErrorMessage = (title: string, message: string) => {
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
					isLoading={isLoading}
					title="estabelecimento"
					type="edit"
					forms={forms as any}
					close={() => setIsBlackWindowOpen(false)}
					onFinished={(data) => {validationData(data)}} />
				
				<div className={style.errorsContainer}>
					{ asError && ( <ErrorAlert  title={errorTitle} message={errorMessage}/> )}
					{ successMessage.length > 0 && ( 
						<SuccessAlert title="Sucesso" message="Estabelecimento criado com sucesso"/> )}
				</div>

			</BlackWindow>
			<footer></footer>
		</section> 
	);
}