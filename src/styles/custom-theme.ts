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
    heading: 'Roboto Slab',
    body: 'Roboto Slab',
  },
});
export default CustomTheme;
