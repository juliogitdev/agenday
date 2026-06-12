
import styles from "./styles/brandingCard.module.css";

export interface BrandingCardProps {
	id: string;
	name: string;
	slogan: string;
	slug: string;
	palette:String;
	imageUrl: string;
	templateId: number;
	onCustomize: (id: string) => void;
}

const PUBLIC_SCHEDULE_URL = "https://agenday.com.br";
const templateMap: Record<number, string> = {
	1: "minimalist-v1",
	2: "minimalist-v2",
	3: "minimalist-v3",
	4: "minimalist-v3-premium",
	5: "modern-v1"
};


export function BrandingCard({id,name,slogan,slug,imageUrl,templateId,palette,onCustomize}: BrandingCardProps) {
	const colors = palette.split(";").map(color => color.trim()).filter(Boolean);
	const image = import.meta.env.VITE_STORAGE_BASE_URL+/agenday-images/+imageUrl;
	const handleShare = async () => {
		const url = `${PUBLIC_SCHEDULE_URL}/${slug}`;
		try { await navigator.clipboard.writeText(url);
		} catch {
			const textarea = document.createElement("textarea");
			textarea.value = url;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
		}
	};

	return (
		<div className={styles.brandingCard}>
			<h1 className={styles.brandingHeader}>⌘<span>BRANDING ATIVO</span></h1>

			<div className={styles.brandingContent}>
				<div className={styles.profile}>
					<div className={styles.avatar}><img src={image} alt={name} /></div>
					<div className={styles.info}>
						<h3>{name}</h3>
						<small>{slogan}</small>
					</div>
				</div>

				<div className={styles.separator} />

				<div className={styles.details}>
					<div className={styles.row}>
						<span className={styles.label}>paleta:</span>
						<div className={styles.colors}>
							{colors.map((color, index) => (
								<span key={index} style={{background: color}}/>
							))}
						</div>
					</div>

					<div className={styles.row}>
						<span className={styles.label}>template:</span>
						<span className={styles.template}>
							{templateMap[templateId] ?? "template-desconhecido"}
						</span>
					</div>
				</div>

				<button type="button" className={styles.customizeButton} onClick={() => onCustomize(id)}>
					Customizar página pública
				</button>
			</div>

			<button type="button" className={styles.shareButton} onClick={handleShare}>
				COMPARTILHAR LINK DA AGENDA PÚBLICA
			</button>
		</div>
	);
}