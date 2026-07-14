/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes/routes.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

import './styles/theme.css'
import './styles/global.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
	const queryClient = new QueryClient({
  		defaultOptions: {
    		queries: {
      			staleTime: 1000 * 60 * 2, 
      			refetchOnWindowFocus: false,
    		},
  		},
	});

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<StrictMode>
						<ThemeProvider>
							<AppRoutes/>
						</ThemeProvider>
					</StrictMode>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</AuthProvider>
		</GoogleOAuthProvider>
	);
}
createRoot(document.getElementById('root')!).render(<App />)
