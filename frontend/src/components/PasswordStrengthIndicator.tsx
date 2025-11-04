import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
];

const calculateStrength = (password: string): number => {
  if (!password) return 0;
  const metRequirements = requirements.filter(req => req.test(password)).length;
  return (metRequirements / requirements.length) * 100;
};

const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return '';
  if (strength < 50) return 'Weak';
  if (strength < 75) return 'Fair';
  if (strength < 100) return 'Good';
  return 'Strong';
};

const getStrengthColor = (strength: number): 'error' | 'warning' | 'info' | 'success' => {
  if (strength < 50) return 'error';
  if (strength < 75) return 'warning';
  if (strength < 100) return 'info';
  return 'success';
};

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = calculateStrength(password);
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = getStrengthColor(strength);

  if (!password) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={strength}
          color={strengthColor}
          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
        />
        {strengthLabel && (
          <Typography
            variant="caption"
            fontWeight="bold"
            color={`${strengthColor}.main`}
            sx={{ minWidth: 50 }}
          >
            {strengthLabel}
          </Typography>
        )}
      </Box>

      <Stack spacing={0.5}>
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              {isMet ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              )}
              <Typography
                variant="caption"
                color={isMet ? 'success.main' : 'text.secondary'}
              >
                {req.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PasswordStrengthIndicator;
