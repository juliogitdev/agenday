
import type { EstablishmentForm_basic } from "../../../types/Estableshment";
import type { FormChildProps } from "../../../types/MultStepForm";
import { TextInput } from "../../inputs/TextInput";
import { PhoneInput } from "../../inputs/PhoneInput";
import style from "./styles/establishmentformbasic.module.css";
import { useEffect } from "react";
import { EstablishmentFormStore } from "../../../store/EstablishmentFormStore";
import { ComboBox } from "../../inputs/ComboBox";


export function BasicEstablishmentDataForm({ onFormChange }: FormChildProps<EstablishmentForm_basic>) {	
	const { basicData, setBasicData } = EstablishmentFormStore();
	
	useEffect(() => {
		const isValid = 
			basicData.name.isValid && 
			basicData.category.isValid && 
			basicData.numberPhone.isValid;

		onFormChange?.(basicData, isValid);
	}, [basicData]);

	const options = [
		{ label: 'Barbearia', value: 'BARBERSHOP' },
		{ label: 'Salão de Beleza', value: 'BEAUTY_SALON' },
		{ label: 'Manicure e Pedicure', value: 'NAIL_SALON' },
		{ label: 'Estética', value: 'ESTHETIC_CLINIC' },
		{ label: 'Design de Sobrancelhas', value: 'EYEBROW_STUDIO' },
		{ label: 'Extensão de Cílios', value: 'EYELASH_STUDIO' },
		{ label: 'Tratamentos Capilares', value: 'HAIR_CLINIC' },
		{ label: 'Spa', value: 'SPA' },
		{ label: 'Massoterapia', value: 'MASSAGE_CENTER' },
		{ label: 'Estúdio de Tatuagem', value: 'TATTOO_STUDIO' },
		{ label: 'Estúdio de Piercing', value: 'PIERCING_STUDIO' },
		{ label: 'Maquiagem', value: 'MAKEUP_STUDIO' },
		{ label: 'Outros', value: 'OTHER' }
	]

	const comboBoxOptions = {
		value: {
			selectedValue: basicData.category.value?.selectedValue || 'BARBERSHOP',
			selectedLabel: options.find( (opt:any) => opt.value === basicData.category.value?.selectedValue )?.label || "Barbearia",
			options
		},
		errorMessage: basicData.category.errorMessage,
		isValid: basicData.category.isValid
	};

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
				<ComboBox
					label="Categoria"
					initialValue={comboBoxOptions}
					onChangeField={(e:any)=>setBasicData({category: e})}
				/>
				<PhoneInput 
					initialValue={basicData.numberPhone.value}
					label="Telefone" 
					onChangeField={(e)=>setBasicData({numberPhone: e})} />
            </div>
        </div>
    );
}