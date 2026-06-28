
import { useState, useEffect, useContext } from "react";
import styles from "./styles/linkProfessionalsOnServiceModal.module.css";
import AuthContext from "../../context/AuthContext";
import { ErrorAlert } from "../Alerts/ErrorAlert";
import { SuccessAlert } from "../Alerts/SuccessAlert";
import { AlertHook } from "../../hooks/AlertsHook";

export type LinkS2pProfessionals = {
	professionalName: string;
	professionalAvatarUrl: string;
	professionalEstablishmentId: string;
	isLinkedToService: boolean;
};

export type LinkS2PProps = {
	catalogItemId?: string;
	customPrice?: number;
	customDurationMinutes?: number;
	professionais?: Array<LinkS2pProfessionals>;
	onClose?: () => void;
	isVisible: boolean;
};

export function LinkProfessionalsOnServiceModal({ isVisible, catalogItemId, customPrice = 0, customDurationMinutes = 0, professionais = [], onClose }: LinkS2PProps) {
	if (!isVisible) return null;
	const [initialState, setInitialState] = useState<LinkS2pProfessionals[]>([]);
	const [linkedState, setLinkedState] = useState<LinkS2pProfessionals[]>([]);
	const errorAlert = AlertHook();
	const sucessAlert = AlertHook();

	const { api } = useContext(AuthContext);

	useEffect(() => {
		setInitialState(structuredClone(professionais));
		setLinkedState(structuredClone(professionais));
	}, [professionais]);

	const handleToggleProfessional = (index: number) => {
		setLinkedState(prev => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				isLinkedToService: !updated[index].isLinkedToService
			};
			return updated;
		});
	};

	const handleSave = async () => {
		try {
			const professionalsToCreate = linkedState.filter(current => {
				const original = initialState.find(p => p.professionalEstablishmentId === current.professionalEstablishmentId);
				return !original?.isLinkedToService && current.isLinkedToService;
			});

			const professionalsToDelete = linkedState.filter(current => {
				const original = initialState.find(p => p.professionalEstablishmentId === current.professionalEstablishmentId);
				return original?.isLinkedToService && !current.isLinkedToService;
			});

			if (professionalsToCreate.length === 0 && professionalsToDelete.length === 0) {
				onClose?.();
				return;
			}

			await Promise.all(
				professionalsToCreate.map(professional =>
					api.post("professional-catalog-items", {
						professionalEstablishmentId: professional.professionalEstablishmentId,
						catalogItemId,
						customPrice,
						customDurationMinutes
					})
				)
			);

			/*
			await Promise.all(
				professionalsToDelete.map(professional =>
					api.delete("professional-catalog-items", {
						data: {
							professionalEstablishmentId: professional.professionalEstablishmentId,
							catalogItemId
						}
					})
				)
			);
			*/

			sucessAlert.show("Sucesso", "Os vínculos dos profissionais foram atualizados com sucesso.", 4000);
			onClose?.();
		} catch (error) {
			errorAlert.show("Erro", "Não foi possível atualizar os vínculos dos profissionais.", 4000);
		}
	};

	const getInitials = (name: string) => { return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(); };

	return (
		<div className={styles.card} onClick={(e) => e.stopPropagation()}>
			<header className={styles.cardHeader}>
				<div className={styles.cardHeaderL}>
					<h1 className={styles.cardHeaderTitle}>Vincule profissionais neste serviço</h1>
					<p className={styles.cardHeaderStatus}>
						<span className={styles.cardHeaderPrice}> Preço: {customPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
						<span className={styles.cardHeaderTimer}> duração: {customDurationMinutes}m </span>
					</p>
				</div>
				<button className={styles.cardHeaderCLoseBnt} onClick={onClose} aria-label="Fechar modal"> ✕</button>
			</header>

			<p className={styles.cardLabel}>Selecione quem pode prestar este serviço:</p>

			<ul className={styles.cardTable}>
				<li className={styles.cardTableHead}>
					<span className={styles.cardTableHeadCollum}>Ativo</span>
					<span className={styles.cardTableHeadCollum}>Profissional</span>
				</li>

				{linkedState.length === 0 ? (
					<li className={styles.cardTableRow} style={{ display: "block", textAlign: "center", color: "var(--text-secondary)" }}>
						Nenhum profissional cadastrado.
					</li>
				) : (
					linkedState.map((professional, index) => (
						<li className={styles.cardTableRow} key={index}>
							<input
								className={styles.cardTableRowCollumA}
								type="checkbox"
								checked={professional.isLinkedToService}
								onChange={() => handleToggleProfessional(index)}
							/>
							<div className={styles.cardTableRowCollumB}>
								{professional.professionalAvatarUrl ? (
									<img
										src={professional.professionalAvatarUrl}
										alt={`Avatar de ${professional.professionalName}`}
									/>
								) : (
									<div className={styles.avatarFallback}>
										{getInitials(professional.professionalName)}
									</div>
								)}
								<p>{professional.professionalName}</p>
							</div>
						</li>
					))
				)}
			</ul>
			<div className={styles.buttonsContainer}>
				<button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
				<button className={styles.saveButton} onClick={handleSave} > Salvar Alterações</button>
			</div>

			<ErrorAlert isVisible={errorAlert.isVisible} title={errorAlert.title} message={errorAlert.message} />
			<SuccessAlert isVisible={sucessAlert.isVisible} title={sucessAlert.title} message={sucessAlert.message} />
		</div>
	);
}