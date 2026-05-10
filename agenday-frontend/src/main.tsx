/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes/routes.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

import './styles/theme.css'
import './styles/global.css'

function App() {
	return (
		<StrictMode>
        	<ThemeProvider>
				<AppRoutes/>
        	</ThemeProvider>
    	</StrictMode>
	);
}
createRoot(document.getElementById('root')!).render(<App />)
