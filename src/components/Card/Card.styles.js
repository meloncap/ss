import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    padding: 20,
    background: 'transparent linear-gradient(117deg, #fed90f 0%, #FFFFFF 80%, #FFFFFF 100%) 0% 0% no-repeat padding-box',
    backdropFilter: 'blur(1000px)',
    border: '6px solid #0a003c',
    borderRadius: 14,
  },
}));

export default useStyles;
