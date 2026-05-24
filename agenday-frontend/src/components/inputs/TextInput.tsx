
import { useEffect, useState } from 'react';
import styles from './styles/nameInput.module.css';
import { valid } from '../../utils/Validations';
import type { InputProps } from '../../types/Inputs';

export function TextInput({label,placeholder,initialValue, onChangeField}: InputProps) {
	const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState<string>(initialValue || "");

	

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;
		const validationError = valid.textField(nextValue);
		setError(validationError);
		setValue(nextValue);
		onChangeField?.({ 
			value: nextValue, 
			errorMessage: validationError, 
			isValid: validationError === null 
		});
	};

	useEffect(()=>{
		if( initialValue && initialValue.length > 0) {
			setValue(initialValue);
			const validationError = valid.textField(initialValue);
			setError(validationError);
		}
	},[initialValue]);

	return (
		<div className={styles.nameInput}>
			<label htmlFor="name" className={styles.nameLabel}>{label}</label>
			<input
				className={styles.nameField}
				type="text"
				id="name"
				name="name"
				value={value}
				onChange={onChangeHandler}
				placeholder={placeholder}
			/>
			<span className={styles.nameError}>{error}</span>
		</div>
	);
}