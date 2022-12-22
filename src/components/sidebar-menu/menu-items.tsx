import { FiGrid, FiUsers, FiSettings } from 'react-icons/fi';
import { GrUserSettings, GrGroup } from 'react-icons/gr';
import { BsCardChecklist } from 'react-icons/bs';
import { ROUTES } from '../../constants/routes';

export const AdminMenu = [
  {
    title: 'Menu Principal',
    children: [
      {
        title: 'dashboard',
        path: ROUTES.Dashboard,
        icon: FiGrid,
      },
      {
        title: 'encomendas',
        path: ROUTES.Orders,
        icon: BsCardChecklist,
      },
      {
        title: 'Clientes',
        path: ROUTES.Customers,
        icon: GrGroup,
      },
      {
        title: 'Funcionários',
        path: ROUTES.Employees,
        icon: FiUsers,
      },
    ],
  },
  {
    title: 'Preferências',
    children: [
      {
        title: 'Utilizadores',
        path: ROUTES.Users,
        icon: GrUserSettings,
      },
      {
        title: 'Configurações',
        path: ROUTES.Settings,
        icon: FiSettings,
      },
    ],
  },
];
