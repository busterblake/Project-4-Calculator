"use strict";

const display = document.querySelector("#display");
const keypad = document.querySelector(".calculator-buttons");
const keys = new Set(Array.from(keypad.querySelectorAll("button"), (button) => button.dataset.key));
const maxEntryDigits = 12;

let entry = "0";
let total = 0;
let operator = null;
let replaceEntry = false;

function calculate(left, operation, right) {
  switch (operation) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
  }
}

function formatResult(result) {
  if (!Number.isFinite(result)) {
    return "Error";
  }

  const rounded = Number(result.toPrecision(maxEntryDigits));
  const formatted = String(rounded);
  return formatted.length > 14 ? rounded.toExponential(8) : formatted;
}

function handleOperator(key) {
  if (entry === "Error" || (key === "=" && (!operator || replaceEntry))) {
    return;
  }

  if (operator && !replaceEntry) {
    total = calculate(total, operator, Number(entry));
    entry = formatResult(total);
  } else if (!operator && !replaceEntry) {
    total = Number(entry);
  }

  operator = key === "=" || entry === "Error" ? null : key;
  replaceEntry = true;
}

function pressKey(key) {
  if (key === "Escape") {
    entry = "0";
    total = 0;
    operator = null;
    replaceEntry = false;
  } else if (key === "Backspace") {
    if (!replaceEntry) {
      entry = entry.slice(0, -1) || "0";
    }
  } else if (/^\d$/.test(key)) {
    if (replaceEntry || entry === "0") {
      entry = key;
      replaceEntry = false;
    } else if (entry.length < maxEntryDigits) {
      entry += key;
    }
  } else {
    handleOperator(key);
  }

  display.value = entry;
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-key]");
  if (button) {
    pressKey(button.dataset.key);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  // Enter should still activate the focused key when tabbing through the keypad.
  if (event.key === "Enter" && keypad.contains(event.target)) {
    return;
  }

  const key = event.key === "Enter" ? "=" : event.key;
  if (keys.has(key)) {
    event.preventDefault();
    pressKey(key);
  }
});
