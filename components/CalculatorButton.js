
import { Pressable, Text, StyleSheet } from 'react-native';

export default function CalculatorButton({ label, type, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[type] || styles.number,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
    flexBasis: '20%',
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    backgroundColor: '#222734',
  },

  scientific: {
    backgroundColor: '#29243B',
  },

  operator: {
    backgroundColor: '#353C4D',
  },

  utility: {
    backgroundColor: '#454052',
  },

  equals: {
    backgroundColor: '#8B5CF6',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.65,
  },
});
