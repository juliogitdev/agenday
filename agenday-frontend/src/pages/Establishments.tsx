

import { EstablishmentTable } from "../components/tables/EstableshmentTable";
import { bestServices, topClientes } from "../mocks/establishmentDashboardMock";
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
import { createEstablishment, fillEstablishmentForm, getImageUploadLink, prepareBodyData, updateEstablishment, uploadImage } from "../services/EstablishmentService";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { DeleteConfirmationModal } from "../components/Modal/DeleteConfirmationModal";
import { ModalHook } from "../hooks/ModalHook";
import { AlertHook } from "../hooks/AlertsHook";
import { EstablishmentFormStore } from "../store/EstablishmentFormStore";
import type { EstablishmenteDashboardCardType } from "../types/Estableshment";
import { InviteProfessionalModal } from "../components/Modal/InviteProfessionalModal";
import { ProfessionalScheduleManager } from "../components/Modal/ProfessionalScheduleManager";


export function Establishments() {
	const [formMethod, setFormMethod] = useState<'create' | 'edit'>('create');
	const [viewEstablishment, setViewEstablishment] = useState<EstablishmenteDashboardCardType | null>(null);
	const { resetForm } = EstablishmentFormStore.getState();

	const erroAlert    = AlertHook();
	const successAlert = AlertHook();
	const blackWindow  = ModalHook();
	const formModal    = ModalHook();
	const deleteModal  = ModalHook();
	const inviteProfissionalModal  = ModalHook();
	const professionalScheduleManagerModal = ModalHook();
	

	const [updateTable, setUpdateTable] = useState(0);
	const { user, api } = useContext(AuthContext);	
	
	const forms = [
		{ title: "Informações Básicas", name: "basicInfo", content: <BasicEstablishmentDataForm/> },
		{ title: "Endereço", name: "address", content: <EstablishmentFormAdress/> },
		{ title: "Personalização", name: "visual", content: <EstablishmentFormVisual/> }
	];

	const create = async (data: any) => {
		const formIsValid = isValidEstablishmentForm(data); 
		if (formIsValid !== true) {
			erroAlert.show("Erro","Por favor, preencha todos os campos obrigatórios", 3000);
			return;
		}

		formModal.setLoading(true);
		const requestBody  = prepareBodyData("default", data);
		const createResult = await createEstablishment(user, requestBody);
			
		if (createResult.statusCode === 200 || createResult.statusCode === 201 ) {
			const establishmentId = createResult.responseData.id;
			const logoFile = data.visual?.image?.value.file;

			if (logoFile instanceof File) {
				const assignedUrl = await getImageUploadLink(user, establishmentId, logoFile.name);
				if (assignedUrl.statusCode === 200 && assignedUrl.responseData) {
					await uploadImage(assignedUrl.responseData.uploadUrl, logoFile);

                    setTimeout(()=> {
					    formModal.setLoading(false);
					    formModal.hidden();
					    blackWindow.hidden();
					    setUpdateTable(prev => prev + 1);
					    successAlert.show("Sucesso","Estabelecimento criado com sucesso", 3000);
                    },3000);
					return;
				}
			}

			formModal.setLoading(false);
			formModal.hidden();
			blackWindow.hidden();
			erroAlert.show("Erro",`${createResult.responseData?.message || createResult.responseData?.error || "Erro desconhecido"}`, 5000);
			return;
		}

		formModal.setLoading(false);
		formModal.hidden();
		blackWindow.hidden();
		erroAlert.show("Erro",`${createResult.responseData?.message || createResult.responseData?.error || "Erro desconhecido"}`, 5000);
		return;
	};

	const remove = async () => {
		deleteModal.setLoading(true);
		let response;
		console.log(deleteModal.data)
		if (!deleteModal.data) {
			deleteModal.setLoading(false);
			deleteModal.hidden();
			blackWindow.hidden();
			erroAlert.show("Erro","Estabelecimento não encontrado", 3000);
			return;
		}

    	try {
        	response = await api.delete(`establishment/${deleteModal.data}`, {
				headers: {
					'Authorization': `Bearer ${user?.accessToken}`
				}
			});

			if (response.status === 204 || response.status === 201 || response.status === 200) {
				deleteModal.setLoading(false);
				deleteModal.hidden();
				blackWindow.hidden();
				successAlert.show("Sucesso","Estabelecimento removido com sucesso", 3000);
				setUpdateTable(prev => prev + 1);
			}
    	} catch (error) {
			deleteModal.setLoading(false);
			deleteModal.hidden();
			blackWindow.hidden();
			erroAlert.show("Erro",response?.data?.message || "Erro ao remover estabelecimento", 3000);
		}
	};

	const update = async (data:any) => {
		const formIsValid = isValidEstablishmentForm(data);
		const establishmentId = formModal.data?.id;
		console.log(data)

		if (formIsValid !== true) {
			erroAlert.show("Erro","Por favor, preencha todos os campos obrigatórios", 3000);
			return;
		}
		
		formModal.setLoading(true);
		const imageField = data.visual?.image?.value?.file;
		const imageName = imageField instanceof File ? imageField.name: imageField;
		const requestBody  = prepareBodyData(imageName, data);

		const updateResult = await updateEstablishment(user, establishmentId, requestBody);

		if (updateResult.statusCode === 200) {
			if (imageField instanceof File) {
				const image = data.visual?.image?.value?.file;
				const assignedUrl = await getImageUploadLink(user, establishmentId, image.name);

				if (assignedUrl.statusCode === 200 && assignedUrl.responseData) {
					const uploadStatus = await uploadImage(assignedUrl.responseData.uploadUrl, image);
					if ( uploadStatus.statusCode !== 200 ) {
						formModal.setLoading(false);
						formModal.hidden();
						blackWindow.hidden();
						erroAlert.show("Erro","Erro ao fazer Atualizar imagem", 3000);
						return;
					}
				}
			}

			formModal.setLoading(false);
			formModal.hidden();
			blackWindow.hidden();
			setUpdateTable(prev => prev + 1);
			successAlert.show("Sucesso","Os dados foram atualizados com sucesso", 3000);
			return;
		} else {
			formModal.setLoading(false);
			formModal.hidden();
			blackWindow.hidden();
			erroAlert.show("Erro",`${updateResult.responseData?.message || updateResult.responseData?.error || "Erro desconhecido"}`, 5000);
			return;
		}		
	}

	const view = (e:any) => {
		setViewEstablishment({
			id: e.id || "",
			name: e.name || "",
			slogan: e.slogan || "",
			slug: "ainda nao tem",
			logo: e.imageUrl || "",
			palette: e.palette || "",
			template: e.template || 0,
			mensalAmount: 100,
			servicesPerWeek: 100,
			topClientes: topClientes,
			bestServices: bestServices,
			onCustomize: () => {},
		});
	}

	const handleRowClick = (establishment:any, action:string) => {
		if (action === 'delete') {
			formModal.hidden();
			blackWindow.show();
			deleteModal.show(establishment.id);
		} else if (action === 'edit') {
			setFormMethod('edit');
			formModal.hidden();
			deleteModal.hidden();
			blackWindow.show();
			formModal.show(establishment);
			fillEstablishmentForm(establishment);
		} else if (action === 'EditTeam') {
			blackWindow.show();
			professionalScheduleManagerModal.show(establishment.id);
		} else if (action === 'invite') {
			blackWindow.show();
			inviteProfissionalModal.show(establishment.id);
		}
		else { view(establishment);}
	}

	return (
		<section className={style.estableshmentPage}> 
			<header className={style.estableshmentHeader}>
				<h1 className={style.estableshmentHeaderTitle}>
					Estabelecimentos 
					<span className={style.estableshmentHeaderSubtitle}>
						Controle o branding e a performance das suas unidades
					</span>
				</h1>
				<button 
					className={style.estableshmentHeaderButton} 
					onClick={() => {
						resetForm();
						setFormMethod('create');
						blackWindow.show();
						formModal.show();
					}}> 
					Criar Novo
				</button>
			</header>

			<main className={style.estableshmentContent}>
				<EstablishmentTable updateTable={updateTable} onClick={handleRowClick} />
				<EstablishmentDashboardCard data={viewEstablishment} />
			</main>
			
			<BlackWindow isVisible={blackWindow.visible}>
				<FormStep
					isVisible= {formModal.visible} 
					isLoading= {formModal.loading}
					loadingText="Criando estabelecimento, Por favor aguarde..."
					title="estabelecimento"
					type={formMethod}
					forms={ forms as any }
					close={() => {
						formModal.hidden();
						blackWindow.hidden();
					}}
					onFinished={(data) => { 
						if (formMethod === 'create') create(data);  else update(data); 
					}} 
				/>

				<InviteProfessionalModal 
					establishmentId={inviteProfissionalModal.data}
					isVisible={inviteProfissionalModal.visible} 

					onClose={() => {
						blackWindow.hidden();
						inviteProfissionalModal.hidden();
					} } 
				/>

				<ProfessionalScheduleManager 
					establishmentId={professionalScheduleManagerModal.data} 
					isVisible={professionalScheduleManagerModal.visible} 
					onClose={()=>{
						blackWindow.hidden();
						professionalScheduleManagerModal.hidden();
					}}			
				/>

				<DeleteConfirmationModal 
					isVisible= {deleteModal.visible} 
					isLoading= {deleteModal.loading}
					loadingText="Removendo estabelecimento, Por favor aguarde..."
					onChoice={(option:boolean) => {
						if (!option) { 
							blackWindow.hidden();
							deleteModal.hidden(); 
							return; 
						} 
						remove();
					}}
				/>
			</BlackWindow>
		 	<ErrorAlert   isVisible={erroAlert.isVisible} title={erroAlert.title} message={erroAlert.message}/>
			<SuccessAlert isVisible={successAlert.isVisible} title={successAlert.title} message={successAlert.message}/>
		</section> 
	);
}
