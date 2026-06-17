
import { CheckCheck } from "lucide-react";
import styles from './styles/successAlert.module.css';

type AlertProps = {	
	isVisible?:boolean;
	title: string;
	message: string;
}

export function SuccessAlert({ title, message, isVisible = true }: AlertProps) {
	return isVisible ? (
		<div role="alert" className={styles.SuccessAlert}>
			<CheckCheck className={styles.SuccessIcon}/>
			<p className={styles.SuccessText}>
				<span className={styles.SuccessTitle}>{title}</span>
				<span className={styles.ErrorMessage}>{message}</span>
			</p> 
		</div>
	) : null;
}