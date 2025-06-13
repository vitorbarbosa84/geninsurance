import { Box, Button, Paper, Typography, Divider } from '@mui/material';

type ResultsScreenProps = {
  score: number;
  estimatedPremium: number;
  onProceed: () => void; // Function to handle proceeding to the next step
};

export function ResultsScreen({ score, estimatedPremium, onProceed }: ResultsScreenProps) {
  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Your Preliminary Estimate
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Preliminary Risk Score:</Typography>
          <Typography variant="h3" color="primary">{score}/100</Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Estimated Annual Premium:</Typography>
          <Typography variant="h3" color="primary">${estimatedPremium.toLocaleString()}</Typography>
        </Box>
        <Typography variant="caption" display="block" sx={{ my: 2, color: 'text.secondary' }}>
          This is a non-binding estimate based on your answers.
        </Typography>
        <Button variant="contained" size="large" onClick={onProceed}>
          Proceed to Full Application
        </Button>
      </Paper>
    </Box>
  );
}