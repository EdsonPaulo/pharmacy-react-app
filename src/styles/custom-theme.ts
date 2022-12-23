import { extendTheme } from '@chakra-ui/react';

import COLORS from '../constants/colors';

const CustomTheme = extendTheme({
  colors: {
    brand: {
      primary: COLORS.primary,
      primaryDark: COLORS.primaryDark,
      accent: COLORS.accent,
    },
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
});
export default CustomTheme;
