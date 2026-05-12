
import { useState } from 'react';
import styles from './styles/nameInput.module.css';
import { validateName } from '../../utils/Validations';

type nameInputProps = {
	name: string;
  	onChange: (value: string, isValid: boolean) => void;
};

export function NameInput({name, onChange}: nameInputProps) {
	let [error, setError] = useState<string | null>(null);
	
	const checkNameError = (value: string) => {
		const validation = validateName(value);
		const nameField = document.getElementById("name") as HTMLInputElement;
		if (nameField) 
			nameField.style.borderColor = validation.isValid ? "var(--name-input-border)" : "var(--name-error)";
	
		setError(validation.error || "");
	};

	return (
		<div className={styles.nameInput}>
			<label htmlFor="name" className={styles.nameLabel}>Nome completo</label>
			<input
				className={styles.nameField}
				type="text"
				id="name"
				name="name"
				value={name}
				onChange={(e) => {
					const value = e.target.value;
					checkNameError(value);
          			onChange(value, validateName(value).isValid);
        		}}
				placeholder="Digite seu nome completo"
			/>
			<span className={styles.nameError}>{error}</span>
		</div>
	);
}