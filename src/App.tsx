import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header/Header';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import MoviePage from './pages/MoviePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function AppRoutes() {
  const location = useLocation();
  const hideHeader = ['/login', '/register'].some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/movie/:id"
          element={
            <PrivateRoute>
              <MoviePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
