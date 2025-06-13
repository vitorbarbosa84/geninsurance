'use client';

import { forwardRef } from 'react'; // NEW: Import forwardRef
import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

type MessageInputProps = {
  disabled?: boolean;
  onSubmit: (text: string) => void;
};

// NEW: We wrap the component in forwardRef to get access to the input element
export const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(
  function MessageInput({ disabled = false, onSubmit }, ref) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (inputValue.trim()) {
        onSubmit(inputValue.trim());
        setInputValue('');
      }
    };

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <TextField
          inputRef={ref} // NEW: Attach the ref to the text field
          label="Type your answer..."
          variant="outlined"
          fullWidth
          disabled={disabled}
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <IconButton type="submit" color="primary" disabled={disabled || !inputValue.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    );
  }
);