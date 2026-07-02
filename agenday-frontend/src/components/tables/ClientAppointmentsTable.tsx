
import { useContext, useEffect, useState } from "react";
import styles from "./styles/clientAppointmentsTable.module.css"
import AuthContext from "../../context/AuthContext";


type appointments = {
	id: string,
    customerId: string,
    customerName: string,
    professionalEstablishmentId: string,
    professionalName: string,
    catalogItemName: string,
    startTime: string,
    endTime: string,
    status: string,
    notes: string,
}


export function ClientAppointmentsTable() {
	const status: string = "FINISHED";
	const [appointments, setAppointments] = useState<appointments[]>([]);
	const {api} = useContext(AuthContext);

	useEffect(()=> {
		let active:boolean = true;
		const getAppointments = async ()=> {
			const r = await api.get('auth/me');
			if (r.status == 200 ) {
				const appointmentsResponse = await api.get("/api/v1/appointments/my-appointments");
				if (appointmentsResponse.status == 200) {
					setAppointments(appointmentsResponse.data);
				}
			}
		}
		getAppointments();
		return ()=>{active=false}
	},[api]);


	return appointments.length > 0 ? (
  		<div className={styles.table}>
			<ul className={styles.tableHeader}>
				<li className={styles.tableHeaderCollumn}>Serviço/Local</li>
				<li className={styles.tableHeaderCollumn}>Data e Hora</li>
				<li className={styles.tableHeaderCollumn}>Status</li>
				<li className={styles.tableHeaderCollumn}>Ações</li>
			</ul>

			<ul className={styles.tableData}>
				{appointments.map((appointment, index) => (
					<li key={appointment.id ?? index} className={styles.tableDataRow}>
						<span className={styles.tableDataCollumn}>
							<span className={styles.tableDataServiceTitle}>Titulo do serviço</span>
							<span className={styles.tableDataProfessional}>Nome do Profissional</span>
						</span>

					<span className={styles.tableDataCollumn}> 13 abr de 2026 as 18:45 am</span>
					<span className={styles.tableDataCollumn}>
						{status === "APROVED" && (<span className={styles.tableDataSttsAccept}>{status}</span>)}
						{status === "RECUSED" && (<span className={styles.tableDataSttsRecused}>{status}</span>)}
						{status === "FINISHED" && (<span className={styles.tableDataSttsFinished}>{status}</span>)}
					</span>

					<span className={styles.tableDataCollumn}>
						<button className={styles.tableDataCancelBnt}>cancelar</button>
						<button className={styles.tableDataFeedbkBnt}>avaliar</button>
					</span>
				</li>
				))}
			</ul>
  		</div>
	) : (
  		<div className={styles.appointmentsVoidTable}>
    		<img src="resource/icons/versao_sem_texto_v2.png" alt="" />
    		<p>Você ainda não tem agendamentos</p>
  		</div>
	);
}