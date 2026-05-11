
import styles from './styles/solidButton.module.css';

export function SolidButton({text, isActive, onClick}: {text: string, isActive: boolean, onClick: () => void}) {
	return (
		<button 
			disabled={!isActive}
			className={ styles.solidButton } 
			onClick={onClick}> {text}
		</button>
	);
}