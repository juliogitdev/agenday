
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { BestServicesEstablishmentCardType } from "../../types/Estableshment";

type BestServicesChartProps = {
	services: BestServicesEstablishmentCardType[];
};

export function BestServicesChart({ services }: BestServicesChartProps) {
	const data = services.map((service) => ({
		name: service.name,
		average: service.monthlyAverageOfAchievements,
		amount: service.amount,
	}));

	return (
		<div style={{ width: "100%", height: "210px" }}>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(value) => value.slice(0,2)}/>
					<YAxis domain={[0, "dataMax"]} tick={{ fontSize: 10 }}/>
					<Tooltip
						formatter={(value) => [ `${value} atendimentos/mês`,]}
						contentStyle={{
							backgroundColor: "#fff",
							border: "1px solid #e0e0e0",
							borderRadius: "4px",
							padding: "8px 12px",
							boxShadow: "0 2px 4px rgba(0,0,0,.1)"
						}}
						labelStyle={{
							fontFamily: "Poppins, sans-serif",
							fontSize: ".7rem",
							fontWeight: 600,
						}}
						itemStyle={{
							fontFamily: "Poppins, sans-serif",
							fontSize: ".7rem",
						}}
						/>
					
					<Area type="monotone" dataKey="average" strokeWidth={3} fillOpacity={0.3}/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}