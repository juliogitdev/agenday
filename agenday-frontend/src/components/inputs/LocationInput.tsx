
import { MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { UF, Location, City } from "../../types/Location";
import styles from './styles/locationInput.module.css';

type LocationInputProps = {
	onChose: (value: Location) => void;
};

export function LocationInput({ onChose }: LocationInputProps) {
	const [apiUfs, setUfs] = useState<UF[]>([]);
  	const [selectedUf, setSelectedUf] = useState<string>("");
  	const [apiCitys, setCitys] = useState<City[]>([]);
  	const [selectedCity, setSelectedCity] = useState<string>("");

 	useEffect(() => {
    	fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      		.then((res) => res.json())
      		.then((data) => setUfs(data));
  	}, []);


  	useEffect(() => {
    	if (!selectedUf) { setCitys([]);return;}
    	fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      		.then((res) => res.json())
      		.then((data) => setCitys(data));
  	}, [selectedUf]);

  
  	useEffect(() => {
    	if (selectedUf && selectedCity) {
      		onChose({
        		uf: selectedUf,
        		city: selectedCity,
      		});
    	}
  	}, [selectedUf, selectedCity, onChose]);

  	const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    	setSelectedUf(e.target.value);
    	setSelectedCity(""); 
  	};

  	return (
    	<div className={styles.locationInput}>
      		<span className={styles.locationLabel}>
        		<MapPin className={styles.locationIcon} /> Preencha com sua localização
      		</span>
      		<div className={styles.locationInputContainer}>
				<div className={styles.locationInputLeft}>
					<label className={styles.locationInputLabel} htmlFor="uf">Estado</label>
					<select 
						className={styles.locationSelect}
						value={selectedUf} 
						onChange={handleUfChange} 
						name="uf" id="uf"
					>
						<option value="">Selecione um estado</option>
						{apiUfs.map((uf) => (
							<option key={uf.id} value={uf.sigla}>{uf.nome}</option>
						))}
					</select>
				</div>
				
				<div className={styles.locationInputRight}>
					<label className={styles.locationInputLabel} htmlFor="city">Cidade</label>
					<select
						value={selectedCity}
						onChange={(e) => setSelectedCity(e.target.value)}
						disabled={!selectedUf}
						name="city"
						id="city"
						className={styles.locationSelect}
					>
						<option value="">Selecione uma cidade</option>
							{apiCitys.map((city) => (
						<option key={city.id} value={city.nome}>{city.nome}</option>))}
					</select>
				</div>
      		</div>
    	</div>
  );
}