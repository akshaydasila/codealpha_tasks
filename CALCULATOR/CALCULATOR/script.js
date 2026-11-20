const result = document.getElementById("result");
const expression = document.getElementById("expression");

const buttons = document.querySelector(".buttons");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldReset = false;
let secondOperandStarted = false;

// Update calculator display
function updateDisplay() {
  result.value = currentValue;

  if (operator !== null && previousValue !== null) {
    const symbol = getSymbol(operator);

    expression.textContent = `${previousValue} ${symbol} ${currentValue}`;

    if (secondOperandStarted) {
      const preview = calculate(
        Number(previousValue),
        Number(currentValue),
        operator,
      );

      if (preview !== null) {
        expression.textContent += ` = ${format(preview)}`;
      }
    }
  }
}

// Get operator symbol
function getSymbol(op) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  return symbols[op];
}

// Format calculation result
function format(number) {
  return String(Number(number.toFixed(10)));
}

// Perform arithmetic calculation
function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      return b === 0 ? null : a / b;

    default:
      return b;
  }
}

// Add numbers to display
function addNumber(number) {
  if (currentValue === "Error") {
    currentValue = "0";
  }

  if (shouldReset) {
    currentValue = "0";
    shouldReset = false;
  }

  if (number === "." && currentValue.includes(".")) {
    return;
  }

  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  if (operator !== null) {
    secondOperandStarted = true;
  }

  updateDisplay();
}

// Select arithmetic operator
function chooseOperator(op) {
  if (currentValue === "Error") return;

  if (operator !== null && secondOperandStarted) {
    const answer = calculate(
      Number(previousValue),
      Number(currentValue),
      operator,
    );

    if (answer === null) {
      showError();
      return;
    }

    currentValue = format(answer);
  }

  previousValue = currentValue;
  operator = op;
  shouldReset = true;
  secondOperandStarted = false;

  updateDisplay();
}

// Calculate final answer
function showResult() {
  if (operator === null || !secondOperandStarted) {
    return;
  }

  const a = Number(previousValue);
  const b = Number(currentValue);

  const answer = calculate(a, b, operator);

  if (answer === null) {
    showError();
    return;
  }

  expression.textContent = `${format(a)} ${getSymbol(operator)} ${format(b)} =`;

  currentValue = format(answer);
  previousValue = null;
  operator = null;
  shouldReset = true;
  secondOperandStarted = false;

  result.value = currentValue;
}

// Show error
function showError() {
  currentValue = "Error";
  previousValue = null;
  operator = null;
  shouldReset = true;
  secondOperandStarted = false;

  expression.textContent = "Cannot divide by zero";
  result.value = currentValue;
}

// Clear everything
function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldReset = false;
  secondOperandStarted = false;

  expression.textContent = "";
  result.value = "0";
}

// Delete last digit
function deleteNumber() {
  if (currentValue === "Error") {
    clearCalculator();
    return;
  }

  if (shouldReset) {
    return;
  }

  currentValue = currentValue.slice(0, -1);

  if (currentValue === "" || currentValue === "-") {
    currentValue = "0";
  }

  updateDisplay();
}

// Handle button clicks
buttons.addEventListener("click", function (event) {
  const button = event.target;

  if (!button.matches("button")) return;

  if (button.dataset.number !== undefined) {
    addNumber(button.dataset.number);
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  }

  if (button.dataset.action === "clear") {
    clearCalculator();
  }

  if (button.dataset.action === "delete") {
    deleteNumber();
  }

  if (button.dataset.action === "calculate") {
    showResult();
  }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    addNumber(key);
  }

  if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  }

  if (key === "Enter" || key === "=") {
    showResult();
  }

  if (key === "Backspace") {
    deleteNumber();
  }

  if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
