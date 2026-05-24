

import { useEffect, useState } from "react";
import type { Location } from "../../types/Location";
import { valid } from "../../utils/Validations";
import styles from "./styles/cepinput.module.css";
import type { InputProps } from "../../types/Inputs";

export function CepInput({initialValue,onChangeField}:InputProps<Location>) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [cepValue, setCepValue] = useState<string>(initialValue || "");
	const [isSearching, setIsSearching] = useState<boolean>(false);

	const onFind = async (value:string) => {
		try {
			setErrorMessage(null);
			setIsSearching(true);
			const isValid = valid.cep(value);
			if ( isValid == null ) { // cep com formato válido
				const response = await fetch( `https://brasilapi.com.br/api/cep/v1/${value}`);
				const data = await response.json();	

				if (response.status == 200 ) {
					onChangeField?.({
						value: {
							uf:data.state,
							city:data.city,
							neighborhood:data.neighborhood || "",
							street:data.street || "",
							cep:value
						},
						errorMessage: null,
						isValid: true
					});
				}
				setIsSearching(false);
			} else {
				onChangeField?.({
					value: {uf:"", city:"", neighborhood:"", street:"", cep:""},
					errorMessage: "CEP com formato inválido",
					isValid: false
				});
				setIsSearching(false);
			}
		}
		catch{ 
			setErrorMessage("Erro ao buscar CEP");
			onChangeField?.({
				value: {uf:"", city:"", neighborhood:"", street:"", cep:""},
				errorMessage: "CEP com formato inválido",
				isValid: false
			});
			setIsSearching(false);
		}
	};

	const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
		if (valid.cep(e.target.value) == null) {setErrorMessage(null)}
	    else{setErrorMessage("CEP com formato inválido")}
		setCepValue(e.target.value);
	};

	useEffect(() => {
		if (initialValue !== undefined && initialValue !== cepValue) {
			setCepValue(initialValue);
			if (initialValue.length > 0) {  
				setErrorMessage(valid.cep(initialValue));
			} 
		}
	}, [initialValue]);

    return (
        <div className={styles.cepContainer}>
			<label className={styles.cepLabel} htmlFor="cep">Buscar endereço - CEP</label>
			<div className={styles.cepInputContainer}>
				<div style={{flex:1}}>
                	<input 
						type="text" 
						id="cep" 
						value={cepValue} 
						onChange={onChangeHandler} 
						placeholder="Ex. 01001-000" 
						className={styles.cepInput}/>
					{ errorMessage != null && <span className={styles.cepError}>{errorMessage}</span>}
				</div>

				{ isSearching ? (
					<button className={styles.cepButtonSearching}> buscando... </button>
				) : (
					<button 
						onClick={(e) => { 
							e.preventDefault(); 
							onFind(cepValue);}} 
						className={styles.cepButton}>
						buscar 
					</button>
				)}
            </div>
        </div>
    );
}