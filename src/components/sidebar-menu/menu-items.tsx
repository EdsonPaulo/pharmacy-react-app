import { BsCardChecklist } from 'react-icons/bs';
import { FiBriefcase, FiGrid, FiSettings, FiUsers } from 'react-icons/fi';
import { GiPill } from 'react-icons/gi';
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
        title: 'produtos',
        path: ROUTES.Products,
        icon: GiPill,
      },
      {
        title: 'Clientes',
        path: ROUTES.Customers,
        icon: FiUsers,
      },
      {
        title: 'Funcionários',
        path: ROUTES.Employees,
        icon: FiBriefcase,
      },
    ],
  },
  {
    title: 'Preferências',
    children: [
      {
        title: 'Utilizadores',
        path: ROUTES.Users,
        icon: FiUsers,
      },
      {
        title: 'Configurações',
        path: ROUTES.Settings,
        icon: FiSettings,
      },
    ],
  },
];
