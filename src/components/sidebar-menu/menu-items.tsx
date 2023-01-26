import { BiReceipt, BiStore } from 'react-icons/bi';
import { BsBuilding } from 'react-icons/bs';
import { FiGrid, FiSettings } from 'react-icons/fi';
import { GiPill } from 'react-icons/gi';
import { GoPackage } from 'react-icons/go';
import { HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi';
import { RiUserSettingsLine } from 'react-icons/ri';

import { ROUTES } from '../../constants/routes';

export const CustomerMenu = [
  {
    title: 'Menu Principal',
    children: [
      {
        title: 'Loja',
        path: ROUTES.StoreFront,
        icon: BiStore,
      },
      {
        title: 'Minhas Compras',
        path: ROUTES.CustomerOrders,
        icon: BiReceipt,
      },
      {
        title: 'Configurações',
        path: ROUTES.Profile,
        icon: RiUserSettingsLine,
      },
    ],
  },
];

export const AdminMenu = [
  {
    title: 'Menu Principal',
    children: [
      {
        title: 'Dashboard',
        path: ROUTES.Dashboard,
        icon: FiGrid,
      },
      {
        title: 'Vendas',
        path: ROUTES.Orders,
        icon: BiReceipt,
      },
      {
        title: 'Produtos',
        path: ROUTES.Products,
        icon: GiPill,
      },
      {
        title: 'Entradas',
        path: ROUTES.Purchases,
        icon: GoPackage,
      },
      {
        title: 'Clientes',
        path: ROUTES.Customers,
        icon: HiOutlineUsers,
      },
      {
        title: 'Funcionários',
        path: ROUTES.Employees,
        icon: HiOutlineUserGroup,
      },
      {
        title: 'Fornecedores',
        path: ROUTES.Suppliers,
        icon: BsBuilding,
      },
    ],
  },
  {
    title: 'Outros',
    children: [
      {
        title: 'Utilizadores',
        path: ROUTES.Users,
        icon: RiUserSettingsLine,
      },
      {
        title: 'Preferências',
        path: ROUTES.Preferences,
        icon: FiSettings,
      },
    ],
  },
];
