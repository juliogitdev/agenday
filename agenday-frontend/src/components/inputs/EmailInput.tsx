

import styles from './styles/emailInput.module.css';
import { INPUT_ERRORS } from '../../constants/InputErros';
import { validateEmail } from '../../utils/Validations';

type EmailProps = {
	email: string;
  	onChange: (value: string, isValid: boolean) => void;
};

export function EmailInput({email, onChange}: EmailProps) {
	
	const checkEmail = (value: string) => {
    	const isValid = validateEmail(value).isValid;
    	const errorElement = document.querySelector(`.${styles.emailError}`) as HTMLElement;
		const emailField = document.querySelector(`.${styles.emailField}`) as HTMLInputElement;

    	if ( errorElement ) {
      		errorElement.style.visibility = isValid ? 'hidden' : 'visible';
			emailField.style.borderColor = isValid ? 'var(--email-input-border)' : 'var(--email-error)';
		} 
  	};

	return (
		<div className={styles.emailInput}>
			<label className={styles.emailLabel}>E-mail</label>
			<input
				className={styles.emailField}
				type="email" id="email" 
				name="email" 
				value={email} 
				onChange={(e) => {
          			const value = e.target.value;
          			onChange(value, validateEmail(value).isValid);
          			checkEmail(value);
        		}}
				placeholder="Digite seu e-mail"
			/>
			<span className={styles.emailError}>{INPUT_ERRORS.EMAIL.INVALID}</span>
		</div>
	);
}