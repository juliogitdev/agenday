
import { ImageUp, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./styles/uploadlogo.module.css";
import { compressImage, validateImage } from "../../utils/ImageTools";
import type { InputProps, UploadLogoValue } from "../../types/Inputs";


export function UploadLogo({ label, initialValue, onChangeField }: InputProps<UploadLogoValue>) {
	const [errors, setErrors] = useState("");
	const [isLoading, setIsLoading] = useState(false);	
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		const currentFile = initialValue.value.file;
		
		if (!currentFile) {
			setPreviewUrl(null);
			setErrors("Nenhum arquivo selecionado");
			return;
		}

		if (typeof currentFile === "string") {
			setPreviewUrl(currentFile);
			setErrors("");
			return;
		}

		if (currentFile instanceof File) {
			const objectUrl = URL.createObjectURL(currentFile);
			setPreviewUrl(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [initialValue.value.file]);

	const onSelectedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsLoading(true);
		const file = e.target.files?.[0];

		if (!file) { 
			setIsLoading(false);
			if (!initialValue.value.file) {
				setErrors("Nenhum arquivo selecionado");
				onChangeField?.({ value: { file: null }, errorMessage: "Nenhum arquivo selecionado", isValid: false });
			}
			return;
		}

		if (!file.type.startsWith("image/")) {
			setErrors("Apenas imagens são permitidas (svg, png, jpg, jpeg)");
			setIsLoading(false);
			onChangeField?.({ value: { file: null }, errorMessage: "Formato inválido", isValid: false });
			return;
		}
		
		try {
			const optimizedFile = await compressImage(file);
			const validation = await validateImage(optimizedFile);
		
			if (!validation.isValid) {
				setIsLoading(false);
				onChangeField?.({ value: { file }, errorMessage: validation.error || "Imagem inválida", isValid: false });
				setErrors(validation.error || "Imagem inválida");
				return;
			}
			
			setErrors("");
			setIsLoading(false);
			onChangeField?.({ value: { file: optimizedFile }, errorMessage: "", isValid: true });
		} catch {
			setErrors("Erro ao processar imagem");
			onChangeField?.({ value: { file }, errorMessage: "Erro ao processar imagem", isValid: false });
			setIsLoading(false);
		} 
	};

	return (
		<div className={styles.uploadLogoBox}>
			<span className={styles.uploadLogoLabel}> {label} </span>
			<div className={styles.uploadLogoContent}>
				{isLoading && (
					<div className={styles.loadingImage}>
						<Loader className={styles.loadingImageIcon}/>
					</div>
				)}
				<label htmlFor="file" className={styles.uploadLogoLabelWrapper}>
					{previewUrl ? (
						<img src={previewUrl} alt="Logo preview" className={styles.uploadLogoImage}/>
					) : (
						<ImageUp className={styles.uploadLogoIcon}/>
					)}
					<span className={styles.uploadLogoTextPrimary}>Selecionar Imagem</span>
					<span className={styles.uploadLogoTextSecondary}>Apenas Imagens svg, png, jpg e jpeg</span>
					<span className={styles.uploadLogoTextSecondary}>Máx. 5MB</span>
				</label>
				<input 
					style={{ display: "none" }} 
					type="file" 
					id="file" 
					accept="image/*"
					onChange={onSelectedFile}
				/>
				<span className={styles.uploadLogoErros}>{errors}</span>
			</div>
		</div>
	);
}