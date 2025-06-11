// src/app/(main)/page.tsx

import { ChatWindow } from '@/components/ChatWindow';
import { MessageInput } from '@/components/MessageInput';
import { ActionButtons } from '@/components/ActionButtons';
import { Box, Container } from '@mui/material';

// Static data for the initial view of the MVP
const initialMessages = [
  { sender: 'bot', text: "Welcome! Let's start with a few questions." },
  { sender: 'bot', text: 'What industry is your business in?' }
];
const initialActions = [
  { id: 'industry-tech', text: 'Technology' },
  { id: 'industry-ecommerce', text: 'E-commerce' },
  { id: 'industry-health', text: 'Healthcare' }
];

export default function ChatPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        
        {/* The scrolling window for messages */}
        <ChatWindow messages={initialMessages} />

        {/* The area for user input and action buttons */}
        <Box>
          <ActionButtons actions={initialActions} />
          <MessageInput />
        </Box>

      </Box>
    </Container>
  );
}
