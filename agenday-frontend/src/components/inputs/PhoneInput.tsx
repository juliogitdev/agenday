
import React, { useEffect, useState } from 'react';
import styles from './styles/phoneInput.module.css';
import { formatBRPhone, valid } from '../../utils/Validations';
import type { InputProps } from '../../types/Inputs';

export function PhoneInput({label, initialValue, placeholder, onChangeField}:InputProps) {
	const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState(initialValue)


	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;
		setValue(formatBRPhone(nextValue));
		
		const validationError = valid.phone(formatBRPhone(nextValue));
		setError(validationError);

		onChangeField?.({
			value: formatBRPhone(nextValue),
			errorMessage: validationError,
			isValid: validationError === null
		});
	}

	useEffect(()=>{
		if(initialValue) {
			setValue(formatBRPhone(initialValue));
			const validationError = valid.phone(formatBRPhone(initialValue));
			setError(validationError);
		}
	},[initialValue]);

	return (
		<div className={styles.phoneInput}>
			<label className={styles.phoneLabel} htmlFor="phone">{label}</label>
			<input
				className={styles.phoneField}
				type="tel"
				value={value}
				placeholder={placeholder || "(XX) XXXXX-XXXX"}
				pattern="\(\d{2}\) \d{4,5}-\d{4}"
				onChange={onChangeHandler}
			/>
			<span className={styles.phoneError}>{error}</span>
		</div>
	);
}