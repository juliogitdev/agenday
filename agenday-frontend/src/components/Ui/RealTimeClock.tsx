
import { useState, useEffect } from "react";
import { Clock, CalendarDays } from "lucide-react";
import styles from "./styles/realTimeClock.module.css"

export function RealTimeClock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formattedDate = time.toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "short",
	}).replace("-feira", "");

	const formattedTime = time.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	return (
		<div className={styles.clockContainer}>
			<div className={styles.dateBlock}>
				<CalendarDays size={16} color="#135184" />
				<span className={styles.dateText}>{formattedDate}</span>
			</div>
			<div className={styles.timeBlock}>
				<Clock size={16} color="#135184" />
				<span className={styles.timeText}>{formattedTime}</span>
			</div>
		</div>
	);
}