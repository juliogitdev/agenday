import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './../pages/home'
import { SignUp } from '../pages/SignUp';
import { PrivateRoute } from './PrivateRoute';
import { SignIn } from '../pages/SignIn';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={ <PrivateRoute><Home /></PrivateRoute>} />
				<Route path="/login"   element={<SignIn />} />
				<Route path="/signin"  element={<SignIn />} />
				<Route path="/signup"  element={<SignUp />} />
                <Route path="*" element={<h1>404 - Não encontrado</h1>} />
            </Routes>
        </BrowserRouter>
    )
}
