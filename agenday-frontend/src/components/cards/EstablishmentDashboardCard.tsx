

import type { EstablishmenteDashboardCardType } from "../../types/Estableshment";
import { BestServicesChart } from "../graphics/BestServicesChart";
import { BrandingCard } from "./BrandingCard";
import { CustomerSinceCard } from "./CustomerSinceCard";
import style from "./styles/establishmentDashboardCard.module.css";

export function EstablishmentDashboardCard({ data }: { data: EstablishmenteDashboardCardType | null }) {
    return data ? (
        <section className={style.establishmentDashboardCard}>
            <h1 className={style.establishmentDashboardCardTitle}>Informações da unidade</h1>
			
			<div className={style.establishmentDashboardCardInfo}>
				<div className={style.establishmentDashboardCardInfoItem}>
					<span className={style.establishmentDashboardCardInfoItemLabel}>receita mensal</span>
					<span className={style.establishmentDashboardCardInfoItemValue}> R$ {data.mensalAmount}</span>
				</div>	
				<div className={style.establishmentDashboardCardInfoItem}>
					<span className={style.establishmentDashboardCardInfoItemLabel}>serviços por semana</span>
					<span className={style.establishmentDashboardCardInfoItemValue}>{data.servicesPerWeek}</span>
				</div>
			</div>
			

			<h2 className={style.establishmentDashboardCardTitle}>to 4 clientes</h2>
			<ul className={style.establishmentDashboardCardTopClients}>
				<CustomerSinceCard data={data.topClientes[0]} />
				<CustomerSinceCard data={data.topClientes[1]} />
				<CustomerSinceCard data={data.topClientes[2]} />
				<CustomerSinceCard data={data.topClientes[3]} />
			</ul>
	
			<h2 className={style.establishmentDashboardCardTitle}>Serviços mais rentáveis (unidade selecionada)</h2>
			<div className={style.bestServices}>
				<BestServicesChart services={data.bestServices} />
			</div>
			<BrandingCard
				id={data.id}
				palette={data.palette}
				name={data.name}
				slogan={data.slogan}
				slug={data.slug}
				imageUrl={data.logo}
				templateId={data.template}
				onCustomize={data.onCustomize}
			/>
        </section>
    ) : null;
}