
import type { EstablishmentForm_basic } from "../../../types/Estableshment";
import type { FormChildProps } from "../../../types/MultStepForm";
import { TextInput } from "../../inputs/TextInput";
import { PhoneInput } from "../../inputs/PhoneInput";
import style from "./styles/establishmentformbasic.module.css";
import { useEffect } from "react";
import { EstablishmentFormStore } from "../../../store/EstablishmentFormStore";


export function BasicEstablishmentDataForm({ onFormChange }: FormChildProps<EstablishmentForm_basic>) {	
	const { basicData, setBasicData } = EstablishmentFormStore();

	useEffect(() => {
		const isValid = 
			basicData.name.isValid && 
			basicData.category.isValid && 
			basicData.numberPhone.isValid;

		onFormChange?.(basicData, isValid);
	}, [basicData]);

    return (
        <div className={style.establishmentBasicForm}>
            <header className={style.establishmentBasicFormHeader}>
                <h1 className={style.establishmentBasicFormHeaderTitle}>Informações Básicas</h1>
                <span className={style.establishmentBasicFormHeaderSubtitle}>Informe os dados básicos do estabelecimento</span>
            </header>

            <TextInput 
				initialValue={basicData.name.value} 
				label="Nome do estabelecimento"  
				placeholder="Ex: Barbearia São Paulo"  
				onChangeField={(e)=>setBasicData({name: e})}/>

            <div className={style.establishmentBasicFormTwoColumns}>
				<TextInput  
					initialValue={basicData.category.value}
					label="Categoria"  
					placeholder="Ex: Barbearia"  
					onChangeField={(e)=>setBasicData({category: e})}/>
				<PhoneInput 
					initialValue={basicData.numberPhone.value}
					label="Telefone" 
					onChangeField={(e)=>setBasicData({numberPhone: e})} />
            </div>
        </div>
    );
}