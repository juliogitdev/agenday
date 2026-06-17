
import styles from "./styles/plancard.module.css"

type ButtonType = "solid" | "outline";

export type PlanData = {
	planId?: string;
	icon?: React.ReactNode | null;
	planTitle: string;
	planPrice: number;
	planBeneficts: string[];
	buttonType: ButtonType;
	isRecommended?: boolean;
	width?: string;
	height?: string;
};

type PlanCardProps = PlanData & { onClick: (plan: PlanData) => void;};

export default function PlanCard({
	planId,
	icon = null,
	planTitle,
	planPrice,
	planBeneficts,
	buttonType,
	isRecommended = false,
	width = "300px",
	height = "420px",
	onClick
}: PlanCardProps) {

	const planData: PlanData = {
		planId,
		icon, planTitle, planPrice,
		planBeneficts, buttonType,
		isRecommended,
		width, height
	};

	return (
		<div className={`${styles.card} ${isRecommended ? styles.recommended : ""}`} style={{ width, height }}>
			{isRecommended && (
				<div className={styles.badge}> Recomendado </div>
			)}

			<div className={styles.content}>
				{icon && <div className={styles.icon}> {icon} </div>}
				<span className={styles.planTitle}> {planTitle} </span>
				<h2 className={styles.planPrice}> R$ {planPrice.toFixed(2).replace(".", ",")} </h2>
				
				<div className={styles.benefictsContainer}>
					{planBeneficts.map((benefict, index) => (
						<div key={index} className={styles.benefict} >
							<span className={styles.check}> ✓ </span>
							<span> {benefict} </span>
						</div>
					))}
				</div>
				
				<button
					className={ buttonType === "solid" ? styles.solidButton : styles.outlineButton}
					onClick={() => onClick(planData)}>
					{ buttonType === "solid" ? `Assinar ${planTitle}` : "Começar agora"}
				</button>
			</div>
		</div>
	);
}