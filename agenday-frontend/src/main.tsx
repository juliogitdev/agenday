
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes  } from './routes/routes.tsx';
import { Header } from "./layouts/Header.tsx";
import { Footer } from "./layouts/Footer.tsx";
import { ThemeProvider } from './context/ThemeContext.tsx';

import "./styles/theme.css";
import "./styles/global.css";

createRoot(document.getElementById('root')!).render( 
  <StrictMode>
    <ThemeProvider>
    	<Header/>
    	<main className="app-main"> <AppRoutes/></main>
    	<Footer/>
    </ThemeProvider>
  </StrictMode>,
);