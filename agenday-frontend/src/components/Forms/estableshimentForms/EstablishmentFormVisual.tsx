
import type { EstablishmentForm_visual } from "../../../types/Estableshment";
import type { FormChildProps } from "../../../types/MultStepForm";
import { UploadLogo } from "../../inputs/UploadLogo";
import { TextInput } from "../../inputs/TextInput";
import { EstablishmentFormStore } from "../../../store/EstablishmentFormStore";
import styles from "./styles/establishmentformvisual.module.css";
import { ColorPicker } from "../../inputs/ColorPicker";
import { useEffect } from "react";

export function EstablishmentFormVisual({ onFormChange }: FormChildProps<EstablishmentForm_visual>) {
    const { visualData, setVisualData } = EstablishmentFormStore();
    
	useEffect(()=>{
		const isValid = 
			visualData.image.isValid && 
			visualData.slogan.isValid && 
			visualData.palette.isValid;

		onFormChange?.(visualData, isValid);
	},[visualData]);

    return (
        <div className={styles.visualEstablishmentDataForm}>
            <header className={styles.visualEstablishmentDataFormHeader}>
                <h1 className={styles.visualEstablishmentDataFormHeaderTitle}>Personalização</h1>
                <span className={styles.visualEstablishmentDataFormHeaderSubtitle}>
                    Escolha o template e a paleta de cores do seu estabelecimento
                </span>
            </header>
            <UploadLogo 
				initialValue={visualData.image}  	
				onChangeField={(e)=>setVisualData({ image: e })} 
			/>

            <div style={{ marginTop: "20px" }}></div>
        
			<TextInput 
				initialValue={visualData.slogan.value} 
				label="Slogan do estabelecimento" 
				onChangeField={(e)=>setVisualData({slogan: e})}/>
            
            <div style={{ marginTop: "20px" }}></div>
            <ColorPicker 
				 initialValue={visualData.palette.value}
				onChangeField={(e) => setVisualData({palette: e})}
			/>
        </div>
    );
}