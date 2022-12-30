import { Box } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../components/ColorModeSwitcher';

export const SettingsPage = () => {
  return (
    <Box flex={1} position="relative">
      <ColorModeSwitcher position="absolute" right={10} top={10} />

      <Box />

      <h1>SETTINGS</h1>
    </Box>
  );
};
