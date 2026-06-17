
import type { FormChildProps } from "../../../types/MultStepForm";
import type { EstablishmentForm_adress } from "../../../types/Estableshment";
import { TextInput } from "../../inputs/TextInput";
import styles from "./styles/establishmentformadress.module.css";
import { LocationInput } from "../../inputs/LocationInput";
import { CepInput } from "../../inputs/CepInput";
import { EstablishmentFormStore } from "../../../store/EstablishmentFormStore";
import type { Location } from "../../../types/Location";
import { useEffect } from "react";

export function EstablishmentFormAdress({ onFormChange }: FormChildProps<EstablishmentForm_adress>) {
	const { adressData, setAdressData } = EstablishmentFormStore();
	
	const updateByCepData = (data: Location, isCepValid: boolean, cepError: string | null) => {
		const checkField = (textValue: string | undefined) => {
			const value = textValue?.trim() || "";
			const hasContent = value.length > 0;
			return {value, isValid: hasContent, errorMessage: hasContent ? null : "Informação não encontrada"};
		};

		const streetStatus = checkField(data.street);
		const neighborhoodStatus = checkField(data.neighborhood);
		const cityStatus = checkField(data.city);
		const stateStatus = checkField(data.uf);

		setAdressData({...adressData,
			cep: { ...adressData.cep, value: data.cep || "",  isValid: isCepValid,  errorMessage: cepError },
			street: { ...adressData.street, ...streetStatus },
			neighborhood: { ...adressData.neighborhood, ...neighborhoodStatus},
			city: { ...adressData.city, ...cityStatus},
			state: { ...adressData.state, ...stateStatus }
		});
	};

	useEffect(()=>{
		const isValid = 
			adressData.cep.isValid && 
			adressData.street.isValid && 
			adressData.neighborhood.isValid && 
			adressData.state.isValid && 
			adressData.number.isValid &&
			adressData.city.isValid;

		onFormChange?.(adressData, isValid);
	},[adressData]);

	return (
		<div className={styles.adressEstablishmentDataForm}>
			<header className={styles.adressEstablishmentDataFormHeader}>
				<h1 className={styles.adressEstablishmentDataFormHeaderTitle}>Endereço</h1>
				<span className={styles.adressEstablishmentDataFormHeaderSubtitle}>Informe o endereço do estabelecimento</span>
				<CepInput 
					initialValue={adressData.cep.value} 
    				onChangeField={(e) => updateByCepData(e.value, e.isValid, e.errorMessage)} />	
			</header>
			<LocationInput 
				initialValue={{
					uf:   adressData.state.value,
					city: adressData.city.value
				}}
				showBanner={false} 
				onChangeField={(e)=>{
					setAdressData({
						state:{...adressData.state,value:e.value.uf},
						city:{...adressData.city,value:e.value.city}
					});
				}}/>
			<TextInput 
				initialValue={adressData.neighborhood.value}
				label="Bairro" 
				placeholder="Ex. Centro" 
				onChangeField={(e)=> setAdressData({neighborhood: e})}/>

			<div className={styles.adressEstablishmentDataFormTwoColumns}>
				<TextInput 
					initialValue={adressData.street.value}
					label="Rua/Av." 
					placeholder="Ex. Rua das Flores" 
					onChangeField={(e) => setAdressData({street: e})} 
				/>
				<TextInput 
					initialValue={adressData.number.value}
					label="N° do estabelecimento" 
					placeholder="Ex. 123" 
					onChangeField={(e) => setAdressData({number: e})} 
				/>
			</div>
		</div>
	);
}
