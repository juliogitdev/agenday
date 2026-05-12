/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes/routes.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

import './styles/theme.css'
import './styles/global.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './providers/AuthProvider.tsx'

function App() {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<AuthProvider>
				<StrictMode>
					<ThemeProvider>
						<AppRoutes/>
					</ThemeProvider>
				</StrictMode>
			</AuthProvider>
		</GoogleOAuthProvider>
	);
}
createRoot(document.getElementById('root')!).render(<App />)
