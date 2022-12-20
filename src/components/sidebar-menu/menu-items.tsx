import { FiGrid, FiUsers, FiList, FiSettings } from 'react-icons/fi';
import { GrUserSettings, GrGroup } from 'react-icons/gr';
import { BsCardChecklist } from 'react-icons/bs';

export const AdminMenu = [
  {
    title: 'Menu Principal',
    children: [
      {
        title: 'dashboard',
        path: '/dashboard',
        icon: FiGrid,
      },
      {
        title: 'encomendas',
        path: '/encomendas',
        icon: BsCardChecklist,
      },
      {
        title: 'Clientes',
        path: '/clientes',
        icon: GrGroup,
      },
      {
        title: 'Funcionários',
        path: '/funcionarios',
        icon: FiUsers,
      },
    ],
  },
  {
    title: 'Preferências',
    children: [
      {
        title: 'Utilizadores',
        path: '/preferencias/utilizadores',
        icon: GrUserSettings,
      },
      {
        title: 'Definições',
        path: '/preferencias/definicoes',
        icon: FiSettings,
      },
    ],
  },
];
