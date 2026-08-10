import { Calendar, Filter, RotateCcw } from "lucide-react";
import styles from "./styles/appointmentsFilterToolbar.module.css";
import type { AppointmentCardType } from "../../types/AppointmentTypes";

export type PeriodFilterType =
	| "today"
	| "tomorrow"
	| "next_7_days"
	| "next_month"
	| "all"
	| "custom";

export type StatusFilterType =
	| "ALL"
	| "SCHEDULED"
	| "COMPLETED"
	| "CANCELED"
	| "NO_SHOW";

export interface AppointmentsFilterToolbarProps {
	selectedPeriod: PeriodFilterType;
	onChangePeriod: (period: PeriodFilterType) => void;
	selectedStatus: StatusFilterType;
	onChangeStatus: (status: StatusFilterType) => void;
	customStartDate: string;
	onChangeStartDate: (date: string) => void;
	customEndDate: string;
	onChangeEndDate: (date: string) => void;
	totalResults: number;
	totalOriginal: number;
	onResetFilters: () => void;
}

export function AppointmentsFilterToolbar({
	selectedPeriod,
	onChangePeriod,
	selectedStatus,
	onChangeStatus,
	customStartDate,
	onChangeStartDate,
	customEndDate,
	onChangeEndDate,
	totalResults,
	totalOriginal,
	onResetFilters,
}: AppointmentsFilterToolbarProps) {
	const periodOptions: { key: PeriodFilterType; label: string }[] = [
		{ key: "today", label: "Hoje" },
		{ key: "tomorrow", label: "Amanhã" },
		{ key: "next_7_days", label: "Próximos 7 dias" },
		{ key: "next_month", label: "Próximo mês" },
		{ key: "all", label: "Todos" },
		{ key: "custom", label: "Período personalizado" },
	];

	const statusOptions: { key: StatusFilterType; label: string }[] = [
		{ key: "ALL", label: "Todos os status" },
		{ key: "SCHEDULED", label: "Agendado" },
		{ key: "COMPLETED", label: "Finalizado" },
		{ key: "CANCELED", label: "Cancelado" },
		{ key: "NO_SHOW", label: "Pendente" },
	];

	const hasActiveFilter =
		selectedPeriod !== "all" ||
		selectedStatus !== "ALL" ||
		customStartDate !== "" ||
		customEndDate !== "";

	return (
		<div className={styles.filterContainer}>
			<div className={styles.filterHeader}>
				<div className={styles.filterTitleGroup}>
					<Filter size={18} />
					<span>Filtrar Agendamentos</span>
				</div>

				{hasActiveFilter && (
					<button
						className={styles.resetButton}
						onClick={onResetFilters}
						title="Limpar todos os filtros"
					>
						<RotateCcw size={14} />
						Limpar Filtros
					</button>
				)}
			</div>

			<div className={styles.filterRow}>
				{/* PERIOD FILTER */}
				<div className={styles.filterGroup}>
					<span className={styles.filterGroupLabel}>Período</span>
					<div className={styles.periodPills}>
						{periodOptions.map((opt) => (
							<button
								key={opt.key}
								type="button"
								className={`${styles.pillButton} ${
									selectedPeriod === opt.key ? styles.pillButtonActive : ""
								}`}
								onClick={() => onChangePeriod(opt.key)}
							>
								{opt.key === "custom" && <Calendar size={14} />}
								{opt.label}
							</button>
						))}
					</div>

					{/* CUSTOM DATE RANGE SELECTOR */}
					{selectedPeriod === "custom" && (
						<div className={styles.customDateContainer}>
							<div className={styles.dateInputGroup}>
								<label htmlFor="startDate">Data Inicial:</label>
								<input
									id="startDate"
									type="date"
									className={styles.dateInput}
									value={customStartDate}
									onChange={(e) => onChangeStartDate(e.target.value)}
								/>
							</div>

							<div className={styles.dateInputGroup}>
								<label htmlFor="endDate">Data Final:</label>
								<input
									id="endDate"
									type="date"
									className={styles.dateInput}
									value={customEndDate}
									onChange={(e) => onChangeEndDate(e.target.value)}
								/>
							</div>
						</div>
					)}
				</div>

				{/* STATUS FILTER */}
				<div className={styles.filterGroup}>
					<span className={styles.filterGroupLabel}>Status</span>
					<div className={styles.statusPills}>
						{statusOptions.map((opt) => {
							let activeClass = styles.statusPillActive;
							if (selectedStatus === opt.key) {
								if (opt.key === "SCHEDULED") activeClass = styles.statusPillScheduledActive;
								if (opt.key === "COMPLETED") activeClass = styles.statusPillCompletedActive;
								if (opt.key === "CANCELED") activeClass = styles.statusPillCanceledActive;
								if (opt.key === "NO_SHOW") activeClass = styles.statusPillNoShowActive;
							}

							return (
								<button
									key={opt.key}
									type="button"
									className={`${styles.statusPill} ${
										selectedStatus === opt.key ? activeClass : ""
									}`}
									onClick={() => onChangeStatus(opt.key)}
								>
									{opt.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className={styles.resultsSummary}>
				<span>
					Exibindo <strong>{totalResults}</strong> de <strong>{totalOriginal}</strong> agendamentos
				</span>
			</div>
		</div>
	);
}

/**
 * Filter logic function to filter an array of AppointmentCardType by period and status.
 */
export function applyAppointmentsFilter(
	appointments: AppointmentCardType[],
	period: PeriodFilterType,
	status: StatusFilterType,
	customStartDate?: string,
	customEndDate?: string
): AppointmentCardType[] {
	const now = new Date();

	return appointments.filter((app) => {
		if (!app.startTime) return false;
		const appDate = new Date(app.startTime);
		const appTime = appDate.getTime();

		// 1. Status Filter
		if (status !== "ALL" && app.status !== status) {
			return false;
		}

		// 2. Period Filter
		if (period === "all") {
			return true;
		}

		if (period === "today") {
			const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
			const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
			return appTime >= startOfToday && appTime <= endOfToday;
		}

		if (period === "tomorrow") {
			const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
			const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0, 0).getTime();
			const endOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59, 999).getTime();
			return appTime >= startOfTomorrow && appTime <= endOfTomorrow;
		}

		if (period === "next_7_days") {
			const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
			const limit7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999).getTime();
			return appTime >= startOfToday && appTime <= limit7Days;
		}

		if (period === "next_month") {
			const currentMonth = now.getMonth();
			const currentYear = now.getFullYear();
			const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
			const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

			const startOfNextMonth = new Date(nextMonthYear, nextMonth, 1, 0, 0, 0, 0).getTime();
			const endOfNextMonth = new Date(nextMonthYear, nextMonth + 1, 0, 23, 59, 59, 999).getTime();
			return appTime >= startOfNextMonth && appTime <= endOfNextMonth;
		}

		if (period === "custom") {
			if (customStartDate) {
				const start = new Date(`${customStartDate}T00:00:00`).getTime();
				if (appTime < start) return false;
			}
			if (customEndDate) {
				const end = new Date(`${customEndDate}T23:59:59.999`).getTime();
				if (appTime > end) return false;
			}
			return true;
		}

		return true;
	});
}
