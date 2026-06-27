import { useState } from 'react';
import styles from './styles/daysOfWeekSelector.module.css';

interface DaysOfWeekSelectorProps {
	label?: string;
	onChangeDays?: (days: string[]) => void;
	initialDays?: string[];
}

const DAYS_OF_WEEK = [
	{ id: 'seg', label: 'Seg' },
	{ id: 'ter', label: 'Ter' },
	{ id: 'qua', label: 'Qua' },
	{ id: 'qui', label: 'Qui' },
	{ id: 'sex', label: 'Sex' },
	{ id: 'sab', label: 'Sáb' },
	{ id: 'dom', label: 'Dom' },
];

export function DaysOfWeekSelector({ label, onChangeDays, initialDays = [] }: DaysOfWeekSelectorProps) {
	const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);

	const handleToggleDay = (dayId: string) => {
		const updatedDays = selectedDays.includes(dayId)
			? selectedDays.filter(d => d !== dayId)
			: [...selectedDays, dayId];

		setSelectedDays(updatedDays);
		onChangeDays?.(updatedDays);
	};

	return (
		<div className={styles.container}>
			<label className={styles.label}>{label || 'Dias de Trabalho'}</label>
			<div className={styles.grid}>
				{DAYS_OF_WEEK.map((day) => {
					const isActive = selectedDays.includes(day.id);
					return (
						<button
							key={day.id}
							type="button"
							className={`${styles.dayButton} ${isActive ? styles.dayButtonActive : ''}`}
							onClick={() => handleToggleDay(day.id)}>
							{day.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}