
import { calculate } from './utils/calculator';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';


import CalculatorButton from './components/CalculatorButton';
import CalculatorDisplay from './components/CalculatorDisplay';

const BUTTONS = [
  { label: 'sin', type: 'scientific' },
  { label: 'cos', type: 'scientific' },
  { label: 'tan', type: 'scientific' },
  { label: 'AC', type: 'utility' },

  { label: '√', type: 'scientific' },
  { label: 'x²', type: 'scientific' },
  { label: 'xʸ', type: 'scientific' },
  { label: 'DEL', type: 'utility' },

  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: '÷', type: 'operator' },

  { label: '4', type: 'number' },
  { label: '5', type: 'number' },
  { label: '6', type: 'number' },
  { label: '×', type: 'operator' },

  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '−', type: 'operator' },

  { label: '(', type: 'utility' },
  { label: ')', type: 'utility' },
  { label: '0', type: 'number' },
  { label: '.', type: 'number' },
  { label: '+', type: 'operator' },
  { label: '=', type: 'equals' },
];

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const [angleMode, setAngleMode] = useState('DEG');
  const [powerBase, setPowerBase] = useState(null);
  const [justCalculated, setJustCalculated] = useState(false);

  function handleButtonPress(label) {
    if (label === '=') {
      try {
        let answer;

        if (powerBase !== null) {
          const exponent = calculate(expression);
          answer = Math.pow(powerBase, exponent);
          setPowerBase(null);
        } else {
          answer = calculate(expression);
        }

        if (!Number.isFinite(answer)) {
          throw new Error('Invalid result');
        }

        const formattedAnswer = Number(answer.toPrecision(12));

        setExpression(String(formattedAnswer));
        setResult(String(formattedAnswer));
        setJustCalculated(true);

      } catch (error) {
        setResult('Error');
        setPowerBase(null);
        setJustCalculated(false);
      }

      return;
    }
    if (
      ['√', 'x²', 'sin', 'cos', 'tan'].includes(label)
    ) {
      try {
        const value = calculate(expression);
        let answer;

        if (label === '√') {
          if (value < 0) {
            throw new Error('Invalid square root');
          }
          answer = Math.sqrt(value);
        } else if (label === 'x²') {
          answer = value * value;
        } else {
          const angle =
            angleMode === 'DEG'
              ? (value * Math.PI) / 180
              : value;

          if (
            label === 'tan' &&
            Math.abs(Math.cos(angle)) < 1e-10
          ) {
            throw new Error('Tangent is undefined');
          }

          if (label === 'sin') {
            answer = Math.sin(angle);
          } else if (label === 'cos') {
            answer = Math.cos(angle);
          } else {
            answer = Math.tan(angle);
          }
        }

        if (!Number.isFinite(answer)) {
          throw new Error('Invalid result');
        }

        const formattedAnswer = Number(answer.toPrecision(12));

        setExpression(String(formattedAnswer));
        setResult(String(formattedAnswer));
        setJustCalculated(true);
      } catch (error) {
        setResult('Error');
      }

      return;
    }

    if (label === 'xʸ') {
      try {
        const base = calculate(expression);

        setPowerBase(base);
        setExpression('0');
        setResult(`${base} ^`);
      } catch (error) {
        setResult('Error');
      }

      return;
    }

    // Clear everything.
    if (label === 'AC') {
      setPowerBase(null);
      setExpression('0');
      setResult('0');
      setJustCalculated(false);
      return;
    }

    // Delete the last character.
    if (label === 'DEL') {
      setJustCalculated(false);
      setExpression((current) => {
        if (current.length <= 1) {
          return '0';
        }

        return current.slice(0, -1);
      });
      return;
    }

    // Basic number input.
    if (/^[0-9]$/.test(label)) {
      if (justCalculated) {
        setExpression(label);
        setResult('0');
        setPowerBase(null);
        setJustCalculated(false);
        return;
      }

      setExpression((current) => {
        if (current === '0') {
          return label;
        }

        return current + label;
      });
      return;
    }

    // Add a decimal point only once per number.
    if (label === '.') {
      if (justCalculated) {
        setExpression('0.');
        setResult('0');
        setPowerBase(null);
        setJustCalculated(false);
        return;
      }
      
      setExpression((current) => {
        const currentNumber = current.split(/[+\-×÷()]/).pop();

        if (currentNumber.includes('.')) {
          return current;
        }

        if (
          current === '0' ||
          /[+\-×÷(]$/.test(current)
        ) {
          return current + '0.';
        }

        return current + '.';
      });
      return;
    }

    // Add basic arithmetic operators.
    if (['+', '−', '×', '÷'].includes(label)) {
      setJustCalculated(false);
      setExpression((current) => {
        if (current === '0' && label !== '−') {
          return current;
        }

        if (/[+\-×÷]$/.test(current)) {
          return current.slice(0, -1) + label;
        }

        return current + label;
      });
      return;
    }

    if (label === '(' || label === ')') {
      setExpression((current) => {
        if (current === '0' && label === '(') {
          return '(';
        }

        return current + label;
      });

      return;
    }
    // Other functions will be implemented in later lessons.
    console.log(label + ' will be implemented later.');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.heading}>
        SCIENTIFIC CALCULATOR
      </Text>
      <Pressable
        style={styles.angleToggle}
        onPress={() => {
          setAngleMode((current) =>
            current === 'DEG' ? 'RAD' : 'DEG'
          );
        }}
      >
        <Text style={styles.angleText}>
          Angle: {angleMode}
        </Text>
      </Pressable>

      <CalculatorDisplay
        expression={expression}
        result={result}
      />

      

      <View style={styles.buttonGrid}>
        {BUTTONS.map((button) => (
          <CalculatorButton
            key={button.label}
            label={button.label}
            type={button.type}
            onPress={() => handleButtonPress(button.label)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10131B',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },

  heading: {
    color: '#B8C1D1',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 24,
  },

  buttonGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  angleToggle: {
    alignSelf: 'flex-end',
    backgroundColor: '#29243B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  angleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
