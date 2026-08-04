
import { FilePenLine, Trash2, UserPlus } from "lucide-react";
import { BallName } from "../Ui/BallName";
import styles from "./styles/estableshmentTable.module.css";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import { SolidButton } from "../buttons/SolidButton";

export function EstablishmentTable({updateTable, onClick }: { updateTable: number; onClick?: (data: any, action: string) => void }) {
	const {api, user} = useContext(AuthContext);
	const [establishments, setEstablishments] = useState<any[]>([]);
	const image_url = import.meta.env.VITE_STORAGE_BASE_URL+/agenday-images/;
	

	useEffect(()=> {
		api.get('establishment/my-units').then(r => {
            setEstablishments(r.data)
			console.log(r.data)
            if (r.data && r.data.length > 0) { onClick?.(r.data[0], 'view');}
        })
	},[updateTable, api]);


    return (
        <div className={styles.establishmentTable}>
            <div className={styles.establishmentTableHeader}>
				<span className={styles.establishmentHeadTableCell}>Estabelecimento</span> 
				<span className={styles.establishmentHeadTableCell}>Localização</span>
				<span className={styles.establishmentHeadTableCell}>Equipe</span>
				<span className={styles.establishmentHeadTableCell}>Ações</span>
			</div>

            { establishments?.length > 0 ?   (
			<ul className={styles.establishmentTableBody}>
				{establishments.map((item,_) => (
					<li className={styles.establishmentTableRow}  onClick={() => onClick?.(item, 'view')} key={item.id}>
						<div className={styles.establishmentName}>
							<div className={styles.establishmentIcon}>
								{ item.imageUrl ? ( <img src={`${image_url}/${item.imageUrl}`}/>) : ( <BallName name={item.name} size={54} /> )}
							</div>
							<div className={styles.establishmentInfo}>
								{item.name}
								<small>
									{item.address?.street}
								</small>
							</div>
						</div> 
						<div className={`${styles.location} ${styles.establishmentTableCell}`}>{item.address?.city}/{item.address?.state}</div>
						<div className={`${styles.team} ${styles.establishmentTableCell}`}>
							<SolidButton 
								text={"Conf. Horários"} 
								isActive={true} 
								onClick={() => {onClick?.(item, 'EditTeam')}} isLoading={false}
							/>
						</div>

						<div className={`${styles.actions} ${styles.establishmentTableCell}`}>
							<button disabled={item.nameOwner !== user?.userInformations?.fullName} className={styles.actionButtonEdit} title="invite"    onClick={(e) => { e.stopPropagation(); onClick?.(item, 'invite')}}><UserPlus /></button>
							<button disabled={item.nameOwner !== user?.userInformations?.fullName} className={styles.actionButtonEdit} title="Editar"    onClick={(e) => { e.stopPropagation(); onClick?.(item, 'edit')}}><FilePenLine /></button>
							<button disabled={item.nameOwner !== user?.userInformations?.fullName} className={styles.actionButtonDelete} title="Excluir" onClick={(e) => { e.stopPropagation(); onClick?.(item, 'delete')}}><Trash2 /></button>
						</div>
					</li>
				))}
			</ul> ) : (
                <div className={styles.establishmentVoidTable}>
                    <img src="resource/icons/versao_sem_texto_v2.png" alt=""/>
                    <p>Nenhúm estabelecimento encontrado </p>
                </div>
            ) }
        </div>
    );
}
