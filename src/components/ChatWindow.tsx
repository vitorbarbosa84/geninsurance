'use client'; // This directive is needed for components that use React Hooks

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { MessageBubble } from './MessageBubble';

// Define the shape of a message again for clarity
type Message = {
  sender: 'bot' | 'user';
  text: string;
};

// Define the props for our component
type ChatWindowProps = {
  messages: Message[];
};

export function ChatWindow({ messages }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // This hook runs every time the messages array changes
  useEffect(() => {
    // If the scrollRef is attached to an element, scroll it to the bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        flexGrow: 1, // Allows this box to grow and fill available space
        overflowY: 'auto', // Enables vertical scrolling
        p: 2, // Padding
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: '4px',
      }}
    >
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </Box>
  );
}
