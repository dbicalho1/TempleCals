import { Box, Typography } from '@mui/material';

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
  unit?: string;
}

const CircularProgress = ({ 
  value, 
  max, 
  label, 
  color, 
  size = 160,
  unit = ''
}: CircularProgressProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  const isOverLimit = value > max;
  const displayColor = isOverLimit ? '#d32f2f' : color;

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background Circle */}
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="12"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={displayColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease'
          }}
        />
      </svg>

      {/* Center Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight="bold" color={displayColor}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5 }}>
          / {max}{unit}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ mt: 0.5 }}>
          {label}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5,
            fontWeight: 600,
            color: displayColor
          }}
        >
          {percentage}%
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgress;
