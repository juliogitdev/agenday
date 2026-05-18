

import { Breadcrumb } from "../components/navigation/Breadcrumb";
import styles from "./styles/home.module.css";

export const Home = function () {
    return (
		<main className={styles.homePage}> 
			<Breadcrumb/>
		</main> 
	);
}
