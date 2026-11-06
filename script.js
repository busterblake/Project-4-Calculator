const display = document.querySelector("#display");
const buttons = document.querySelectorAll(".calculator-buttons button");

let firstNumber = 0;
let operator = "";
let newNumber = true;

function calculate(secondNumber) {
  switch (operator) {
    case "+":
      return firstNumber + secondNumber;
    case "-":
      return firstNumber - secondNumber;
    case "*":
      return firstNumber * secondNumber;
    case "/":
      return firstNumber / secondNumber;
  }
}

function pressButton(key) {
  if (key === "C") {
    display.value = "0";
    firstNumber = 0;
    operator = "";
    newNumber = true;
    return;
  }

  if (key === "Backspace") {
    if (!newNumber) {
      display.value = display.value.slice(0, -1) || "0";
    }
    return;
  }

  if ("0123456789".includes(key)) {
    if (newNumber || display.value === "0") {
      display.value = key;
    } else {
      display.value += key;
    }
    newNumber = false;
    return;
  }

  if (display.value === "Error" || (key === "=" && (!operator || newNumber))) {
    return;
  }

  if (operator && !newNumber) {
    const result = calculate(Number(display.value));
    display.value = Number.isFinite(result) ? result : "Error";
  }

  firstNumber = Number(display.value);
  operator = key === "=" || display.value === "Error" ? "" : key;
  newNumber = true;
}

for (const button of buttons) {
  button.addEventListener("click", () => pressButton(button.dataset.key));
}
