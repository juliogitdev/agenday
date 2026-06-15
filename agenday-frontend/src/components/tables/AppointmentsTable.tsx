
import { useMemo, useState } from 'react'
import styles from './styles/appointmentsTable.module.css'

export interface Appointment {
	id: string
	client: string
	professional: string
	serviceType: string
	start: Date
	end: Date
	status: 'accepted' | 'pending' | 'conflict'
	reason?: string
}

interface AppointmentsTableProps {
	startTime: string
	endTime: string
	appointments: Appointment[]
	userView: 'professional' | 'client'
	onClick: (id: string) => void
}
const weekDays = [
	{ id: 1, label: 'Segunda' },
	{ id: 2, label: 'Terça' },
	{ id: 3, label: 'Quarta' },
	{ id: 4, label: 'Quinta' },
	{ id: 5, label: 'Sexta' },
	{ id: 6, label: 'Sábado' },
	{ id: 7, label: 'Domingo' }
]

const statusClasses = {
	pending: styles.statusPendente,
	accepted: styles.statusAceito,
	conflict: styles.statusConflito
}

function timeToMinutes(time: string) {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}

function createTimeLabels(start: string, end: string) {
	const labels: string[] = []
	let current = timeToMinutes(start)
	const limit = timeToMinutes(end)

	while (current <= limit) {
		labels.push(
			`${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`
		)
		current += 15
	}
	return labels
}

function formatTime(date: Date) {
	return date.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit'
	})
}

function getWeekDay(date: Date) {
	const day = date.getDay()
	return day === 0 ? 7 : day
}

export function AppointmentsTable({ startTime, endTime, appointments, userView, onClick }: AppointmentsTableProps) {
	const startMinutes = timeToMinutes(startTime)
	const timeLabels = useMemo(
		() => createTimeLabels(startTime, endTime),
		[startTime, endTime]
	)

	const totalSlots = timeLabels.length - 1
	const appointmentsByDay = useMemo(() => {
		return weekDays.reduce<Record<number, Appointment[]>>((acc, day) => {
			acc[day.id] = appointments.filter(
				appointment => getWeekDay(appointment.start) === day.id
			)
			return acc
		}, {})
	}, [appointments])

	function getGridPosition(start: Date, end: Date) {
		const startTimeMinutes = start.getHours() * 60 + start.getMinutes()
		const endTimeMinutes = end.getHours() * 60 + end.getMinutes()
		const gridRowStart = Math.floor((startTimeMinutes - startMinutes) / 15) + 1
		const duration = Math.ceil((endTimeMinutes - startTimeMinutes) / 15)

		return {
			gridRowStart,
			gridRowEnd: gridRowStart + duration
		}
	}

	return (
		<div className={styles.tableContainer}>
			<div className={styles.gridContainer}>
				<div className={styles.headerCorner} />
				{weekDays.map(day => (
					<div key={day.id} className={styles.dayHeader}>
						<span className={styles.dayLabel}> {day.label}</span>
						<span className={styles.dayNumber}> {String(day.id).padStart(2, '0')}</span>
					</div>
				))}

				<div className={styles.timeColumn} style={{
					gridTemplateRows: `repeat(${totalSlots}, minmax(45px, auto))`
				}}>
					{timeLabels.slice(0, -1).map(label => (
						<div key={label} className={styles.timeLabel}> {label}</div>
					))}
				</div>

				{weekDays.map(day => (
					<div key={day.id} className={styles.dayColumn}
						style={{
							gridTemplateRows: `repeat(${totalSlots}, 45px)`,
							backgroundSize: '100% 45px'
						}}>

						{appointmentsByDay[day.id].map(appointment => {
							const position = getGridPosition(appointment.start, appointment.end)
							return (
								<div
									key={appointment.id}
									className={`${styles.card} ${statusClasses[appointment.status]}`}
									style={position}
									onClick={() => onClick(appointment.id)}
								>
									<div>
										<div className={styles.cardTime}>
											{formatTime(appointment.start)} - {formatTime(appointment.end)}
										</div>

										<div className={styles.cardName}>
											{userView === 'professional'
												? appointment.client
												: appointment.professional}
										</div>
									</div>

									<div className={styles.cardType}>
										{appointment.serviceType}
									</div>
								</div>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}