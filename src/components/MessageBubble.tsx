import { Box, Paper, Typography } from '@mui/material';

// Define the shape of a single message object
type Message = {
  sender: 'bot' | 'user';
  text: string;
};

// Define the props for our component
type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === 'bot';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end', // Align left for bot, right for user
        mb: 2, // Margin bottom for spacing between messages
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2, // Padding inside the bubble
          backgroundColor: isBot ? 'grey.200' : 'primary.light', // Different colors
          color: isBot ? 'black' : 'white',
          maxWidth: '80%',
          borderRadius: isBot ? '20px 20px 20px 5px' : '20px 20px 5px 20px', // Different bubble shapes
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
      </Paper>
    </Box>
  );
}
