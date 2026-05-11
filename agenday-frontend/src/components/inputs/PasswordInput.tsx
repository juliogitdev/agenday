
import { Eye, EyeOff } from "lucide-react";
import styles from './styles/passwordInput.module.css';
import { useState } from "react";

type PasswordProps = {
	password: string;
	showRecovery?: boolean;
  	onChange: (value: string) => void;
};

export function PasswordInput({password, onChange, showRecovery=true}: PasswordProps) {
	const [eyeIsOpen, setEyeIsOpen] = useState(false);

	const showpassword = () => { setEyeIsOpen(prev => !prev);}

	const checkPassword = (value: string) => {
		const isValid = value.length >= 6;	
		const errorElement = document.querySelector(`.password-error`) as HTMLElement;
		const passwordField = document.querySelector(`.password-field`) as HTMLInputElement;

		if ( errorElement ) {
			errorElement.style.display = isValid ? 'none' : 'block';
			passwordField.style.borderColor = isValid ? 'var(--password-input-border)' : 'var(--password-error)';
		}
	};

	return (
		<div className={styles.passwordInput}>
			<label className={styles.passwordLabel}>Senha</label>
			<div className={styles.passwordFieldContainer}>
				<input
					className={styles.passwordField}
					type={eyeIsOpen ? "text" : "password"} id="password" 
					name="password" 
					value={password} 
					onChange={(e) => {
						onChange(e.target.value);
						checkPassword(e.target.value);
					}}
					placeholder="Digite sua senha"
				/>
				{ eyeIsOpen 
						? <EyeOff className={styles.passwordToggle} size={20} onClick={showpassword}/> 
						: <Eye className={styles.passwordToggle} size={20} onClick={showpassword}/> }
			
			</div>
			{showRecovery && (
				<button className={styles.recoverPassword} type="button"> Esqueceu a Senha?</button>
			)}
		</div>
	);
}