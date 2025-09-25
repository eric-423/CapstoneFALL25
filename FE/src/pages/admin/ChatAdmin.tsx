import React, { useState } from 'react';

import { Search as SearchIcon,Send as SendIcon } from '@mui/icons-material';
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const BG_MAIN = '#F0F7F0';
const BG_CARD = '#fff';
const COLOR_ACCENT = '#4CAF50'; // green light
const COLOR_ACCENT_DARK = '#2E7D32'; // green dark
const COLOR_USER = '#388E3C'; // green for user
const COLOR_ADMIN = '#F4F4F4'; // light gray for admin
const COLOR_TEXT = '#333';
const COLOR_TEXT_SECONDARY = '#2E7D32';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const ChatAdmin: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');

  // Mock data - replace with actual data from your backend
  const chats: Chat[] = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hello, how can I help you?',
      timestamp: '10:30 AM',
      avatar: 'JD',
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Thank you for your support!',
      timestamp: '9:45 AM',
      avatar: 'JS',
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      content: 'Hello, how can I help you?',
      sender: 'admin',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      content: 'I have a question about my order',
      sender: 'user',
      timestamp: '10:31 AM',
    },
  ];

  return (
    <Box sx={{ background: BG_MAIN, minHeight: '90vh', py: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Chat List */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 0, height: '80vh', borderRadius: 3, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', background: BG_CARD }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Typography variant="h6" fontWeight={700} color={COLOR_TEXT_SECONDARY} gutterBottom>
                  Conversations
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    background: '#FAFAFA',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#ccc',
                      },
                      '&:hover fieldset': {
                        borderColor: COLOR_ACCENT_DARK,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLOR_ACCENT_DARK,
                        borderWidth: 2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: COLOR_ACCENT_DARK }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 2, marginRight: 2 }}>
              <List disablePadding>
                {chats.map((chat) => (
                  <React.Fragment key={chat.id}>
                    <ListItem
                      component="div"
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedChat === chat.id ? '#E8F5E9' : 'inherit',
                        borderRadius: 2,
                        mx: 1,
                        mb: 1,
                        boxShadow: selectedChat === chat.id ? '0 2px 8px #4CAF5033' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#F1F8E9',
                        },
                      }}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <ListItemText
                        primary={<Typography fontWeight={700} color={COLOR_TEXT}>{chat.name}</Typography>}
                        secondary={<Typography color="#888" fontSize={14}>{chat.lastMessage}</Typography>}
                      />
                      <Typography variant="caption" color="#B0B0B0" sx={{ minWidth: 60, textAlign: 'right', marginRight: 2 }}>
                        {chat.timestamp}
                      </Typography>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
              </Box>
            </Paper>
          </Grid>

          {/* Chat Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 0, height: '80vh', borderRadius: 3, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', background: BG_CARD }}>
              {/* Header */}
              <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #F4F4F4', minHeight: 60 }}>
                <Typography variant="h6" fontWeight={700} color={COLOR_TEXT}>
                  {selectedChat ? chats.find(c => c.id === selectedChat)?.name : 'Select a conversation'}
                </Typography>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2, background: 'transparent' }}>
                {selectedChat ? (
                  messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          background: message.sender === 'user' ? COLOR_USER : COLOR_ADMIN,
                          color: message.sender === 'user' ? '#fff' : COLOR_TEXT,
                          px: 2.5,
                          py: 1.5,
                          borderRadius: 3,
                          boxShadow: '0 2px 8px #0001',
                          maxWidth: '70%',
                          minWidth: 80,
                        }}
                      >
                        <Typography variant="body1" fontSize={16} fontWeight={500} sx={{ wordBreak: 'break-word' }}>
                          {message.content}
                        </Typography>
                        <Typography variant="caption" color={message.sender === 'user' ? '#e0e0e0' : '#888'}>
                          {message.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="h6" color="#B0B0B0">
                      Select a conversation to start chatting
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, borderTop: '1px solid #F4F4F4', display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  size="small"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: '#fff',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 47,
                      '& fieldset': {
                        borderColor: '#ccc',
                      },
                      '&:hover fieldset': {
                        borderColor: COLOR_ACCENT_DARK,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLOR_ACCENT_DARK,
                        borderWidth: 2,
                      },
                    },
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      // handle send
                    }
                  }}
                />
                <IconButton
                  sx={{
                    bgcolor: COLOR_ACCENT_DARK,
                    color: '#fff',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px #4CAF5033',
                    '&:hover': { bgcolor: COLOR_ACCENT },
                  }}
                  size="large"
                  onClick={() => {/* handle send */}}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatAdmin;
