

import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import styles from './styles/blackwindow.module.css';

interface BlackWindowProps {
	children: React.ReactNode;
	isVisible: boolean;
}

// refatorar para Overlay
export function BlackWindow({ children, isVisible }: BlackWindowProps) {
	const [shouldRender, setShouldRender] = useState(isVisible);
	const [isAnimated, setIsAnimated] = useState(false);

	useEffect(() => {
		if (isVisible) {
			setShouldRender(true);
			const animationTimeout = setTimeout(() => { setIsAnimated(true);}, 10);
			return () => clearTimeout(animationTimeout);
		} else {
			setIsAnimated(false);
			const removeTimeout = setTimeout(() => {setShouldRender(false);}, 400);
			return () => clearTimeout(removeTimeout);
		}
	}, [isVisible]);

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