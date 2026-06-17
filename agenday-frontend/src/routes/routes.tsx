
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home }from './../pages/home';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<h1>404 - Não encontrado</h1>} />
      </Routes>
    </BrowserRouter>
  );
}