import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	PieChart as RePieChart,
	Pie,
	Cell,
	Tooltip,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";
import {
	DollarSign,
	Calendar,
	TrendingUp,
	UserCheck,
	Clock,
	Sparkles,
	RefreshCw,
	AlertCircle,
	BarChart3,
	PieChart as PieChartIcon,
	Users,
	Scissors,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import { ComboBox } from "../components/inputs/ComboBox";
import { RealTimeClock } from "../components/Ui/RealTimeClock";
import { BallName } from "../components/Ui/BallName";
import { getDashboardData } from "../services/DashboardService";
import type { EstablishmentSummary } from "../types/Estableshment";
import type { DashboardPeriod } from "../types/DashboardTypes";
import styles from "./styles/dashboard.module.css";

const NO_ESTABLISHMENTS = [{ label: "Todos os estabelecimentos", value: "all" }];

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		maximumFractionDigits: 2,
	}).format(value);
};

export function Dashboard() {
	const { api } = useContext(AuthContext);
	const [period, setPeriod] = useState<DashboardPeriod>("30d");
	const [chartMode, setChartMode] = useState<"attendances" | "revenue">("attendances");
	const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
	const [selectedEstablishment, setSelectedEstablishment] = useState<EstablishmentSummary | null>(null);

	const [comboBoxState, setComboBoxState] = useState({
		value: {
			selectedValue: "all",
			selectedLabel: "Todos os estabelecimentos",
			options: NO_ESTABLISHMENTS,
		},
		errorMessage: null,
		isValid: true,
	});

	useEffect(() => {
		let active = true;
		const loadEstablishments = async () => {
			try {
				const response = await api.get("establishment/my-units/summary");
				if (response.status === 200 && active && Array.isArray(response.data) && response.data.length > 0) {
					setEstablishments(response.data);
					setSelectedEstablishment(response.data[0]);

					const options = [
						...response.data.map((item: EstablishmentSummary) => ({
							label: item.name,
							value: item.id,
						})),
					];

					setComboBoxState({
						value: {
							selectedLabel: response.data[0].name,
							selectedValue: response.data[0].id,
							options,
						},
						errorMessage: null,
						isValid: true,
					});
				}
			} catch {
				// Fallback to default state if establishments API fails or isn't available
			}
		};

		loadEstablishments();
		return () => {
			active = false;
		};
	}, [api]);

	const {
		data,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: ["dashboard-analytics", selectedEstablishment?.id, period],
		queryFn: () => getDashboardData(api, selectedEstablishment?.id, period),
		staleTime: 60000,
	});

	return (
		<main className={styles.dashboardPage}>
			{/* HEADER SECTION */}
			<section className={styles.headerSection}>
				<div className={styles.headerTopRow}>
					<div className={styles.headerTitleGroup}>
						<h1>
							<BarChart3 className={styles.headerTitleIcon} size={28} />
							Dashboard Administrativo
						</h1>
						<p>Visão consolidada do faturamento, atendimentos e inteligência do estabelecimento.</p>
					</div>

					<div className={styles.headerActions}>
						<RealTimeClock />
						<button
							className={styles.refreshButton}
							onClick={() => refetch()}
							title="Atualizar dados do dashboard"
							disabled={isFetching}
						>
							<RefreshCw size={16} className={isFetching ? styles.spinningIcon : ""} />
							{isFetching ? "Atualizando..." : "Atualizar"}
						</button>
					</div>
				</div>

				<div className={styles.headerBottomRow}>
					<div className={styles.establishmentSelectorWrapper}>
						<ComboBox
							label=""
							initialValue={comboBoxState}
							onChangeField={(selected) => {
								const found = establishments.find(
									(est) => est.id === selected.value.selectedValue
								);
								setSelectedEstablishment(found || null);
							}}
						/>
					</div>

					<div className={styles.periodFilterGroup}>
						{(["7d", "30d", "90d", "year"] as DashboardPeriod[]).map((p) => {
							const labels: Record<DashboardPeriod, string> = {
								"7d": "7 Dias",
								"30d": "30 Dias",
								"90d": "90 Dias",
								year: "Este Ano",
							};
							return (
								<button
									key={p}
									className={`${styles.periodButton} ${
										period === p ? styles.periodButtonActive : ""
									}`}
									onClick={() => setPeriod(p)}
								>
									{labels[p]}
								</button>
							);
						})}
					</div>
				</div>
			</section>

			{/* LOADING SKELETON STATE */}
			{isLoading ? (
				<>
					<section className={styles.summaryGrid}>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className={`${styles.summaryCard} ${styles.skeletonCard} ${styles.skeleton}`} />
						))}
					</section>
					<section className={styles.chartsRow}>
						<div className={`${styles.chartCard} ${styles.skeletonChart} ${styles.skeleton}`} />
						<div className={`${styles.chartCard} ${styles.skeletonChart} ${styles.skeleton}`} />
					</section>
				</>
			) : isError || !data ? (
				/* ERROR STATE */
				<section className={styles.errorCard}>
					<div className={styles.errorIcon}>
						<AlertCircle size={28} />
					</div>
					<h2 className={styles.errorTitle}>Não foi possível carregar os dados do dashboard</h2>
					<p className={styles.errorMessage}>
						Ocorreu uma falha ao consultar as estatísticas. Verifique sua conexão e tente novamente.
					</p>
					<button className={styles.retryButton} onClick={() => refetch()}>
						<RefreshCw size={16} />
						Tentar Novamente
					</button>
				</section>
			) : (
				/* SUCCESS DASHBOARD CONTENT */
				<>
					{/* KPI CARDS GRID */}
					<section className={styles.summaryGrid}>
						{/* Card 1: Faturamento do Mês */}
						<div className={styles.summaryCard}>
							<div className={styles.cardTopRow}>
								<div className={styles.cardIconBox}>
									<DollarSign size={22} />
								</div>
								<span className={styles.cardTrendBadgePositive}>
									<TrendingUp size={14} />
									+{data.summary.revenueGrowth}%
								</span>
							</div>
							<div className={styles.cardMainValue}>
								<span className={styles.cardLabel}>Faturamento do Mês</span>
								<strong className={styles.cardValue}>{formatCurrency(data.summary.monthlyRevenue)}</strong>
							</div>
							<p className={styles.cardFooterText}>Hoje: {formatCurrency(data.summary.todayRevenue)}</p>
						</div>

						{/* Card 2: Total de Atendimentos */}
						<div className={styles.summaryCard}>
							<div className={styles.cardTopRow}>
								<div className={styles.cardIconBox}>
									<Calendar size={22} />
								</div>
								<span className={styles.cardTrendBadgePositive}>
									<TrendingUp size={14} />
									+{data.summary.attendancesGrowth}%
								</span>
							</div>
							<div className={styles.cardMainValue}>
								<span className={styles.cardLabel}>Atendimentos no Mês</span>
								<strong className={styles.cardValue}>{data.summary.attendancesThisMonth}</strong>
							</div>
							<p className={styles.cardFooterText}>Hoje: {data.summary.todayAppointments} agendados</p>
						</div>

						{/* Card 3: Ticket Médio */}
						<div className={styles.summaryCard}>
							<div className={styles.cardTopRow}>
								<div className={styles.cardIconBox}>
									<TrendingUp size={22} />
								</div>
								<span className={styles.cardTrendBadgePositive}>
									<TrendingUp size={14} />
									+{data.summary.averageTicketGrowth}%
								</span>
							</div>
							<div className={styles.cardMainValue}>
								<span className={styles.cardLabel}>Ticket Médio</span>
								<strong className={styles.cardValue}>{formatCurrency(data.summary.averageTicket)}</strong>
							</div>
							<p className={styles.cardFooterText}>Por atendimento concluído</p>
						</div>

						{/* Card 4: Taxa de Ocupação */}
						<div className={styles.summaryCard}>
							<div className={styles.cardTopRow}>
								<div className={styles.cardIconBox}>
									<Clock size={22} />
								</div>
								<span className={styles.cardTrendBadgePositive}>
									<TrendingUp size={14} />
									+{data.summary.occupancyGrowth}%
								</span>
							</div>
							<div className={styles.cardMainValue}>
								<span className={styles.cardLabel}>Taxa de Ocupação</span>
								<strong className={styles.cardValue}>{data.summary.occupancyPercentage}%</strong>
							</div>
							<p className={styles.cardFooterText}>
								{data.occupancy.occupiedSlots} de {data.occupancy.totalSlots} horários preenchidos
							</p>
						</div>

						{/* Card 5: Novos Clientes */}
						<div className={styles.summaryCard}>
							<div className={styles.cardTopRow}>
								<div className={styles.cardIconBox}>
									<UserCheck size={22} />
								</div>
								<span className={styles.cardTrendBadgePositive}>
									<TrendingUp size={14} />
									+{data.summary.newClientsGrowth}%
								</span>
							</div>
							<div className={styles.cardMainValue}>
								<span className={styles.cardLabel}>Novos Clientes</span>
								<strong className={styles.cardValue}>{data.summary.newClientsThisMonth}</strong>
							</div>
							<p className={styles.cardFooterText}>Cadastrados neste mês</p>
						</div>

						{/* Card 6: Uso do Plano */}
						<div className={styles.summaryCard}>
							<div className={styles.cardTopRow}>
								<div className={styles.cardIconBox}>
									<Sparkles size={22} />
								</div>
								<span className={styles.cardTrendBadgePositive}>{data.planUsage.planName}</span>
							</div>
							<div className={styles.cardMainValue}>
								<span className={styles.cardLabel}>Capacidade do Plano</span>
								<strong className={styles.cardValue}>
									{data.planUsage.used} / {data.planUsage.limit}
								</strong>
							</div>
							<div className={styles.progressBarContainer} style={{ marginTop: "6px" }}>
								<div
									className={styles.progressBarFill}
									style={{ width: `${data.planUsage.percentage}%` }}
								/>
							</div>
						</div>
					</section>

					{/* CHARTS ROW */}
					<section className={styles.chartsRow}>
						{/* Chart 1: Evolução de Atendimentos & Faturamento */}
						<div className={styles.chartCard}>
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderTitle}>
									<BarChart3 size={20} color="#135184" />
									<div>
										<h2>Evolução no Período</h2>
										<span className={styles.cardHeaderSub}>
											Acompanhamento diário de volume de agendamentos e faturamento
										</span>
									</div>
								</div>
								<div className={styles.chartToggleGroup}>
									<button
										className={`${styles.chartToggleButton} ${
											chartMode === "attendances" ? styles.chartToggleButtonActive : ""
										}`}
										onClick={() => setChartMode("attendances")}
									>
										Atendimentos
									</button>
									<button
										className={`${styles.chartToggleButton} ${
											chartMode === "revenue" ? styles.chartToggleButtonActive : ""
										}`}
										onClick={() => setChartMode("revenue")}
									>
										Faturamento (R$)
									</button>
								</div>
							</div>

							<div className={styles.chartContainer}>
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={data.dailyAttendance}
										margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
									>
										<defs>
											<linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#135184" stopOpacity={0.4} />
												<stop offset="95%" stopColor="#135184" stopOpacity={0.0} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
										<XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
										<YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
										<Tooltip
											contentStyle={{
												backgroundColor: "#ffffff",
												border: "1px solid #e2e8f0",
												borderRadius: "12px",
												boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
												padding: "12px 16px",
											}}
											formatter={(val: any) =>
												chartMode === "revenue"
													? [formatCurrency(Number(val)), "Faturamento"]
													: [`${val} agendamentos`, "Volume"]
											}
										/>
										<Area
											type="monotone"
											dataKey={chartMode === "revenue" ? "revenue" : "attendances"}
											stroke="#135184"
											strokeWidth={3}
											fillOpacity={1}
											fill="url(#colorArea)"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Chart 2: Agendamentos por Status */}
						<div className={styles.chartCard}>
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderTitle}>
									<PieChartIcon size={20} color="#135184" />
									<div>
										<h2>Status dos Agendamentos</h2>
										<span className={styles.cardHeaderSub}>Distribuição do volume atual</span>
									</div>
								</div>
							</div>

							<div className={styles.pieChartWrapper}>
								<div style={{ width: "100%", height: "200px" }}>
									<ResponsiveContainer width="100%" height="100%">
										<RePieChart>
											<Pie
												data={data.statusBreakdown}
												dataKey="value"
												nameKey="name"
												cx="50%"
												cy="50%"
												innerRadius={60}
												outerRadius={85}
												paddingAngle={4}
											>
												{data.statusBreakdown.map((entry) => (
													<Cell key={entry.name} fill={entry.color} />
												))}
											</Pie>
											<Tooltip
												formatter={(val: any) => [`${val} agendamentos`, "Quantidade"]}
											/>
										</RePieChart>
									</ResponsiveContainer>
								</div>

								<div className={styles.pieLegendGrid}>
									{data.statusBreakdown.map((item) => (
										<div key={item.name} className={styles.pieLegendItem}>
											<div className={styles.pieLegendLeft}>
												<div
													className={styles.pieDot}
													style={{ backgroundColor: item.color }}
												/>
												<span>{item.name}</span>
											</div>
											<span className={styles.pieLegendValue}>{item.value}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>

					{/* CONTENT GRID (Tables & Lists) */}
					<section className={styles.contentGrid}>
						{/* Left Column: Próximos Agendamentos de Hoje */}
						<div className={styles.wideCard}>
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderTitle}>
									<Calendar size={20} color="#135184" />
									<div>
										<h2>Próximos Agendamentos de Hoje</h2>
										<span className={styles.cardHeaderSub}>
											Agenda do dia em ordem de horário
										</span>
									</div>
								</div>
							</div>

							<ul className={styles.appointmentList}>
								{data.nextAppointments.map((apt) => {
									const badgeClassMap: Record<string, string> = {
										Agendado: styles.statusBadgeScheduled,
										"Em andamento": styles.statusBadgeInProgress,
										Concluído: styles.statusBadgeCompleted,
										Cancelado: styles.statusBadgeCanceled,
									};

									return (
										<li key={apt.id} className={styles.appointmentItem}>
											<div className={styles.clientInfoGroup}>
												{apt.clientPicture ? (
													<img
														src={apt.clientPicture}
														alt={apt.clientName}
														className={styles.clientAvatar}
													/>
												) : (
													<BallName name={apt.clientName} size={42} />
												)}
												<div className={styles.clientDetails}>
													<span className={styles.clientName}>{apt.clientName}</span>
													<span className={styles.serviceName}>
														{apt.serviceName} • {formatCurrency(apt.price)}
													</span>
												</div>
											</div>

											<div className={styles.appointmentRightGroup}>
												<span className={styles.appointmentTime}>{apt.time}</span>
												<span className={styles.professionalName}>
													Profissional: {apt.professionalName}
												</span>
												<span className={badgeClassMap[apt.status] ?? styles.statusBadgeScheduled}>
													{apt.status}
												</span>
											</div>
										</li>
									);
								})}
							</ul>
						</div>

						{/* Right Column: Serviços Mais Populares & Horários de Pico */}
						<div className={styles.sideCard}>
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderTitle}>
									<Scissors size={20} color="#135184" />
									<div>
										<h2>Serviços Mais Agendados</h2>
										<span className={styles.cardHeaderSub}>Ranking por volume de agendamentos</span>
									</div>
								</div>
							</div>

							<ul className={styles.serviceMetricList}>
								{data.mostBookedServices.map((service) => (
									<li key={service.id} className={styles.serviceMetricItem}>
										<div className={styles.serviceItemTop}>
											<span className={styles.serviceItemTitle}>{service.name}</span>
											<span className={styles.serviceCategoryBadge}>{service.category}</span>
										</div>
										<div className={styles.serviceItemStats}>
											<span>{service.bookings} agendamentos</span>
											<span className={styles.serviceRevenue}>
												{formatCurrency(service.revenue)}
											</span>
										</div>
										<div className={styles.progressBarContainer}>
											<div
												className={styles.progressBarFill}
												style={{ width: `${service.sharePercentage}%` }}
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</section>

					{/* BOTTOM GRID (Peak Hours BarChart & Top Clients List) */}
					<section className={styles.contentGrid}>
						{/* Horários de Pico */}
						<div className={styles.wideCard}>
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderTitle}>
									<Clock size={20} color="#135184" />
									<div>
										<h2>Horários de Pico do Estabelecimento</h2>
										<span className={styles.cardHeaderSub}>
											{data.occupancy.peakHoursText}
										</span>
									</div>
								</div>
							</div>

							<div className={styles.chartContainer} style={{ height: "240px" }}>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={data.peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
										<XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
										<YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
										<Tooltip
											formatter={(val: any) => [`${val} atendimentos`, "Volume no Horário"]}
										/>
										<Bar dataKey="count" fill="#135184" radius={[6, 6, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>

							<div className={styles.occupancyCardContent} style={{ marginTop: "16px" }}>
								<span className={styles.cardLabel}>Horários Livres Recomendados Hoje:</span>
								<div className={styles.freeSlotsBadgeGroup}>
									{data.occupancy.freeSlots.map((slot) => (
										<span key={slot} className={styles.freeSlotBadge}>
											{slot}
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Principais Clientes */}
						<div className={styles.sideCard}>
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderTitle}>
									<Users size={20} color="#135184" />
									<div>
										<h2>Principais Clientes</h2>
										<span className={styles.cardHeaderSub}>Clientes mais assíduos no sistema</span>
									</div>
								</div>
							</div>

							<ul className={styles.clientsList}>
								{data.topClients.map((client) => (
									<li key={client.id} className={styles.clientCardItem}>
										<div className={styles.clientInfoGroup}>
											{client.profilePicture ? (
												<img
													src={client.profilePicture}
													alt={client.name}
													className={styles.clientAvatar}
												/>
											) : (
												<BallName name={client.name} size={40} />
											)}
											<div className={styles.clientDetails}>
												<span className={styles.clientName}>{client.name}</span>
												<span className={styles.serviceName}>
													{client.appointmentsCount} atendimentos • Desde {client.firstVisit}
												</span>
											</div>
										</div>
										<span className={styles.clientSpent}>
											{formatCurrency(client.totalSpent)}
										</span>
									</li>
								))}
							</ul>
						</div>
					</section>
				</>
			)}
		</main>
	);
}
