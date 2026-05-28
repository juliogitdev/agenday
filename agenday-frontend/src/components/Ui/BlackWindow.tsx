

import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import styles from './styles/blackwindow.module.css';

interface BlackWindowProps {
	children: React.ReactNode;
	isOpen: boolean;
}

export function BlackWindow({ children, isOpen }: BlackWindowProps) {
	const [shouldRender, setShouldRender] = useState(isOpen);
	const [isAnimated, setIsAnimated] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			const animationTimeout = setTimeout(() => { setIsAnimated(true);}, 10);
			return () => clearTimeout(animationTimeout);
		} else {
			setIsAnimated(false);
			const removeTimeout = setTimeout(() => {setShouldRender(false);}, 400);
			return () => clearTimeout(removeTimeout);
		}
	}, [isOpen]);

	if (!shouldRender) return null;

	return createPortal(
		<div className={`${styles.blackWindow} ${isAnimated ? styles.windowOpen : ''}`}>
			<div className={styles.blackWindowContent}>
				{children}
			</div>
		</div>,

		document.body
	);
}