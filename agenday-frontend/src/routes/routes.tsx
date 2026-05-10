import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './../pages/home'
import { SignUp } from '../pages/SignUp';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/agenday" element={<Home />} />
				<Route path="/login"   element={<Home />} />
				<Route path="/signin"  element={<Home />} />
				<Route path="/signup"  element={<SignUp />} />

                <Route path="*" element={<h1>404 - Não encontrado</h1>} />
            </Routes>
        </BrowserRouter>
    )
}
