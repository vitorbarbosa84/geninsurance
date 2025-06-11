'use client';

import { useState, useEffect } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { MessageInput } from '@/components/MessageInput';
import { ActionButtons } from '@/components/ActionButtons';
import { Box, Container } from '@mui/material';

type Message = { sender: 'bot' | 'user'; text: string };
type Action = { id: string; text: string };

const staticFlow: { [key: string]: { botResponse: string; nextActions: Action[] } } = {
  'start-tech': {
    botResponse: 'Great! Now, do you have a multi-factor authentication (MFA) policy in place?',
    nextActions: [
      { id: 'mfa-yes', text: 'Yes, for all users' },
      { id: 'mfa-no', text: 'No / I don\'t know' },
    ],
  },
  'start-ecommerce': {
    botResponse: 'Understood. For an e-commerce business, do you have a multi-factor authentication (MFA) policy in place?',
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
    { id: 'start-tech', text: 'Technology' },
    // THIS LINE IS NOW FIXED
    { id: 'start-ecommerce', text: 'E-commerce' },
  ]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleActionClick = (action: Action) => {
    const userMessage: Message = { sender: 'user', text: action.text };
    const flowStep = staticFlow[action.id];
    const botMessage: Message = { sender: 'bot', text: flowStep.botResponse };

    setMessages([...messages, userMessage, botMessage]);
    setActions(flowStep.nextActions);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <ChatWindow messages={messages} />
        <Box>
          <ActionButtons actions={actions} onActionClick={handleActionClick} />
          <MessageInput disabled={true} />
        </Box>
      </Box>
    </Container>
  );
}