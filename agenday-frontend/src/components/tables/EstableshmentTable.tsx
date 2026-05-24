
import { FilePenLine, Trash2 } from "lucide-react";
import type { EstablishmetTableType } from "../../types/Estableshment";
import { BallName } from "../Ui/BallName";
import styles from "./styles/estableshmentTable.module.css";

export function EstablishmentTable({ data, onClick }: { data: EstablishmetTableType[]; onClick?: (index: number) => void }) {
    return (
        <div className={styles.establishmentTable}>
            <div className={styles.establishmentTableHeader}>
				<span className={styles.establishmentHeadTableCell}>Estabelecimento</span> 
				<span className={styles.establishmentHeadTableCell}>Localização</span>
				<span className={styles.establishmentHeadTableCell}>Gerente</span> 
				<span className={styles.establishmentHeadTableCell}>Equipe</span>
				<span className={styles.establishmentHeadTableCell}>Ações</span>
			</div>

			<ul className={styles.establishmentTableBody}>
				{data.map((item, index) => (
					<li className={styles.establishmentTableRow}  onClick={() => onClick?.(index)} key={index}>
						<div className={styles.establishmentName}>
							<div className={styles.establishmentIcon}>
								{ item.logo ? ( <img src={item.logo}/>) : ( <BallName name="? ?" /> )}
							</div>
							<div className={styles.establishmentInfo}>
								{item.name}
								<small>{item.address}</small>
							</div>
						</div> 
						<div className={`${styles.location} ${styles.establishmentTableCell}`}>{item.city}/{item.uf}</div>
						<div className={`${styles.manager} ${styles.establishmentTableCell}`}>{item.manager}</div> 
						<div className={`${styles.team} ${styles.establishmentTableCell}`}>{item.teamNumber}</div>

						<div className={`${styles.actions} ${styles.establishmentTableCell}`}>
							<button className={styles.actionButtonEdit} title="Editar"><FilePenLine /></button>
							<button className={styles.actionButtonDelete} title="Excluir"><Trash2 /></button>
						</div>
					</li>
				))}
			</ul>
        </div>
    );
}