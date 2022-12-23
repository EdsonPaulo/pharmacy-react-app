import { Route, Routes } from 'react-router-dom';

import { ROUTES, AUTH_ROUTES } from '../constants/routes';
import { useAuth } from '../contexts/useAuth';
import { App } from '../pages/App';
import { SignInPage } from '../pages/auth/sign-in';
import { SignUpPage } from '../pages/auth/sign-up';
import { CustomersPage } from '../pages/customers';
import { DashboardPage } from '../pages/dashboard';
import { EmployeesPage } from '../pages/employees';
import { OrdersPage } from '../pages/orders';
import { UsersPage } from '../pages/users';
import { SettingsPage } from '../pages/settings';

export const AuthenticatedRoutes = () => (
  <Routes>
    <Route path={ROUTES.Dashboard} element={<DashboardPage />} />
    <Route path={ROUTES.Orders} element={<OrdersPage />} />
    <Route path={ROUTES.Customers} element={<CustomersPage />} />
    <Route path={ROUTES.Employees} element={<EmployeesPage />} />
    <Route path={ROUTES.Users} element={<UsersPage />} />
    <Route path={ROUTES.Settings} element={<SettingsPage />} />
    <Route path={ROUTES.NotFound} />
  </Routes>
);

const AuthRoutes = () => (
  <Routes>
    <Route path={AUTH_ROUTES.AuthSignIn} element={<SignInPage />} />
    <Route path={AUTH_ROUTES.AuthSignUp} element={<SignUpPage />} />
    <Route path={ROUTES.NotFound} element={<SignInPage />} />
  </Routes>
);

export const Router = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <App /> : <AuthRoutes />;
};
