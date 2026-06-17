
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./styles/locationInput.module.css";
import type { InputProps } from "../../types/Inputs";
import type { Location } from "../../types/Location";

const STATE_API_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
const CITY_API_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/";

export function LocationInput({showBanner, initialValue, onChangeField}: InputProps<Location>) {
	const [uf, setUf] = useState(initialValue?.uf || "");
	const [city, setCity] = useState(initialValue?.city || "");
	const [ufList, setUfList] = useState<any[]>([]);
	const [cityList, setCityList] = useState<any[]>([]);

	useEffect(() => { fetch(STATE_API_URL).then(res => res.json()).then(data => setUfList(data));}, []);
	useEffect(() => {
		if (!uf) { setCityList([]); setCity(""); return;}
		fetch(`${CITY_API_URL}${uf}/municipios`)
			.then(res => res.json())
			.then(data => setCityList(data));

	}, [uf]);
	
	useEffect(() => {
		const isValid = uf.trim() !== "" && city.trim() !== "";
		onChangeField?.({
			value: { uf, city },
			errorMessage: isValid ? null : "Localização inválida", isValid
		});

	}, [uf, city]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { id, value } = e.target;
		if (id === "uf_field")   { setUf(value); setCity("");}
		if (id === "city_field") { setCity(value);}
	};

	useEffect(()=>{
		if(initialValue) {
			setUf(initialValue.uf);
			setCity(initialValue.city);
		}
	},[initialValue]);

	return ( 
		<div className={styles.locationInput}>
			{showBanner && ( <span className={styles.locationLabel}> 
				<MapPin className={styles.locationIcon} /> Sua Localização ou do seu comércio 
			</span> )} 

			<div className={styles.locationInputContainer}> 
				<div className={styles.locationInputLeft}> 
					<label className={styles.locationInputLabel}> Estado </label> 
					<select id="uf_field" className={styles.locationSelect} value={uf} onChange={handleChange}> 
						<option value="">Selecione um estado</option> 
						{ufList.map((uf) => ( <option key={uf.id} value={uf.sigla}> {uf.nome} </option> ))} 
					</select> 
				</div> 

				<div className={styles.locationInputRight}> 
					<label className={styles.locationInputLabel}> Cidade</label> 
					<select id="city_field" className={styles.locationSelect} value={city} onChange={handleChange} disabled={!uf}> 
						<option value="">Selecione uma cidade</option> 
						{cityList.map((city) => ( <option key={city.id} value={city.nome}> {city.nome}</option> ))} 
					</select> 
				</div> 
			</div> 
		</div> 
	);

}