
import styles from './styles/solidButton.module.css';
import { Loader } from 'lucide-react';

export function SolidButton({text, isActive, onClick, isLoading}: {text: string, isActive: boolean, onClick: () => void, isLoading: boolean}) {
	return (
		<button 
			disabled={!isActive || isLoading}
			className={ styles.solidButton } 
			onClick={onClick}> {isLoading ? <Loader size={25} className={styles.solidButtonIcon} /> : text}
		</button>
	);
}
