(function () {
  'use strict';

  const screenOperation = document.querySelector('.screen .operation');
  const screenNumber = document.querySelector('.screen .number');

  // ================= Add Events =====================
  document.querySelector('button.reset').addEventListener('click', resetClick);
  document.querySelector('button.equal').addEventListener('click', equalClick);
  document.querySelectorAll('button.number').forEach((elem) => {
    elem.addEventListener('click', numberClick);
  });
  document.querySelectorAll('button.operator').forEach((elem) => {
    elem.addEventListener('click', operatorClick);
  });
  document.querySelector('button.delete').addEventListener('click', deleteClick);
  document.querySelector('.toggle .theme1').addEventListener('click', () => setTheme(1));
  document.querySelector('.toggle .theme2').addEventListener('click', () => setTheme(2));
  document.querySelector('.toggle .theme3').addEventListener('click', () => setTheme(3));

  document.addEventListener('keydown', (evt) => {
    const numbersKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ','];
    const operatorsKeys = ['+', '-', '*', '/'];
    const actionsKeys = ['Delete', 'Enter', 'Escape'];
    const validKeys = [...numbersKeys, ...operatorsKeys, ...actionsKeys];
    const key = evt.key;

    if (validKeys.indexOf(key) < 0) {
      return;
    }

    key === 'Delete' && deleteClick();
    key === 'Escape' && resetClick();
    key === 'Enter' && equalClick();

    for (let num of numbersKeys) {
      key === num && numberClick({ target: { value: num } });
    }

    for (let oper of operatorsKeys) {
      key === oper && operatorClick({ target: { value: oper } });
    }
  });

  // ================= Theme functions =====================
  function setTheme(theme) {
    const body = document.querySelector('body');
    const indicators = document.querySelectorAll('.toggle .toggle-indicator');
    indicators.forEach((elem, idx) => {
      elem.classList.add('d-none');
      idx === theme - 1 && elem.classList.remove('d-none');
    });

    body.classList.remove('theme-1', 'theme-2', 'theme-3');
    body.classList.add(`theme-${theme}`);
  }

  // ================= Calculator functions ================
  let number1 = '';
  let number2 = '';
  let operator = '';
  let result = 0;

  function resetClick(/* evt */) {
    number1 = '';
    number2 = '';
    operator = '';
    result = 0;
    clearScreen();
  }

  function deleteClick(/* evt */) {
    if (operator === '') {
      number1 = number1.slice(0, -1);
      printValue(number1);
    } else {
      number2 = number2.slice(0, -1);
      printValue(number2);
    }
    printOperation();
  }

  function equalClick(/* evt */) {
    const canCalculate = () => isNumeric(number1) && isNumeric(number2);
    if (!canCalculate()) {
      return;
    }
    const n1 = parseFloat(number1);
    const n2 = parseFloat(number2);

    operator === '+' && (result = n1 + n2);
    operator === '-' && (result = n1 - n2);
    operator === '*' && (result = n1 * n2);
    operator === '/' && (result = n1 / n2);

    operator = '';
    number1 = '';
    number2 = '';
    result = Math.round((result + Number.EPSILON) * 100) / 100;

    printValue(result);
  }

  function numberClick(evt) {
    if (result) {
      clearScreen();
      result = 0;
    }

    let value = evt.target.value;
    value === ',' && (value = '.');

    if (operator === '') {
      if (value === '.' && number1.indexOf('.') > 0) {
        return;
      }
      number1 += value;
      printValue(number1);
      return;
    }
    if (value === '.' && number2.indexOf('.') > 0) {
      return;
    }
    number2 += value;
    printValue(number2);
    printOperation();
  }

  function operatorClick(evt) {
    operator = evt.target.value;
    number1 && printOperation();
  }

  function printValue(value) {
    screenNumber.innerHTML = parseFloat(value).toLocaleString();
  }

  function printOperation() {
    const strOperator = operator === '*' ? 'x' : operator;
    let operation = !!operator ? `${number1} ${strOperator}` : '';
    !!number2 && (operation += ` ${number2} = `);
    screenOperation.innerHTML = operation;
  }

  function clearScreen(all = true) {
    screenNumber.innerHTML = '';
    all && (screenOperation.innerHTML = '');
  }

  function isNumeric(str) {
    str = '' + str; // converts to string
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }
})();
