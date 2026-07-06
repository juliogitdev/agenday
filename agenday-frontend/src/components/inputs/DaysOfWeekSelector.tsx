
import { useState } from 'react';
import styles from './styles/daysOfWeekSelector.module.css';

export type selected_day = {
	id: string;
	label: string;
}

interface DaysOfWeekSelectorProps {
	label?: string;
	onChangeDays?: (days: selected_day[]) => void;
	initialDays?: selected_day[];
}

const DAYS_OF_WEEK: selected_day[] = [
	{ id: 'MONDAY', label: 'Segunda' },
	{ id: 'TUESDAY', label: 'Terça' },
	{ id: 'WEDNESDAY', label: 'Quarta' },
	{ id: 'THURSDAY', label: 'Quinta' },
	{ id: 'FRIDAY', label: 'Sexta' },
	{ id: 'SATURDAY', label: 'Sábado' },
	{ id: 'SUNDAY', label: 'Domingo' }
];

export function DaysOfWeekSelector({ label, onChangeDays, initialDays = [] }: DaysOfWeekSelectorProps) {
	const [selectedDays, setSelectedDays] = useState<selected_day[]>(initialDays);

	const handleToggleDay = (day: selected_day) => {
		const isAlreadySelected = selectedDays.some(d => d.id === day.id);

		const updatedDays = isAlreadySelected
			? selectedDays.filter(d => d.id !== day.id) 
			: [...selectedDays, day];            

		setSelectedDays(updatedDays);
		onChangeDays?.(updatedDays);
	};

	return (
		<div className={styles.container}>
			<label className={styles.label}>{label || 'Dias de Trabalho'}</label>
			<div className={styles.grid}>
				{DAYS_OF_WEEK.map((day) => {
					const isActive = selectedDays.some(d => d.id === day.id);
					return (
						<button
							key={day.id}
							type="button"
							className={`${styles.dayButton} ${isActive ? styles.dayButtonActive : ''}`}
							onClick={() => handleToggleDay(day)}
						>
							{day.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}