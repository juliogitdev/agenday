
import { Eye, EyeOff } from "lucide-react";
import styles from './styles/passwordInput.module.css';
import { useState } from "react";
import type { InputProps } from '../../types/Inputs';
import { valid } from "../../utils/Validations";



export function PasswordInput({label, placeholder, showRecovery, onChangeField}: InputProps) {
	const [eyeIsOpen, setEyeIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState("");

	const showpassword = () => { setEyeIsOpen(prev => !prev);}
    
	const onChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;
		const validationError = valid.password(nextValue);
		setError(validationError);
		setValue(nextValue);

		onChangeField({
			value: nextValue,
			errorMessage: validationError,
			isValid: validationError === null
		});
    }
	
	return (
		<div className={styles.passwordInput}>
			<label className={styles.passwordLabel}>{label || 'Senha'}</label>
			<div className={styles.passwordFieldContainer}>
				<input
					className={styles.passwordField}
					type={eyeIsOpen ? "text" : "password"} id="password" 
					name="password" 
					value={value} 
					onChange={onChangeHanlder}
					placeholder={placeholder || "Digite sua senha"}
				/>
				{ eyeIsOpen 
					? <EyeOff className={styles.passwordToggle} size={20} onClick={showpassword}/> 
					: <Eye className={styles.passwordToggle} size={20} onClick={showpassword}/> }
			
			</div>
			<div className={styles.passwordError}> {error && <span>{error}</span>} </div>
			{showRecovery && (
				<button className={styles.recoverPassword} type="button"> Esqueceu a Senha?</button>
			)}
		</div>
	);
}