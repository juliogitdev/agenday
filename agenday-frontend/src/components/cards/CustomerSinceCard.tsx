import type { ClientEstableshimentCardType } from "../../types/Estableshment";
import { BallName } from "../Ui/BallName";
import styles from "./styles/customerSinceCard.module.css";



export function CustomerSinceCard({data}: {data: ClientEstableshimentCardType}) {
    return (
        <div className={styles.customerSinceCard}>
			<div className={styles.customerSinceCardImageContainer}>
			{ data.profilePicture ? (  <img src={data.profilePicture} alt={data.profilePicture} className={styles.customerSinceCardImage} /> ) : ( 
				<BallName name={data.profilePicture} /> 
			)}
			</div>
			<div className={styles.customerSinceCardContent}>
				<span className={styles.customerSinceCardName}>{data.name}</span>
				<span className={styles.customerSinceCardAmount}> +{data.amount} agendamentos</span>
				<span className={styles.customerSinceCardDate}> &nbsp;Cliente desde {data.dateOfFirstAppointment}</span>
			</div>
        </div>
    );
}