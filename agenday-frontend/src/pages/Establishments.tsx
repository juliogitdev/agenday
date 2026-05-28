
import { CirclePlus } from "lucide-react";
import { Breadcrumb } from "../components/navigation/Breadcrumb";
import { EstablishmentTable } from "../components/tables/EstableshmentTable";
import { mock_establishmentDashboard } from "../mocks/establishmentDashboardMock";
import { EstablishmentDashboardCard } from "../components/cards/EstablishmentDashboardCard";
import { BlackWindow } from "../components/Ui/BlackWindow";
import { FormStep } from "../components/Forms/FormStep";
import { BasicEstablishmentDataForm } from "../components/Forms/estableshimentForms/EstablishmentFormBasic";
import style from "./styles/estableshments.module.css";
import { EstablishmentFormVisual } from "../components/Forms/estableshimentForms/EstablishmentFormVisual";
import { EstablishmentFormAdress } from "../components/Forms/estableshimentForms/EstablishmentFormAdress";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { isValidEstablishmentForm} from "../utils/ValidEstablishmentForm";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import { createEstablishment, getImageUploadLink, prepareBodyData, uploadImage } from "../services/EstablishmentService";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

export function Establishments() {
	const [isBlackWindowOpen, setIsBlackWindowOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [asError, setAsError] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorTitle, setErrorTitle] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loadingStatus, setLoadingStatus] = useState("Por favor, aguarde...");
	const [updateTable, setUpdateTable] = useState(0);
	const { user } = useContext(AuthContext);	
	
	const forms = [
		{ title: "Informações Básicas", name: "basicInfo", content: <BasicEstablishmentDataForm/> },
		{ title: "Endereço", name: "address", content: <EstablishmentFormAdress/> },
		{ title: "Personalização", name: "visual", content: <EstablishmentFormVisual/> }
	];

	const create = async (data: any) => {
		const formIsValid = isValidEstablishmentForm(data); 
		if (formIsValid !== true) {
			showErrorMessage(formIsValid.title, formIsValid.message);
			return;
		}

		setIsLoading(true);    
		setLoadingStatus('Criando Estabelecimento...');    
		
		const requestBody = prepareBodyData("default", data);
		const createResult = await createEstablishment(user, requestBody);

		if (createResult.statusCode === 200 || createResult.statusCode === 201) {
			setLoadingStatus('Estabelecimento criado...');
			const establishment = createResult.responseData;

			const logoFile = data.visual?.image?.value.file;
			if (logoFile instanceof File) {
				setLoadingStatus('Gerando link de upload...');
				const linkResult = await getImageUploadLink(user, establishment.id, logoFile.name);

				if (linkResult.statusCode === 200 && linkResult.responseData) {
					setLoadingStatus('Enviando logo...');
					await uploadImage(linkResult.responseData.uploadUrl, logoFile);
				}
			}

			setIsLoading(false);
			setSuccessMessage("Estabelecimento criado com sucesso");
			setUpdateTable(prev => prev + 1);
			setTimeout(() => {
				setSuccessMessage("");
				setIsBlackWindowOpen(false);
			}, 3000);

		} else {
			setIsLoading(false);
			const backendError = createResult.responseData; 
			const message = backendError?.message ?? "Não foi possível conectar ao servidor.";
			showErrorMessage("Error", message);
		}
	};

	const handleRowClick = (establishmentId:string, action:string) => {
		console.log(establishmentId);
		console.log(action);
	}

	const showErrorMessage = (title: string, message: string) => {
		setErrorTitle(title);
		setErrorMessage(message);
		setAsError(true);
		setTimeout(() => { setAsError(false); }, 4000);
	};

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
				<button className={style.estableshmentHeaderButton} onClick={() => setIsBlackWindowOpen(true)}> 
					<CirclePlus /> novo
				</button>
			</header>

			<main className={style.estableshmentContent}>
				<EstablishmentTable updateTable={updateTable} onClick={handleRowClick} />
				<EstablishmentDashboardCard data={mock_establishmentDashboard} />
			</main>
			
			<BlackWindow isOpen={isBlackWindowOpen}>
				<FormStep
					asError={asError} 
					isLoading={isLoading}
					loadingStatus={loadingStatus}
					title="estabelecimento"
					type="edit"
					forms={forms as any}
					close={() => setIsBlackWindowOpen(false)}
					onFinished={(data) => { create(data); }} />
			</BlackWindow>

			<div className={style.errorsContainer}>
				{ asError && ( <ErrorAlert title={errorTitle} message={errorMessage}/> )}
				{ successMessage.length > 0 && ( <SuccessAlert title="Sucesso" message={successMessage}/> )}
			</div>
			<footer></footer>
		</section> 
	);
}