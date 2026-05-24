
import React, { useEffect, useState } from 'react';
import type { InputProps } from '../../types/Inputs';
import styles from './styles/emailInput.module.css';
import { valid } from '../../utils/Validations';

export function EmailInput({onChangeField, label, placeholder, initialValue = ""}:InputProps) {
	const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState(initialValue)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;
		const validationError = valid.email(nextValue);

		setValue(nextValue);
		setError(validationError);

		onChangeField?.({
			value: nextValue,
			errorMessage: validationError,
			isValid: validationError === null
		});
	};

	useEffect(()=>{
		if(initialValue.length > 0) {
			setValue(initialValue);
			const validationError = valid.email(initialValue);
			setError(validationError);
		}
	},[initialValue]);

	const inputClass = error ? `${styles.emailField} ${styles.emailFieldError}` : styles.emailField;

	return (
		<div className={styles.emailInput}>
			<label className={styles.emailLabel}>{label || 'E-mail'}</label>
			<input
				className={inputClass}
				type="email"
				id="email" 
				name="email" 
				value={value} 
				onChange={handleChange}
				placeholder={placeholder || "exemplo@dominio.com"}
			/>
			<span className={styles.emailError} style={{ visibility: error ? 'visible' : 'hidden' }}>
				{error}
			</span>
		</div>
	);
}