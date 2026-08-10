import { AppointmentsDetailsCard } from "../../components/cards/AppointmentsDetailsCard";
import styles from "./styles/professionalsAppoointmentsPage.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { AlertHook } from "../../hooks/AlertsHook";
import { ComboBox } from "../../components/inputs/ComboBox";
import { type EstablishmentSummary } from "../../types/Estableshment";
import { ModalHook } from "../../hooks/ModalHook";
import { BlackWindow } from "../../components/Ui/BlackWindow";
import { NotificationModal } from "../../components/Modal/NotificationModal";
import { NewAppointmentModal } from "../../components/Modal/NewAppointmentModal";
import type { AppointmentCardType } from "../../types/AppointmentTypes";
import { ClientAppointmentsList } from "../../components/tables/ClientAppointmentsList";
import { RealTimeClock } from "../../components/Ui/RealTimeClock";
import { useQuery } from "@tanstack/react-query";
import { BallName } from "../../components/Ui/BallName";

export function ProfessionalsAppoointmentsPage() {
	const { api, user } = useContext(AuthContext);
	const errorAlert = AlertHook();
	const blackWidow = ModalHook();
	const newAppoint = ModalHook();
	const notifications = ModalHook();
	const image_url = import.meta.env.VITE_STORAGE_BASE_URL + "/agenday-images/";

	const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardType | null>(null);
	const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
	const [selectedEstablishment, setSelectedEstablishment] = useState<EstablishmentSummary | null>(null);
	const NO_ESTABLISHMENTS = [{ label: "Nenhum estabelecimento encontrado", value: "" }];

	const [comboBoxState, setComboBoxState] = useState({
		value: {
			selectedValue: "",
			selectedLabel: "",
			options: NO_ESTABLISHMENTS,
		},
		errorMessage: null,
		isValid: true,
	});

	useEffect(() => {
		let active: boolean = true;
		const getEstablishements = async (): Promise<EstablishmentSummary[] | null> => {
			try {
				const r = await api.get("establishment/my-units/summary");
				if (r.status === 200 && active) {
					setEstablishments(r.data);
					return r.data;
				}
				return null;
			} catch {
				errorAlert.show("Erro", "Não foi possível atualizar a lista de estabelecimentos", 5000);
				return null;
			}
		};

		const updateComboBox = async () => {
			const data = await getEstablishements();
			if (!data || !active || data.length === 0) return;

			const newOptions = data.map((d: any) => ({ label: d.name, value: d.id }));
			const finalOptions = newOptions.length > 0 ? newOptions : NO_ESTABLISHMENTS;
			setSelectedEstablishment(data[0]);

			setComboBoxState((prevState) => ({
				...prevState,
				value: {
					selectedLabel: data[0].name,
					selectedValue: data[0].id,
					options: finalOptions,
				},
			}));
		};

		updateComboBox();
		return () => {
			active = false;
		};
	}, [api]);

	const {
		data: appointments = [],
		isLoading: loadingAppointments,
		error: appointmentsError,
	} = useQuery({
		queryKey: ["professional-schedule", selectedEstablishment?.id, user?.userInformations?.uuid],
		queryFn: async () => {
			if (!selectedEstablishment || !user?.userInformations) return [];
			const responseEst = await api.get(
				`professional-establishments/establishment/${selectedEstablishment.id}`
			);
			const links = responseEst.data;
			const myLink = links.find(
				(link: any) => link.professionalName === user.userInformations?.fullName
			);
			if (!myLink) return [];

			const start = new Date();
			start.setHours(0, 0, 0, 0);
			const end = new Date();
			end.setDate(end.getDate() + 7);
			end.setHours(23, 59, 59, 999);

			const responseAppointments = await api.get(`appointments/professional/${myLink.id}`, {
				params: { start: start.toISOString(), end: end.toISOString() },
			});
			return responseAppointments.data;
		},

		enabled: !!selectedEstablishment && !!user?.userInformations,
		refetchInterval: 10000,
		refetchIntervalInBackground: true,
	});

	return (
		<section className={styles.appointmentsPage}>
			<div className={styles.servicesHeader}>
				<div className={styles.servicesHeaderTop}>
					<div className={styles.establishmentInfoContainer}>
						{selectedEstablishment?.imageUrl ? (
							<img
								src={`${image_url}/${selectedEstablishment.imageUrl}`}
								alt={selectedEstablishment.name || "Estabelecimento"}
								className={styles.servicesHeaderImg}
							/>
						) : (
							<BallName name="ND" size={54} />
						)}

						<div className={styles.establishmentText}>
							<h1 className={styles.serviceHeaderTitle}>
								{selectedEstablishment?.name || "Sem estabelecimentos"}
							</h1>

							<span className={styles.serviceHeaderSubtitle}>
								{selectedEstablishment?.slogan || "Selecione um estabelecimento"}
							</span>
						</div>
					</div>

					<div className={styles.servicesHeaderRight}>
						<RealTimeClock />
					</div>
				</div>

				<div className={styles.servicesHeaderBottom}>
					<ComboBox
						label=""
						initialValue={comboBoxState}
						onChangeField={(d) => {
							const found = establishments.find(
								(est) => est.id === d.value.selectedValue
							);
							setSelectedEstablishment(found || null);
						}}
					/>
				</div>
			</div>

			<div className={styles.appointmentsContent}>
				<ClientAppointmentsList
					isProfessional={true}
					appointmentList={appointments}
					onChose={(e: AppointmentCardType) => {
						setSelectedAppointment(e);
					}}
					updateList={false}
				/>

				<div className={styles.appointmentDetails}>
					<AppointmentsDetailsCard
						appointmentId={selectedAppointment?.id || "h6asdasd"}
						serviceName={selectedAppointment?.catalogItemName || "Corte de Cabelo"}
						serviceCreatedAt={
							selectedAppointment?.startTime
								? new Date(selectedAppointment.startTime).toLocaleDateString("pt-BR")
								: "20/10/2023"
						}
						serviceDeadline={
							selectedAppointment?.endTime
								? new Date(selectedAppointment.endTime).toLocaleTimeString("pt-BR", {
										hour: "2-digit",
										minute: "2-digit",
								  })
								: "15:30"
						}
						profissinalName={selectedAppointment?.professionalName || "João Silva"}
						observations={selectedAppointment?.notes || "Sem observações adicionais."}
						disabled={false}
						clientAppointmentsCaount={3}
						firstClientAppointmentDate="20/10/2023"
						loading={false}
						clienteName={selectedAppointment?.customerName || "Cliente"}
						clientPicture="https://randomuser.me/api/portraits/women/44.jpg"
						showCloseBtn={false}
						onClose={() => console.log("Fechar detalhes do agendamento")}
					/>
				</div>
			</div>

			<BlackWindow isVisible={blackWidow.visible}>
				<NotificationModal
					isVisible={notifications.visible}
					onClose={() => {
						notifications.hidden();
						blackWidow.hidden();
					}}
				/>
				<NewAppointmentModal
					establishmentId={selectedEstablishment?.id}
					isVisible={newAppoint.visible}
					onClose={() => {
						newAppoint.hidden();
						blackWidow.hidden();
					}}
				/>
			</BlackWindow>
		</section>
	);
}