
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../providers/AuthProvider";
import { Header } from "../layouts/Header";

export const Home = function () {
    return (
		<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> 
			<AuthProvider> 
				<main className="app-main"> 
					<Header></Header> //Hadouken 
				</main> 
			</AuthProvider> 
		</GoogleOAuthProvider>
	);
}
