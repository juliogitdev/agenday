
import styles from "./styles/breadcrumb.module.css";

export function Breadcrumb() {
	const location = window.location.pathname;
	return <div className={styles.breadcrumb}><span>agenday {location}</span></div>;
}