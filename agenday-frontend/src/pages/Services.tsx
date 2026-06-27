

import { useContext, useState, useEffect } from "react";
import { ServiceForm } from "../components/Forms/ServiceForm";
import { ServicesTable, type TableClickCallback, type TableServicesData } from "../components/tables/ServicesTable";
import styles from "./styles/services.module.css"
import AuthContext from "../context/AuthContext";
import { AlertHook } from "../hooks/AlertsHook";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { ComboBox } from "../components/inputs/ComboBox";
import { type EstablishmentSummary } from "../types/Estableshment";
import { ServiceUseFormStore } from "../store/ServiceFormStore";
import image404 from './../../public/resource/icons/image_404.png';
import { ModalHook } from "../hooks/ModalHook";
import { LoadingClock } from "../components/Alerts/LoadingClock";
import { BlackWindow } from "../components/Ui/BlackWindow";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import { DeleteConfirmationModal } from "../components/Modal/DeleteConfirmationModal";
import type { InputProps } from "../types/Inputs";
import type { ComboBoxOption } from "../types/ComboBox";

type Employers = {
	professionalEstablishmentId: string,
	catalogItemId: string,
	customPrice: number,
	customDurationMinutes: number
}

export function Services() {
    const {api} = useContext(AuthContext);
    const errorAlert  = AlertHook();
    const sucessAlert = AlertHook();
    const createForm  = ModalHook();
    const blackWidow  = ModalHook();
    const deletModal  = ModalHook();
    const editModal   = ModalHook();

    const image_url = import.meta.env.VITE_STORAGE_BASE_URL+/agenday-images/;
    const form = ServiceUseFormStore();
    
    const [updateTable, setUpdateTable] = useState<boolean>(false);
    const [services, setServices] = useState<TableServicesData[]>([]); 
    const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState<EstablishmentSummary | null>(null);
    const NO_ESTABLISHMENTS = [{ label: "Nenhum estabelecimento encontrado", value: '' }];
	
    const [establshimentComboBoxState, setEstablishmentComboBoxState] = useState({
        value: {
            selectedValue: '',
            selectedLabel: '',
            options: NO_ESTABLISHMENTS
        },
        errorMessage: null,
        isValid: true
    });

    useEffect(()=>{
        let active:boolean = true;
        const getEstablishements = async (): Promise<EstablishmentSummary[] | null > => {
            try {
                const r = await api.get('establishment/my-units/summary');
                if (r.status === 200 && active) {  
                    setEstablishments(r.data); 
                    setUpdateTable(!updateTable);
                    return r.data
                }
                return null;

            }catch { 
                errorAlert.show("Erro", "Não foi possível atualizar a lista de estabelecimentos",5000);
                return null;
            }
        }

		const getEmployers = async (establismentId:string): Promise<Employers[] | null > => {
			try {
				const r = await api.get(`professional-establishments/establishment/${establismentId}`);
				if (r.status == 200 && active ) {
					setUpdateTable(!updateTable);
					return r.data;
				}
				return null;
			}
			catch{return null}
		}
        
        const updateComboBox = async () => {
            const establishments = await getEstablishements(); 
            if (!establishments || !active || establishments.length == 0) return; 

            const newOptions = establishments.map((d: any) => ({ label: d.name, value: d.id }));
            const finalOptions = newOptions.length > 0 ? newOptions : NO_ESTABLISHMENTS;
            setSelectedEstablishment(establishments[0]);

            setEstablishmentComboBoxState(prevState => ({
                ...prevState,
                value: {
                    selectedLabel: establishments[0].name,
                    selectedValue: establishments[0].id,
                    options: finalOptions
                }
            }));

			const employers = await getEmployers(establishments[0].id);
			console.log(employers);
        };

        updateComboBox();
        return ()=>{active=false}
    },[api]);


    useEffect(()=>{
        let active:boolean = true;

        const updateServices = async ()=> {
            if (!selectedEstablishment?.id || ! active ){ return; }
            const establishmentId = selectedEstablishment.id;

            api.get(`catalogItem/establishment/${establishmentId}`).then((r)=>{
                if (r.status == 200 ) {
                    const newServices = r.data.map((d:any)=>({
                        name: d.name,
                        duration: d.defaultDurationMinutes,
                        price: d.defaultPrice,
                        asPromotion: null,
                        description: d.description,
                        serviceId: d.id
                    }));
                    setServices(newServices);
                }
            }).catch((e)=>{ console.log(e)});
        }

        updateServices();
        return ()=> { active = false;}
    },[updateTable]);


    const create = async () => {
        blackWidow.show('');
        createForm.show("Criando novo serviço, por favor aguarde..");
        let isValid:boolean = form.namer?.isValid &&
                        form.descr?.isValid &&
                        form.price?.isValid &&
                        form.timer?.isValid;
        isValid = (isValid && selectedEstablishment != null ) ? true : false;
        if (isValid) {
             const body = {
                id_establishment: selectedEstablishment?.id,
                name: form.namer.value,
                description: form.descr.value,
                defaultPrice: parseInt(form.price.value),
                defaultDurationMinutes: parseInt(form.timer.value)
             }
            setTimeout(()=> {
                api.post('catalogItem/register',body).then((r)=>{
                    if (r.status == 201 ) {
                        createForm.hidden();
                        blackWidow.hidden();
                        setUpdateTable(!updateTable);
                        sucessAlert.show("Serviço Registrado", "Um novo serviço foi registrado no seu estabelecimento", 5000)
                        return;
                    }
                }).catch((e)=>{
                    setTimeout(()=>{
                        createForm.hidden();
                        blackWidow.hidden();
                        errorAlert.show("Erro", "Desculpe, não foi possivel adicionar este serviço ao seu estabelecimento", 4000);
                    },1000);
                    console.log(e)
                })
            },2400);
        } else {
            setTimeout(()=> {
                createForm.hidden();
                blackWidow.hidden();
                errorAlert.show("Campos Inválidos", "Verifique os campos e tente novamente", 4000);
            },3000);
        }
    }


    const remove = async (option:boolean) => {
        if (!option) {
            blackWidow.hidden();
            deletModal.hidden();
        } else {
            deletModal.setLoading(true);
            api.delete(`catalogItem/delete/${deletModal.data}`).then((r)=>{
                if (r.status == 204 ) {
                    blackWidow.hidden();
                    deletModal.hidden();
                    setUpdateTable(!updateTable);
                    sucessAlert.show("Sucesso", "O serviço foi removido com sucesso !!", 5000);
                    return;
                }
            }).catch((e)=> {
                blackWidow.hidden();
                deletModal.hidden();
                setUpdateTable(!updateTable);
                errorAlert.show("Erro", "Não foi possível remover o serviço !!", 5000);
                console.log(e)
                return;
            });
        }
    }

    const edit = async ()=> {
        editModal.setLoading(true);

        const requestBody = {
            description: form.descr.value,
            defaultPrice: form.price.value,
            defaultDurationMinutes: form.timer.value,
        }

        api.patch(`catalogItem/update/${editModal.data}`,requestBody).then((r)=>{
            if (r.status == 200 ) {
                setTimeout(()=> {
                    blackWidow.hidden();
                    editModal.hidden();
                    // form.resetForm();
                    form.setDescr({value:'', errorMessage:null, isValid:true});
                    form.setPrice({value: '', errorMessage:null, isValid:true});
                    form.setTimer({value: '', errorMessage:null, isValid:true});
                    form.setNamer({value: '', errorMessage:null, isValid:true});
                    sucessAlert.show("Sucesso", "Os dados do serviço foram atualizados com sucesso", 5000);
                    setUpdateTable(!updateTable);
                },3000);
            }
        }).catch((e)=>{console.log(e)});
    }


    const actionsHandler = (d:TableClickCallback) => {
        if (d.action === 'delete' ) {
            blackWidow.show('');
            deletModal.show(d.serviceId)
        }

        if (d.action == 'edit' ) {
            const service = services.find(s => s.serviceId === d.serviceId);
            if (service) {
                form.setDescr({value: service.description, errorMessage:null, isValid:true});
                form.setPrice({value: service.price, errorMessage:null, isValid:true});
                form.setTimer({value: service.duration, errorMessage:null, isValid:true});
                form.setNamer({value: service.name, errorMessage:null, isValid:true});
                blackWidow.show('');
                editModal.show(d.serviceId);
            } else {
                form.resetForm()
                errorAlert.show("Error", "O serviço selecionado é inválido",4000);
            }
        }
    } 

    return (
		<section className={styles.servicesPage}> 
            <div className={styles.servicesHeader}>
                <div className={styles.servicesHeaderInfoContainer}>
                    <img 
                        src={selectedEstablishment?.imageUrl ? (image_url + selectedEstablishment.imageUrl) : image404} 
                        alt={selectedEstablishment?.name || "Estabelecimento"}
                        className={styles.servicesHeaderImg}/>

                    <h1 className={styles.serviceHeaderTitle}>
                        {selectedEstablishment?.name || 'Nenhúm estabelecimento Encontrado'}
                        <span  className={styles.serviceHeaderSubtitle}>{selectedEstablishment?.slogan || '... ..'}</span> 
                    </h1>
                </div>
                <div className={styles.servicesHeaderComboboxContainer}>
                    <ComboBox 
                        label="Selecione um estabelecimento" 
                        initialValue={establshimentComboBoxState}
                        onChangeField={(d)=>{
                            const found = establishments.find(est => est.id === d.value.selectedValue);
                            setUpdateTable(!updateTable);
                            setSelectedEstablishment(found || null);
                        }}
                    />
                </div>
            </div> 
            <div className={styles.servicesContent}>
                <ServicesTable
                    isLoading={false}
                    serviceList={services} 
                    onCLick={(d:TableClickCallback)=> actionsHandler(d)}/> 
                 
                <ServiceForm 
                    showCloseBnt={false}
                    isLoading={false}
                    loadingText="Adicionando novo Serviço, por favor aguarde.."
                    isVisible={true}
                    buttonLabel="Adicionar Novo Serviço"
                    onClose={()=>{}}
                    onClick={()=>create()}
                 /> 
            </div>
            
            <BlackWindow isVisible={blackWidow.visible}>
                <LoadingClock isLoading={createForm.visible} text={createForm.data || "Carregando.. "}/>
                <DeleteConfirmationModal
                    isVisible={deletModal.visible}
                    isLoading={deletModal.loading}
                    onChoice={(e:boolean)=> remove(e)}
                    loadingText="Removendo Serviço, por favor aguarde.."
                />
                <ServiceForm 
                    showCloseBnt={true}
                    isLoading={editModal.loading}
                    isVisible={editModal.visible}
                    buttonLabel="Atualizar"
                    loadingText="Atualizando dados do serviço"
                    onClose={()=> {
                        blackWidow.hidden()
                        editModal.hidden()
                    }}
                    onClick={()=>edit()}
                />
            </BlackWindow>

            <ErrorAlert isVisible={errorAlert.isVisible} title={errorAlert.title} message={errorAlert.message}/>
            <SuccessAlert isVisible={sucessAlert.isVisible} title={sucessAlert.title} message={sucessAlert.message}/>
		</section> 
	);
}
