// Function to inject HTML
function injectHTML() {
  // Import Roboto Mono font
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const container = document.createElement('div');
  container.style.cssText = `
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
      z-index: 9999;
      font-family: 'Roboto Mono', monospace;
      width: 280px;
  `;
  container.innerHTML = `
      <div id="stats" style="margin-bottom: 20px; font-size: 18px;">
          <p>APM: <span id="apm" style="font-weight: bold; color: #2ecc71;">0</span></p>
          <p>Error Rate: <span id="errorRate" style="font-weight: bold; color: #e74c3c;">0%</span></p>
          <p>Words Typed: <span id="wordsTyped" style="font-weight: bold; color: #3498db;">0</span></p>
          <p>Time Elapsed: <span id="timeElapsed" style="font-weight: bold; color: #f39c12;">0s</span></p>
      </div>
      <button id="startButton" style="
          background-color: #2ecc71;
          border: none;
          color: white;
          padding: 10px 14px;
          text-align: center;
          text-decoration: none;
          display: block;
          font-size: 28px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 5px;
          width: calc(100% - 8px);
          font-family: 'Roboto Mono', monospace;
          font-weight: bold;
          transition: background-color 0.3s ease;
      ">
          Start 🚀
      </button>
  `;
  document.body.appendChild(container);

  // Add hover effect to the button
  const startButton = container.querySelector('#startButton');
  startButton.addEventListener('mouseenter', () => {
    startButton.style.backgroundColor = '#27ae60';
  });
  startButton.addEventListener('mouseleave', () => {
    startButton.style.backgroundColor = '#2ecc71';
  });
}

// Function to focus on the text input
function focusTextInput() {
  const textInput = document.getElementById('textInput');
  if (textInput) {
    textInput.focus();
    return true;
  }
  console.error('Could not find the text input element with id "textInput"');
  return false;
}

// Function to get the current word to type
function getCurrentWord() {
  const wordSpans = document.querySelectorAll('.displayText:not([id])');

  for (let wordSpan of wordSpans) {
    if (Array.from(wordSpan.children).every(child => child.classList.contains('correct'))) {
      continue;
    }

    let word = '';
    let hasActive = false;

    for (let child of wordSpan.children) {
      if (child.classList.contains('active')) {
        hasActive = true;
      }
      if (!child.classList.contains('correct')) {
        word += child.textContent;
      }
    }

    if (hasActive || word.trim() !== '') {
      return word;
    }
  }

  return '';
}

// Function to type a single character
function typeChar(char) {
  const input = document.getElementById('textInput');
  if (!input) {
    return;
  }

  const keydownEvent = new KeyboardEvent('keydown', {
    key: char,
    bubbles: true,
    code: char.length === 1 ? 'Key' + char.toUpperCase() : 'Enter',
    keyCode: char.charCodeAt(0)
  });
  input.dispatchEvent(keydownEvent);

  if (char !== '\n') {
    input.value += char;
  }

  const inputEvent = new Event('input', { bubbles: true });
  input.dispatchEvent(inputEvent);

  const keyupEvent = new KeyboardEvent('keyup', {
    key: char,
    bubbles: true,
    code: char.length === 1 ? 'Key' + char.toUpperCase() : 'Enter',
    keyCode: char.charCodeAt(0)
  });
  input.dispatchEvent(keyupEvent);

  updateStats('typeChar');
}

// Function to handle special keys
function handleSpecialKey(key) {
  const input = document.getElementById('textInput');
  if (!input) {
    return;
  }

  let code, keyCode;
  switch (key) {
    case 'Enter':
      code = 'Enter';
      keyCode = 13;
      break;
    case '=':
    case '= ':
      code = 'Equal';
      keyCode = 187;
      break;
    case '(':
    case ')':
      code = 'Bracket';
      keyCode = key === '(' ? 219 : 221;
      break;
    case '{':
    case '}':
      code = 'BracketLeft';
      keyCode = key === '{' ? 219 : 221;
      break;
    case ';':
      code = 'Semicolon';
      keyCode = 186;
      break;
    case ' ':
      code = 'Space';
      keyCode = 32;
      break;
    default:
      code = 'Key' + key.toUpperCase();
      keyCode = key.charCodeAt(0);
  }

  const keydownEvent = new KeyboardEvent('keydown', { key, code, keyCode, bubbles: true });
  input.dispatchEvent(keydownEvent);

  if (key === 'Enter') {
    input.value = '';
  } else {
    input.value += key;
  }

  const inputEvent = new Event('input', { bubbles: true });
  input.dispatchEvent(inputEvent);
  const keyupEvent = new KeyboardEvent('keyup', { key, code, keyCode, bubbles: true });
  input.dispatchEvent(keyupEvent);

  updateStats('handleSpecialKey');
}

// Statistics variables
let startTime, totalActions = 0, totalErrors = 0, wordsTyped = 0;

// Function to update statistics
function updateStats(action) {
  totalActions++;
  if (action === 'error') {
    totalErrors++;
  }
  if (action === 'word') {
    wordsTyped++;
  }

  const currentTime = new Date().getTime();
  const elapsedSeconds = (currentTime - startTime) / 1000;
  const apm = Math.round((totalActions / elapsedSeconds) * 60);
  const errorRate = totalActions > 0 ? (totalErrors / totalActions) * 100 : 0;

  document.getElementById('apm').textContent = apm;
  document.getElementById('errorRate').textContent = errorRate.toFixed(2) + '%';
  document.getElementById('wordsTyped').textContent = wordsTyped;
  document.getElementById('timeElapsed').textContent = Math.round(elapsedSeconds) + 's';
}

// Main typing function
async function autoType(speed = 5) {
  let attemptCount = 0;
  const maxAttempts = 100000;
  let previousWord = '';

  while (attemptCount < maxAttempts) {
    const currentWord = getCurrentWord();
    if (!currentWord) {
      break;
    }

    for (let i = 0; i < currentWord.length; i++) {
      const char = currentWord[i];
      if (char === '\n') {
        handleSpecialKey('Enter');
      } else if ('=(){};-\t '.includes(char)) {
        handleSpecialKey(char);
      } else {
        typeChar(char);
      }

      await new Promise(resolve => setTimeout(resolve, speed));
    }

    if (!currentWord.endsWith('\n')) {
      handleSpecialKey(' ');
    }

    previousWord = currentWord;
    updateStats('word');
    await new Promise(resolve => setTimeout(resolve, speed));
    attemptCount++;
  }

  if (attemptCount >= maxAttempts) {
    console.warn('Maximum typing attempts reached. Stopping auto-type.');
  }
}

// Function to initialize the auto-typer
function initAutoTyper() {
  injectHTML();
  document.getElementById('startButton').addEventListener('click', function () {
    if (focusTextInput()) {
      startTime = new Date().getTime();
      totalActions = 0;
      totalErrors = 0;
      wordsTyped = 0;
      try {
        autoType(0); // Adjust speed as needed (milliseconds between keystrokes)
      } catch (error) {
        console.error('An error occurred during auto-typing:', error);
        updateStats('error');
      }
    } else {
      console.error('Could not focus on the text input');
    }
  });
}

// Run the initialization function
initAutoTyper();