
import React, { useState, useEffect } from 'react';
import { Loader, Trash2, X } from 'lucide-react';
import styles from './styles/deleteconfirmationmodal.module.css';

interface DeleteConfirmationModalProps {
	isVisible: boolean;
	isLoading: boolean;
	loadingText: string;
	onChoice: (confirmed: boolean) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({isVisible,onChoice,isLoading, loadingText}) => {
	const [captchaCode, setCaptchaCode] = useState<string>('');
  	const [userInput, setUserInput] = useState<string>('');

  	const generateAlphanumericCode = (): string => {
    	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    	let result = '';
    	for (let i = 0; i < 5; i++) {
      		const randomIndex = Math.floor(Math.random() * characters.length);
      		result += characters.charAt(randomIndex);
    	}

    	return result;
  	};

  	useEffect(() => {
    	if (isVisible) {
      		setCaptchaCode(generateAlphanumericCode());
      		setUserInput('');
    	}
  	}, [isVisible]);


  	if (!isVisible) return null;
  	const isCodeMatch = userInput.trim().toUpperCase() === captchaCode;

  	const handleCancel = () => { onChoice(false);};
  	const handleConfirm = () => {if (isCodeMatch) { onChoice(true);}};

  return (
    	<div className={styles.modalCard}>
			{ isLoading && (
				<div className={styles.deleteLoading}>
					<div className={styles.deleteLoaginContainer}>
						<Loader className={styles.deleteLoadingIcon}/>
						<p className={styles.deleteLoadingText}>{loadingText}</p> 
					</div>
				</div>
			)}

    		<div className={styles.header}>
          		<Trash2 size={24} color="var(--delete-modal-text-color-danger)" />
          		<h2 className={styles.headerTitle}>CONFIRMAR EXCLUSÃO</h2>
          		<button 
            		className={styles.closeButton} 
            		onClick={handleCancel}
            		aria-label="Fechar modal"
          		> <X size={20} /> </button>
        	</div>

        	<div className={styles.content}>
          		<h3 className={styles.titleQuestion}>Você tem certeza disso?</h3>
          		<p className={styles.description}> Esta Ação Removerá O Item Selecionado Permanentemente.</p>
          		<div className={styles.captchaContainer}>
            		{captchaCode.split('').map((char, index) => (
              			<span key={index} className={styles.captchaCharacter}> {char} </span>
            		))}
          		</div>

				<input
					type="text"
					className={styles.inputField}
					placeholder="repita o código acima"
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					maxLength={5}
					autoFocus
				/>
          		<div className={styles.actionsContainer}>
            		<button className={styles.buttonCancel} onClick={handleCancel}> Cancelar </button>
            		<button
              			className={styles.buttonDelete}
              			onClick={handleConfirm}
              			disabled={!isCodeMatch}
            		> Excluir Item </button>
          		</div>
        	</div>
        	<div className={styles.footer}>
          		<p className={styles.footerText}> Dados Vinculados A Este Item Podem Ser Afetados. </p>
        	</div>
      	</div>
  	
  );
};