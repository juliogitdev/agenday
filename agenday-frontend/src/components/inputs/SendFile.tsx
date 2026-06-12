import { useEffect, useState } from "react";
import { FileText, Loader, Upload } from "lucide-react";
import type { InputProps } from "../../types/Inputs";
import styles from "./styles/sendFile.module.css";

export interface UploadReceiptValue {
	file: File | string | null;
}

type ValidationResult = {
	isValid: boolean;
	error: string | null;
};

const validateReceipt = (file: File): ValidationResult => {
	const maxSize = 1.2 * 1024 * 1024;

	if (file.type !== "application/pdf") {
		return {
			isValid: false,
			error: "Apenas arquivos PDF são permitidos"
		};
	}

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: "O arquivo deve possuir no máximo 1.2MB"
		};
	}

	return {
		isValid: true,
		error: null
	};
};

export function SendFile({
	label,
	initialValue,
	onChangeField
}: InputProps<UploadReceiptValue>) {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [fileName, setFileName] = useState("");

	const currentFile = initialValue?.value?.file;

	useEffect(() => {
		if (!currentFile) {
			setFileName("");
			return;
		}

		if (typeof currentFile === "string") {
			setFileName("Comprovante enviado");
			return;
		}

		if (currentFile instanceof File) {
			setFileName(currentFile.name);
		}
	}, [currentFile]);

	const onSelectFile = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setLoading(true);

		const file = e.target.files?.[0];

		if (!file) {
			setLoading(false);

			onChangeField?.({
				value: {
					file: null
				},
				errorMessage: "Nenhum arquivo selecionado",
				isValid: false
			});

			setError("Nenhum arquivo selecionado");
			return;
		}

		const validation = validateReceipt(file);

		if (!validation.isValid) {
			setLoading(false);

			onChangeField?.({
				value: {
					file: null
				},
				errorMessage: validation.error,
				isValid: false
			});

			setError(validation.error || "");
			return;
		}

		setError("");
		setLoading(false);

		onChangeField?.({
			value: {
				file
			},
			errorMessage: null,
			isValid: true
		});
	};

	return (
		<div className={styles.sendFile}>
			<label className={styles.label}>
				{label}
			</label>

			<div className={styles.content}>
				{loading && (
					<div className={styles.loading}>
						<Loader
							size={18}
							className={styles.loadingIcon}
						/>
					</div>
				)}

				{typeof currentFile === "string" &&
				currentFile.trim().length > 0 ? (
					<div className={styles.linkContainer}>
						<FileText size={18} />

						<a
							href={currentFile}
							target="_blank"
							rel="noreferrer"
							className={styles.link}
						>
							Visualizar comprovante
						</a>
					</div>
				) : (
					<>
						<label
							htmlFor="receipt-file"
							className={styles.uploadArea}
						>
							<Upload size={22} />

							<span className={styles.primaryText}>
								Enviar comprovante
							</span>

							<span className={styles.secondaryText}>
								Apenas PDF
							</span>

							<span className={styles.secondaryText}>
								Máx. 1.2MB
							</span>

							{fileName && (
								<span className={styles.fileName}>
									{fileName}
								</span>
							)}
						</label>

						<input
							id="receipt-file"
							type="file"
							accept=".pdf,application/pdf"
							onChange={onSelectFile}
							style={{ display: "none" }}
						/>
					</>
				)}

				<span className={styles.error}>
					{error}
				</span>
			</div>
		</div>
	);
}