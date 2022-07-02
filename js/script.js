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

  function canCalculate() {
    if (number1 === '.' || number2 === '.') {
      return false;
    }
    if (number1.length < 1 || number2.length < 1) {
      return false;
    }
    return true;
  }

  function equalClick(/* evt */) {
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

    const number = evt.target.value;
    //const checkFormat = (num)=> (number === "." && num.indexOf(".") > 0)
    if (operator === '') {
      if (number === '.' && number1.indexOf('.') > 0) {
        return;
      }
      number1 += number;
      printValue(number1);
      return;
    }
    if (number === '.' && number2.indexOf('.') > 0) {
      return;
    }
    number2 += number;
    printValue(number2);
    printOperation();
  }

  function operatorClick(evt) {
    operator = evt.target.value;
    number1 && printOperation();
  }

  function printValue(value) {
    screenNumber.innerHTML = value;
  }

  function printOperation() {
    let operation = !!operator ? `${number1} ${operator}` : '';
    !!number2 && (operation += ` ${number2} = `);
    screenOperation.innerHTML = operation;
  }

  function clearScreen(all = true) {
    screenNumber.innerHTML = '';
    all && (screenOperation.innerHTML = '');
  }
})();
