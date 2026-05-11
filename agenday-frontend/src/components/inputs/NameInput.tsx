
import { useState } from 'react';
import styles from './styles/nameInput.module.css';

type nameInputProps = {
	name: string;
  	onChange: (value: string) => void;
};

export function NameInput({name, onChange}: nameInputProps) {
	let [error, setError] = useState<string | null>(null);
	
	// mover para Utils ou algo do tipo depois
	const checkNameError = (value: string) => {
		if (value.trim() === "") {
			setError("O nome não pode ser vazio.");
		} else if (value.trim().length < 3) {
			setError("O nome deve conter pelo menos 3 caracteres.");
		} else if (!/^[a-zA-Z\s]+$/.test(value)) {
			setError("O nome deve conter apenas letras e espaços.");
		} else if (value.trim().length > 50) {
			setError("O nome não pode exceder 50 caracteres.");
		} else {
			setError(null);
		}
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
          			onChange(value);
        		}}
				placeholder="Digite seu nome completo"
			/>
			<span className={styles.nameError}>{error}</span>
		</div>
	);
}