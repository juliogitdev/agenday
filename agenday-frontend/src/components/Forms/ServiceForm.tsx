

import styles from "./styles/serviceform.module.css"
import { TextInput } from "../inputs/TextInput";
import { SolidButton } from "../buttons/SolidButton";
import { AlertHook } from "../../hooks/AlertsHook";
import { ErrorAlert } from "../Alerts/ErrorAlert";
import type { InputCallback } from "../../types/Inputs";
import { ServiceUseFormStore } from "../../store/ServiceFormStore";
import { Loader } from "lucide-react";

export type ServiceFormData = {
    price: InputCallback;
    name: InputCallback;
    duration: InputCallback;
    description: InputCallback;
}

export type ServiceFormProps = {
    buttonLabel: string;
    showCloseBnt: boolean;
    isVisible: boolean;
    isLoading: boolean;
    loadingText: string;
    data?:ServiceFormData;
    onClose: ()=> void;
    onClick: ()=> void;
}

export function ServiceForm({buttonLabel, isLoading,loadingText, showCloseBnt=false, isVisible=true, onClose, onClick}:ServiceFormProps) {
    const form  = ServiceUseFormStore();
    const errorAlert = AlertHook();

    return isVisible ? (
        <div className={styles.serviceFormContainer}>
            {showCloseBnt && (
                <div className={styles.serviceFormCloseButtonContainer}>
                    <p>Atualizar Serviço </p>
                    <button onClick={onClose}>x</button>
                </div>
            )}
            
            { isLoading && (
                <div className={styles.serviceFormLoading}>
                    <Loader size={25} className={styles.serviceFormLoadingIcon} /> 
                    <span className={styles.serviceFormLoadingText}>{loadingText}</span>
                </div>
            )}

            <div className={styles.serviceFormTwoColumn}>
                <TextInput 
                    initialValue={form.price?.value || ''}
                    label="Preço" 
                    placeholder="56,99" 
                    onChangeField={(d)=>{form.setPrice(d)}} />
                <TextInput
                    initialValue={form.timer?.value || ''}
                    label="Duração (Em minutos )" 
                    placeholder="30" 
                    onChangeField={(d)=>{form.setTimer(d)}} />
            </div>

             <TextInput 
                initialValue={form.namer?.value || ''}
                label="Nome/Identificação" 
                placeholder="Corte degradê - Masculino" 
                onChangeField={(d)=>{form.setNamer(d)}} /> 
             <div style={{margin:'15px 0'}}></div>

             <TextInput 
                initialValue={form.descr?.value || ''}
                label="Descrição" 
                placeholder="Faça uma breve descrição do serviço.." 
                _height={120}
                onChangeField={(d)=>{form.setDescr(d)}} 
            />
            
            <div style={{margin:'15px 0'}}></div>

            <SolidButton
                text={buttonLabel}
                isActive={true}
                isLoading={false}
                onClick={onClick}
            />

            <ErrorAlert isVisible={errorAlert.isVisible} title={errorAlert.title} message={errorAlert.message}/>
        </div>
    ) : null;
}
