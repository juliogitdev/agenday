
import styles from './styles/ballName.module.css';

export function BallName({name}: {name: string}) {
	let defaultSigle = '??';

	if (name.length == 0 || name == null) {
		defaultSigle = '??';
	}

	let sigle = name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();	
	sigle = sigle.length > 2 ? sigle.slice(0, 2) : sigle;
	sigle = sigle.length === 0 ? defaultSigle : sigle;

	return (
		<div className={styles.ballName}>
			<span className={styles.ballNameText}>{sigle}</span>
		</div>
	);
}