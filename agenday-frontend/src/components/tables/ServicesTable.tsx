
import styles from "./styles/servicesTable.module.css"
import { FilePenLine,WandSparkles, Trash2 } from "lucide-react";

export type TableServicesData = {
    name: string;
    duration: number;
    price: number;
    description: string;
    asPromotion: string | null;
    serviceId: string;
}

export type TableServiceProps = {
    isLoading: boolean;
    serviceList:   Array<TableServicesData>;
    onCLick: (d:TableClickCallback) => void;
} 

export type Action = 'edit' | 'delete' | 'select' | 'promotion';
export type TableClickCallback = {
    action: Action;
    serviceId: string | null;
}

export function ServicesTable({serviceList, isLoading, onCLick: callBack }:TableServiceProps)  {
    const clickHandler = (a:Action, id:string | null ) => {callBack({action: a, serviceId: id})}

    return (
        <div className={styles.serviceTable}>
            {isLoading &&(
                <div className={styles.serviceTableLoading}></div>
            )}
            <header className={styles.serviceTableHeader}>
                <span className={styles.serviceTableHeadCollumn}>SERVIÇO</span>
                <span className={styles.serviceTableHeadCollumn}>AÇÕES</span>
            </header>
            {serviceList?.length > 0 ? (
            <ul className={styles.serviceTableBody}>
            { serviceList.map((service,_) => ( 
                <li className={styles.serviceTableRow} key={service.serviceId}>
                    <div className={styles.serviceTableRowCollumn}>
                        <span className={styles.serviceTableRowCollumnTitle}> 
                            <span className={styles.serviceTitle}>{service.name}</span>
                            <span className={styles.serviceSubtitle}>{service.description}</span>
                        </span>
                        <span className={styles.serviceTableRowCollumnInfoContainer}> 
                            <span className={styles.serviceTableRowCollumnPrice}> R$ {service.price } </span>
                            <div className={styles.serviceTableRowCollumnTimePromv}>
                                <span className={styles.serviceTableRowCollumnTime}> ({service.duration} min) </span>
                                <span className={styles.serviceTableRowCollumnProm}> 
                                    { (service.asPromotion != null ) ? `${service.asPromotion}+% of` : ''} 
                                </span>
                            </div>
                        </span>
                    </div> 

                    <div className={styles.serviceTableRowCollumnActions}>
                        <button onClick={()=> clickHandler("promotion",service.serviceId)}> <WandSparkles color="#8347b7" /></button>
                        <button onClick={()=> clickHandler("edit",service.serviceId)}><FilePenLine color="#387abc" /></button>
                        <button onClick={()=> clickHandler("delete",service.serviceId)}><Trash2 color="#d17084"/></button>
                    </div>
                </li>
            ))}
            </ul>) : (
                 <div className={styles.serviceVoidTable}>
                    <img src="resource/icons/versao_sem_texto_v2.png" alt=""/>
                    <p>Nenhúm serviço encontrado </p>
                </div>
            )}
        </div>
    );
}


