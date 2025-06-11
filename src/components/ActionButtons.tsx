import { Box, Button, Stack } from '@mui/material';

// Define the shape of a single action object
type Action = {
  id: string;
  text: string;
};

// Define the props for our component
type ActionButtonsProps = {
  actions: Action[];
  // NEW: Add the click handler function to our component's props
  onActionClick: (action: Action) => void;
};

export function ActionButtons({ actions, onActionClick }: ActionButtonsProps) {
  if (!actions || actions.length === 0) {
    return null; // Don't render anything if there are no actions
  }

  return (
    <Box sx={{ my: 2 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outlined"
            size="small"
            // NEW: Add the onClick event to each button
            // This calls the function passed down from the parent page, sending the specific action that was clicked
            onClick={() => onActionClick(action)}
          >
            {action.text}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
