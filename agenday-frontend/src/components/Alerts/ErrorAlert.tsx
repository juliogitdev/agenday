
import { createPortal } from "react-dom"; // 1. Importa o portal
import { CircleX } from "lucide-react";
import styles from './styles/errorAlert.module.css';

type AlertProps = {	
	isVisible?: boolean;
	title: string;
	message: string;
}

export function ErrorAlert({ isVisible = true, title, message }: AlertProps) {
	if (!isVisible) return null;
	return createPortal(
		<div role="alert" className={styles.ErrorAlert}>
			<CircleX className={styles.ErrorIcon}/>
			<p className={styles.ErrorText}>
				<span className={styles.ErrorTitle}>{title}</span>
				<span className={styles.ErrorMessage}>{message}</span>
			</p> 
		</div>,
		document.body
	);
}