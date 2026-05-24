
import { useEffect, useState } from 'react';
import styles from './styles/colorpicks.module.css';
import type { ColorPickerData, InputProps } from '../../types/Inputs';



export function ColorPicker({ initialValue, onChangeField }: InputProps<ColorPickerData>) {
	const [value, setValue] = useState<ColorPickerData>(initialValue || { 
		text_color: '#000000', 
		back_color: '#ffffff', 
		main_color: '#1d4f86' 
	});


	useEffect(() => {
		if (initialValue) {  setValue(initialValue);}

	}, [initialValue]);

	function handleColorChange(key: 'text_color' | 'back_color' | 'main_color', newValue: string) {
		const nextColorState = { ...value, [key]: newValue };
		setValue(nextColorState);

		onChangeField?.({
			value: nextColorState,
			errorMessage: '',
			isValid: true
		});
	}

	return (
		<fieldset className={styles.colorPickerContainer}>
			<legend className={styles.colorPickerLegend}>Cores principais</legend>
			
			<label className={styles.colorPickerLabel}> 
				<input 
					type="color" 
					className={styles.colorPickerInput} 
					value={value.text_color} 
					onChange={(e) => handleColorChange('text_color', e.target.value)}
				/> 
				fontes
			</label>
			
			<label className={styles.colorPickerLabel}> 
				<input 
					type="color" 
					className={styles.colorPickerInput} 
					value={value.back_color} 
					onChange={(e) => handleColorChange('back_color', e.target.value)}
				/> 
				fundos
			</label>
			
			<label className={styles.colorPickerLabel}> 
				<input 
					type="color" 
					className={styles.colorPickerInput} 
					value={value.main_color} 
					onChange={(e) => handleColorChange('main_color', e.target.value)}
				/> 
				destaques
			</label>
		</fieldset>
	);
}