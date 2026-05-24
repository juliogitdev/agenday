
import { useState } from 'react';
import styles from './styles/combobox.module.css';

type ComboOption = {
	placeholder?: string;
	label: string;
	value: string;
};

type ComboBoxProps = {
	label: string;
	value: string;
	options: ComboOption[];
	placeholder?: string;
	required?: boolean;
	onChange: (
		value: string,
		isValid: boolean
	) => void;
};

export function ComboBox({ 
			label, value, options, 
			placeholder = "Selecione uma opção", required = false, onChange 
		}: ComboBoxProps) 
{

	const [error, setError] = useState("");
	function validate(value: string) {
		if (required && !value) { setError("Campo obrigatório"); return false; }
		setError("");
		return true;
	}

	return (
		<div className={styles.comboBox}>
			<label className={styles.comboLabel}> {label}</label>
			<select
				value={value}
				className={`${styles.comboField} ${error ? styles.errorBorder : ""}`}
				onChange={(e) => {
					const newValue = e.target.value;
					const isValid = validate(newValue);
					onChange(newValue, isValid);
				}}>
				<option value="">{placeholder}</option>
				{options.map(option => (
					<option key={option.value} value={option.value}> {option.label}</option>
				))}
			</select>
			<span className={styles.comboError}> {error}</span>
		</div>
	);
}