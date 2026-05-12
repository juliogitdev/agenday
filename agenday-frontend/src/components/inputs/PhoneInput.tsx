
import React from 'react';
import styles from './styles/phoneInput.module.css';
import { validatePhone } from '../../utils/Validations';

type phoneInputProps = {
	phone: string;
	onChange: (newPhone: string, isValid: boolean) => void;
}

export function PhoneInput({phone, onChange}: phoneInputProps) {
	const [error, setError] = React.useState<string>("");

	const checkPhoneError = (value: string) => {
		const validatation = validatePhone(value);
		const phoneField = document.getElementById("phone") as HTMLInputElement;
		if (phoneField) 
			phoneField.style.borderColor = validatation.isValid ? "var(--name-input-border)" : "var(--name-error)";
		
		setError(validatation.error || "");
	};

	return (
		<div className={styles.phoneInput}>
			<label className={styles.phoneLabel} htmlFor="phone">Whatsapp / Telegram </label>
			<input
				className={styles.phoneField}
				type="tel"
				id="phone"
				name="phone"
				value={phone}
				placeholder="(XX) XXXXX-XXXX"
				pattern="\(\d{2}\) \d{4,5}-\d{4}"
				onChange={(e) => {
					const value = e.target.value;
					checkPhoneError(value);
          			onChange(value, validatePhone(value).isValid);
        		}}
			/>
			<span className={styles.phoneError}>{error}</span>
		</div>
	);
}