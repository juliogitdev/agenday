

import styles from './styles/ballName.module.css';

interface BallNameProps {
	name: string;
	size?: number; 
}

export function BallName({ name, size }: BallNameProps) {
	let defaultSigle = '??';

	if (!name || name.length === 0) {
		name = defaultSigle;
	}

	let sigle = name.charAt(0).toUpperCase() + (name.length > 1 ? name.charAt(1).toUpperCase() : '');	
	sigle = sigle.length > 2 ? sigle.slice(0, 2) : sigle;
	sigle = sigle === '' ? defaultSigle : sigle;

	const customStyle = size ? { 
		width: `${size}px`, 
		height: `${size}px`,
		fontSize: `${size * 0.3}px` 
	} : {};

	return (
		<div className={styles.ballName} style={customStyle}>
			<span className={styles.ballNameText} style={size ? { fontSize: 'inherit' } : {}}>
				{sigle}
			</span>
		</div>
	);
}