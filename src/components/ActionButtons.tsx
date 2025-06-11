import { Box, Button, Stack } from '@mui/material';

// Define the shape of a single action object
type Action = {
  id: string;
  text: string;
};

// Define the props for our component
type ActionButtonsProps = {
  actions: Action[];
  // We'll add an onActionClick handler in a future story
};

export function ActionButtons({ actions }: ActionButtonsProps) {
  if (!actions || actions.length === 0) {
    return null; // Don't render anything if there are no actions
  }

  return (
    <Box sx={{ my: 2 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {actions.map((action) => (
          <Button key={action.id} variant="outlined" size="small">
            {action.text}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
