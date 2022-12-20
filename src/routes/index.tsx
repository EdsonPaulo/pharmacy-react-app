import { Route, Routes } from 'react-router-dom';

import ROUTES from '../constants/routes';
import { CustomersPage } from '../pages/customers';
import { DashboardPage } from '../pages/dashboard';
import { EmployeesPage } from '../pages/employees';
import { OrdersPage } from '../pages/orders';

export const Router = () => (
  <Routes>
    <Route path={ROUTES.Dashboard} element={<DashboardPage />} />
    <Route path={ROUTES.Orders} element={<OrdersPage />} />
    <Route path={ROUTES.Customers} element={<CustomersPage />} />
    <Route path={ROUTES.Employees} element={<EmployeesPage />} />
    <Route path={ROUTES.NotFound} />
  </Routes>
);
