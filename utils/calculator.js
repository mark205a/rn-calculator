
export function calculate(input) {
  // Convert calculator symbols into standard math symbols.
  const expression = input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s/g, '');

  let position = 0;

  // Handles addition and subtraction.
  function parseExpression() {
    let value = parseTerm();

    while (
      expression[position] === '+' ||
      expression[position] === '-'
    ) {
      const operator = expression[position];
      position++;

      const nextValue = parseTerm();

      if (operator === '+') {
        value += nextValue;
      } else {
        value -= nextValue;
      }
    }

    return value;
  }

  // Handles multiplication and division first.
  function parseTerm() {
    let value = parseFactor();

    while (
      expression[position] === '*' ||
      expression[position] === '/'
    ) {
      const operator = expression[position];
      position++;

      const nextValue = parseFactor();

      if (operator === '*') {
        value *= nextValue;
      } else {
        if (nextValue === 0) {
          throw new Error('Cannot divide by zero');
        }

        value /= nextValue;
      }
    }

    return value;
  }

  // Handles numbers, negative numbers, and parentheses.
  function parseFactor() {
    const current = expression[position];

    // Support unary plus and minus, such as -5 or -(2 + 3).
    if (current === '+' || current === '-') {
      position++;
      const value = parseFactor();
      return current === '-' ? -value : value;
    }

    // Read a parenthesized expression.
    if (current === '(') {
      position++;

      const value = parseExpression();

      if (expression[position] !== ')') {
        throw new Error('Missing closing parenthesis');
      }

      position++;
      return value;
    }

    // Read a decimal number, such as 12, 3.5, or .75.
    const remaining = expression.slice(position);
    const match = remaining.match(/^(?:\d+\.?\d*|\.\d+)/);

    if (!match) {
      throw new Error('Invalid expression');
    }

    position += match[0].length;
    return Number(match[0]);
  }

  if (expression.length === 0) {
    throw new Error('Expression is empty');
  }

  const answer = parseExpression();

  // Reject leftover characters or incomplete expressions.
  if (position !== expression.length) {
    throw new Error('Invalid expression');
  }

  if (!Number.isFinite(answer)) {
    throw new Error('Result is not finite');
  }

  return answer;
}
