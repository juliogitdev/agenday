

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Dashboard } from '../pages/Dashboard';
import { SignUp } from '../pages/SignUp';
import { SignIn } from '../pages/SignIn';
import { Appointments } from '../pages/Appointments';
import { Establishments } from '../pages/Establishments';
import { Employees } from '../pages/Employees';
import { Services } from '../pages/Services';
import { Configurations } from '../pages/Configurations';
import { Clients } from '../pages/Clients';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { LandingPage } from '../pages/LandingPage';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
				{/* rotas privadas */}
				 <Route element={<PrivateLayout />}>
					<Route path="/home"      element={ <Home />} />
					<Route path="/dashboard" element={ <Dashboard />} />
					<Route path="/appointments"    element={ <Appointments />} />
					<Route path="/establishments" element={ <Establishments />} />
					<Route path="/employees" element={ <Employees />} />
					<Route path="/services" element={ <Services />} />
					<Route path="/clients" element={ <Clients />} />
					<Route path="/configurations" element={ <Configurations />} />
				</Route>

                {/* rotas públicas */}
				<Route path="/login"   element={<SignIn />} />
				<Route path="/signin"  element={<SignIn />} />
				<Route path="/signup"  element={<SignUp />} />

				<Route path="/" element={<LandingPage />}/>
                <Route path="*" element={<h1>404 - Não encontrado</h1>} />
            </Routes>
        </BrowserRouter>
    )
}
