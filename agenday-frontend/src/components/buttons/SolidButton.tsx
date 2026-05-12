
import styles from './styles/solidButton.module.css';

export function SolidButton({text, isActive, onClick, isLoading}: {text: string, isActive: boolean, onClick: () => void, isLoading: boolean}) {
	return (
		<button 
			disabled={!isActive || isLoading}
			className={ styles.solidButton } 
			onClick={onClick}> {isLoading ? "Carregando..." : text}
		</button>
	);
}