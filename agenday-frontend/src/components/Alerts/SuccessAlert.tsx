
import { CheckCheck } from "lucide-react";
import styles from './styles/successAlert.module.css';

type AlertProps = {	
	title: string;
	message: string;
}

export function SuccessAlert({ title, message }: AlertProps) {
	return (
		<div role="alert" className={styles.SuccessAlert}>
			<CheckCheck className={styles.SuccessIcon}/>
			<p className={styles.SuccessText}>
				<span className={styles.SuccessTitle}>{title}</span>
				<span className={styles.ErrorMessage}>{message}</span>
			</p> 
		</div>
	);
}