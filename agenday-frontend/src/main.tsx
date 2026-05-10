/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes/routes.tsx'
import { Header } from './layouts/Header.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

import './styles/theme.css'
import './styles/global.css'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'


function App() {
	return (
		<StrictMode>
        <ThemeProvider>
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> 
				<AuthProvider> 
					<main className="app-main"> 
						<Header></Header> //Hadouken 
						<AppRoutes/> 
					</main> 
				</AuthProvider> 
			</GoogleOAuthProvider>
        </ThemeProvider>
    </StrictMode>
	);
}
createRoot(document.getElementById('root')!).render(<App />)
