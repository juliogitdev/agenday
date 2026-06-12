
import { Bell } from "lucide-react";
import styles from "./styles/notifications.module.css";

export function Notification({onClick}:{onClick:(asModified: boolean) => void}) {
	return (
		<div className={styles.notification} onClick={(e) => {
			const isModified = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
			onClick(isModified);
		}}>
			<Bell className={styles.notificationIcon} />
			<span className={styles.notificationBadge}>10</span>
		</div>
	);	
}