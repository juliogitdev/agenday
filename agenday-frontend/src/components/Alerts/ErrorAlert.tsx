
import { CircleX } from "lucide-react";
import styles from './styles/errorAlert.module.css';

type AlertProps = {	
	isVisible?: boolean;
	title: string;
	message: string;
}

export function ErrorAlert({ isVisible = true, title, message }: AlertProps) {
	return isVisible ? (
		<div role="alert" className={styles.ErrorAlert}>
			<CircleX className={styles.ErrorIcon}/>
			<p className={styles.ErrorText}>
				<span className={styles.ErrorTitle}>{title}</span>
				<span className={styles.ErrorMessage}>{message}</span>
			</p> 
		</div>
	) : null;
}