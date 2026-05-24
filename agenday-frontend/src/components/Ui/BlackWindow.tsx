
import styles from './styles/blackwindow.module.css';
import { createPortal } from "react-dom";

interface BlackWindowProps {
	children: React.ReactNode;
	isOpen: boolean;
}

export function BlackWindow({children,isOpen}: BlackWindowProps) {
	if (!isOpen) return null;

	return createPortal(
		<div className={styles.blackWindow}> {children} </div>, document.body
	);
}