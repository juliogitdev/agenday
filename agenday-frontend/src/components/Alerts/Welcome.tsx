
import styles from "./styles/welcome.module.css";

export function Welcome({ onFinish, isVisible }: { onFinish: (becomeProfessional: boolean) => void, isVisible: boolean }) {
	return (
		isVisible && (
		<div className={styles.welcomeCard}>
			<div className={styles.welcomeBanner}>
				<h1 className={styles.welcomeTitle}>
					SEJA BEM-VINDO AO AGENDAY!
				</h1>
				<button className={styles.closeButton} onClick={() => onFinish(false)}>✕</button>
			</div>

			<div className={styles.welcomeContent}>
				<div className={styles.contentText}>
					<p className={styles.contentTitle}> Sua conta foi criada com o perfil de  Cliente </p>
					<p className={styles.contentDescription}>
						Neste nível, você pode buscar estabelecimentos, acompanhar seus históricos e agendar serviços facilmente.
						Mas se você é dono de salão, barbearia, clínica, ou atua de forma autônoma, você pode mudar para o perfil 
						<strong> Profissional </strong> a qualquer momento para gerenciar sua equipe, estabelecimentos e faturamento.
					</p>
				</div>

				<div className={styles.welcomeActions}>
					<button type="button"  className={styles.btnClient} onClick={() => onFinish(false)}> Continuar como Cliente </button>
					<button type="button"  className={styles.btnProfessional} onClick={() => onFinish(true)}> Me tornar Profissional </button>
				</div>

				<div className={styles.welcomeFooter}>
					<label className={styles.checkboxLabel}>
						<input 
							type="checkbox"
							onChange={(e) => { localStorage.setItem('AGD_ShowAgain', String(!e.target.checked));}}
							className={styles.checkboxInput}
						/>
						<span className={styles.checkboxText}>
							NÃO MOSTRAR ESSA MENSAGEM NOVAMENTE
						</span>
					</label>
				</div>
			</div>
		</div>
		)
	);
}