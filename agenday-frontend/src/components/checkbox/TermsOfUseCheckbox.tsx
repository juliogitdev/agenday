
import styles from "./styles/termsOfUserCheckbox.module.css";

type CheckboxProps = {
	termsLink: string;
	onChange: (value: boolean) => void;
};

export function TermsOfUserCheckbox({termsLink, onChange}:CheckboxProps) {
	
	return (
		<div className={styles.termsOfUseCheckbox}> 
			<input
				type="checkbox"  
				id="terms-of-use" 
				onChange={(e) => {onChange(e.target.checked);}}
			/>
			<label className={styles.termsLabel} htmlFor="terms-of-use">  Le e concordo com os </label>
			<a href={termsLink} className={styles.termsLink}>Termos de uso</a>
		</div>
	);
}