
import { Eye, EyeOff } from "lucide-react";
import styles from './styles/passwordInput.module.css';
import { useState } from "react";

type PasswordProps = {
	password: string;
	showRecovery?: boolean;
  	onChange: (value: string, isValid: boolean) => void;
};

export function PasswordInput({password, onChange, showRecovery=true}: PasswordProps) {
	const [eyeIsOpen, setEyeIsOpen] = useState(false);
	
	const showpassword = () => { 
			setEyeIsOpen(prev => !prev);
	}

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
						onChange(e.target.value, e.target.value.length >= 6);
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