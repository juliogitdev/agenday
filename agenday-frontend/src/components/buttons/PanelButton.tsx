
import { type ReactNode, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../../context/AuthContext";
import type { UserLogged } from "../../types/User";
import type { AgendaJwt } from "../../types/Jwt";
import styles from "./styles/panelButton.module.css";
import { PERMISSIONS_MAP } from "../../constants/RoutePermisionsMap";


type ButtonState = "disabled" | "active" | "inactive";
type PanelButtonProps = {
	to: string;
	icon: ReactNode;
	toastHoverText: string;
	notificationsCount: number;
};

function resolveButtonState(pathname: string, to: string, userRoles: string[]): ButtonState {
	const allowedRoles = PERMISSIONS_MAP[to];
	if (!allowedRoles) { return "disabled"; }
	const hasPermission = userRoles.some(role => allowedRoles.includes(role));
	if (!hasPermission) { return "disabled"; }
	return pathname === to ? "active" : "inactive";
}


export function PanelButton(props: PanelButtonProps) {
	const { user } = useContext(AuthContext) as { user: UserLogged; };
	const location = useLocation();

	const userData: AgendaJwt = jwtDecode(user.accessToken || "");
	const userRoles = userData.roles ?? []; 
	const buttonState = resolveButtonState(location.pathname, props.to, userRoles);
	const isDisabled = buttonState === "disabled";

	const iconClass = {
		disabled: styles.panelButtonDisabled,
		active: styles.panelButtonActive,
		inactive: styles.panelButtonIcon,
	}[buttonState];

	return (
		<Link
			to={props.to}
			className={styles.pannelButton}
			aria-disabled={isDisabled}
			tabIndex={isDisabled ? -1 : undefined}
			style={{ pointerEvents: isDisabled ? "none" : "auto" }}
		>
			{props.notificationsCount > 0 && (
				<span className={styles.panelButtonNotificationsCount}> {props.notificationsCount}</span>
			)}

			<span className={styles.panelButtonToastHoverText}> {props.toastHoverText}</span>
			<span className={iconClass}> {props.icon}</span>
		</Link>
	);
}