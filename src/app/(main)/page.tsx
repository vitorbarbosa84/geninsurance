'use client';

import { useState } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { MessageInput } from '@/components/MessageInput';
import { ActionButtons } from '@/components/ActionButtons';
import { Box, Container } from '@mui/material';

// Define the shape of our data
type Message = { sender: 'bot' | 'user'; text: string };
type Action = { id: string; text: string };

// Hardcoded conversation script for the static flow
const staticFlow: { [key: string]: { botResponse: string; nextActions: Action[] } } = {
  'start': {
    botResponse: 'Great! Now, do you have a multi-factor authentication (MFA) policy in place?',
    nextActions: [
      { id: 'mfa-yes', text: 'Yes, for all users' },
      { id: 'mfa-no', text: 'No / I don\'t know' },
    ],
  },
  'mfa-yes': {
    botResponse: 'Excellent. That is a critical control. Thank you, that is all for this preliminary assessment.',
    nextActions: [],
  },
  'mfa-no': {
    botResponse: 'Understood. Implementing MFA is a highly recommended security practice. Thank you, that is all for this preliminary assessment.',
    nextActions: [],
  },
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Welcome! Let's start with a few questions." },
    { sender: 'bot', text: 'What industry is your business in?' },
  ]);

  const [actions, setActions] = useState<Action[]>([
    { id: 'start', text: 'Technology' },
    { id: 'start', text: 'E-commerce' },
  ]);

  const handleActionClick = (action: Action) => {
    // 1. Add user's choice to messages
    const userMessage: Message = { sender: 'user', text: action.text };
    
    // 2. Get the bot's response from our hardcoded script
    const flowStep = staticFlow[action.id];
    const botMessage: Message = { sender: 'bot', text: flowStep.botResponse };

    // 3. Update the state
    setMessages([...messages, userMessage, botMessage]);
    setActions(flowStep.nextActions);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <ChatWindow messages={messages} />
        <Box>
          {/* We need to update ActionButtons to handle the click */}
          <ActionButtons actions={actions} onActionClick={handleActionClick} />
          {/* For this story, the text input remains disabled */}
          <MessageInput disabled={true} />
        </Box>
      </Box>
    </Container>
  );
}
