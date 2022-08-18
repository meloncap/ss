import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  btn: {
    height: 52,
    backgroundImage: 'linear-gradient(to right, #fed90f 0%, #bcb179 40%, #ffaa00 100%)',
    backgroundSize: '200% auto',
    fontSize: theme.fontSizes.md,
    textTransform: 'uppercase',
    borderRadius: 20,
    border: '5px solid #0a003c',
    transition: theme.other.transitions.background,

    '&:hover': {
      backgroundPositionX: 'right',
      backgroundPositionY: 'center',
    },
  },
}));

export default useStyles;
