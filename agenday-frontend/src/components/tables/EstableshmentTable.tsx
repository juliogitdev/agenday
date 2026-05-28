
import { FilePenLine, Trash2 } from "lucide-react";
import { BallName } from "../Ui/BallName";
import styles from "./styles/estableshmentTable.module.css";
import { useContext, useEffect } from "react";
import { agenday_api } from "../../services/Api";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";

export function EstablishmentTable({updateTable, onClick }: { updateTable: number; onClick?: (index: string, action: string) => void }) {
	const {user} = useContext(AuthContext);
	const [establishments, setEstablishments] = useState<any[]>([]);
	const image_url = import.meta.env.VITE_STORAGE_BASE_URL+/agenday-images/;

	useEffect(()=> {
		agenday_api.get('establishment/my-units',{
			headers: {'Authorization': `Bearer ${user?.accessToken}`}
		}).then(r => setEstablishments(r.data))

	},[updateTable]);


    return (
        <div className={styles.establishmentTable}>
            <div className={styles.establishmentTableHeader}>
				<span className={styles.establishmentHeadTableCell}>Estabelecimento</span> 
				<span className={styles.establishmentHeadTableCell}>Localização</span>
				<span className={styles.establishmentHeadTableCell}>Equipe</span>
				<span className={styles.establishmentHeadTableCell}>Ações</span>
			</div>

			<ul className={styles.establishmentTableBody}>
				{establishments.map((item,_) => (
					<li className={styles.establishmentTableRow}  onClick={() => onClick?.(item.id, 'view')} key={item.id}>
						<div className={styles.establishmentName}>
							<div className={styles.establishmentIcon}>
								{ item.imageUrl ? ( <img src={`${image_url}/${item.imageUrl}`}/>) : ( <BallName name={item.name} /> )}
							</div>
							<div className={styles.establishmentInfo}>
								{item.name}
								<small>
									{item.address?.street}
								</small>
							</div>
						</div> 
						<div className={`${styles.location} ${styles.establishmentTableCell}`}>{item.address?.city}/{item.address?.state}</div>
						<div className={`${styles.team} ${styles.establishmentTableCell}`}>no-info</div>

						<div className={`${styles.actions} ${styles.establishmentTableCell}`}>
							<button className={styles.actionButtonEdit} title="Editar"    onClick={(e) => { e.stopPropagation(); onClick?.(item.id, 'edit')}}><FilePenLine /></button>
							<button className={styles.actionButtonDelete} title="Excluir" onClick={(e) => { e.stopPropagation(); onClick?.(item.id, 'delete')}}><Trash2 /></button>
						</div>
					</li>
				))}
			</ul>
        </div>
    );
}