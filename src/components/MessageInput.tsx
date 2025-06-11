import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'; // Using an icon from MUI

// Define the props, including a disabled flag
type MessageInputProps = {
  disabled?: boolean;
};

export function MessageInput({ disabled = false }: MessageInputProps) {
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: 2, // Margin top for spacing
      }}
    >
      <TextField
        label="Type your answer..."
        variant="outlined"
        fullWidth
        disabled={disabled}
        size="small"
      />
      <IconButton type="submit" color="primary" disabled={disabled} sx={{ ml: 1 }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
