
import { View, Text, StyleSheet } from 'react-native';

export default function CalculatorDisplay({ expression, result }) {
    
  return (
    <View style={styles.display}>
      <Text style={styles.result}>
        {expression}
      </Text>
    </View>


  );
}

const styles = StyleSheet.create({
  display: {
    backgroundColor: '#1A1F2B',
    borderRadius: 16,
    padding: 20,
    minHeight: 90,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  expression: {
    color: '#9CA3AF',
    fontSize: 10,
  },

  result: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
  },
});
