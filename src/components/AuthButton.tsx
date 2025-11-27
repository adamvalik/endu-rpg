import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AuthButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>⚔️ CONNECT TO STRAVA ⚔️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#4ecdc4',
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 4,
    borderTopColor: '#6ef5ed',
    borderLeftColor: '#6ef5ed',
    borderRightColor: '#2d7f7b',
    borderBottomColor: '#2d7f7b',
    marginVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
