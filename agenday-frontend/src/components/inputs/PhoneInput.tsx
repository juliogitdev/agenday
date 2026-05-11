
import React from 'react';
import styles from './styles/phoneInput.module.css';

type phoneInputProps = {
	phone: string;
	onChange: (newPhone: string) => void;
}

export function PhoneInput({phone, onChange}: phoneInputProps) {
	const [error, setError] = React.useState<string>("");
	const checkPhoneError = (value: string) => {
		const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
		if (value.trim() === "") {
			setError("O telefone não pode ser vazio.");
			onChange("");
		} else if (!phoneRegex.test(value)) {
			setError("formato inválido (XX) XXXXX-XXXX.");
			onChange("");
		} else { setError("");}
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
          			onChange(value);
        		}}
			/>
			<span className={styles.phoneError}>{error}</span>
		</div>
	);
}