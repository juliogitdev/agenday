
import { Outlet } from "react-router-dom";
import { PrivateRoute } from "../routes/PrivateRoute";

export function PrivateLayout() {
	return (<PrivateRoute><Outlet /></PrivateRoute>);
}