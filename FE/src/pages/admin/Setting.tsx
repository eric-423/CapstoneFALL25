import React, { useState } from 'react';

import { SettingOutlined } from '@ant-design/icons';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const greenMain = '#43a047'; // Màu xanh lá chính
const greenLight = '#e8f5e9'; // Màu nền xanh lá nhạt
const greenBorder = '#a5d6a7'; // Màu viền xanh lá nhạt

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: '#fff',
  border: `1.5px solid ${greenBorder}`,
  boxShadow: '0 2px 8px 0 rgba(67,160,71,0.05)',
}));

const GreenSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: greenMain,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: greenMain,
  },
});

const Setting: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Admin Dashboard',
    maintenanceMode: false,
    emailNotifications: true,
    maxUploadSize: '10',
    theme: 'light',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the settings
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 4, background: greenLight, minHeight: '100vh', py: 4, borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: greenMain, fontWeight: 700 }}>
        Settings <SettingOutlined />
      </Typography>

      <StyledPaper>
        <Typography variant="h6" gutterBottom sx={{ color: greenMain }}>
          General Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName}
              onChange={handleChange('siteName')}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: greenBorder,
                  },
                  '&:hover fieldset': {
                    borderColor: greenMain,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: greenMain,
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: greenMain,
                  '&.Mui-focused': {
                    color: greenMain,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Upload Size (MB)"
              type="number"
              value={settings.maxUploadSize}
              onChange={handleChange('maxUploadSize')}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: greenBorder,
                  },
                  '&:hover fieldset': {
                    borderColor: greenMain,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: greenMain,
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: greenMain,
                  '&.Mui-focused': {
                    color: greenMain,
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom sx={{ color: greenMain }}>
          System Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={settings.maintenanceMode}
                  onChange={handleChange('maintenanceMode')}
                />
              }
              label="Maintenance Mode"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={settings.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom sx={{ color: greenMain }}>
          Appearance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={settings.theme === 'dark'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: e.target.checked ? 'dark' : 'light',
                    })
                  }
                />
              }
              label="Dark Mode"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{ background: greenMain, '&:hover': { background: '#388e3c' } }}
          onClick={handleSave}
          size="large"
        >
          SAVE CHANGES
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Setting;
