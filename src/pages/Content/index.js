import './content.styles.css';

console.log('Text Extractor: Content script loaded');

// Initialize button and dialog
let isEnabled = true;
let dialog = null;
let isSummarizing = false;

// Create and add the floating button
function createButton() {
  console.log('Text Extractor: Creating button');
  
  // Remove any existing buttons first
  const existingButton = document.querySelector('.text-extractor-button');
  if (existingButton) {
    existingButton.remove();
  }
  
  const button = document.createElement('button');
  button.className = 'text-extractor-button';
  button.innerHTML = '🌸';
  button.title = 'Extract & Summarize Text';
  
  button.setAttribute('aria-label', 'Extract and summarize text from page');
  
  document.body.appendChild(button);
  console.log('Text Extractor: Button created');
  
  button.addEventListener('click', showDialog);
  return button;
}

// Create and show dialog with page text
async function showDialog() {
  console.log('Text Extractor: Showing dialog');
  
  // If dialog exists, just remove it and clean up
  if (dialog) {
    dialog.remove();
    dialog = null;
    return;
  }
  
  // Clean up any orphaned dialogs
  const existingDialog = document.querySelector('.text-extractor-dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  dialog = document.createElement('div');
  dialog.className = 'text-extractor-dialog';
  
  // Add critical positioning styles
  Object.assign(dialog.style, {
    position: 'fixed',
    right: '90px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: '2147483646'
  });
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-extractor-close';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    dialog.remove();
    dialog = null;
  };
  
  const title = document.createElement('h3');
  title.textContent = 'Extracted Text & Summary';

  const extractedText = document.body.innerText;
  
  // Create tabs
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';

  const createTab = (text, isActive = false) => {
    const tab = document.createElement('button');
    tab.className = `tab ${isActive ? 'active' : ''}`;
    tab.textContent = text;
    return tab;
  };

  const fullTextTab = createTab('Full Text', true);
  const summaryTab = createTab('Summary');
  tabContainer.appendChild(fullTextTab);
  tabContainer.appendChild(summaryTab);

  // Content containers
  const fullTextContent = document.createElement('div');
  fullTextContent.className = 'content-area text-content';
  fullTextContent.textContent = extractedText;

  const summaryContent = document.createElement('div');
  summaryContent.className = 'content-area';
  summaryContent.style.display = 'none';
  
  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-container';
  loadingIndicator.style.display = 'none';
  
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  
  const loadingText = document.createElement('span');
  loadingText.className = 'loading-text';
  loadingText.textContent = 'AI is analyzing the text and generating a summary...';
  
  loadingIndicator.appendChild(spinner);
  loadingIndicator.appendChild(loadingText);

  // Error message
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.style.display = 'none';

  // Tab switching logic
  fullTextTab.onclick = () => {
    fullTextTab.className = 'tab active';
    summaryTab.className = 'tab';
    fullTextContent.style.display = 'block';
    summaryContent.style.display = 'none';
  };

  summaryTab.onclick = async () => {
    // First, switch the tabs immediately
    fullTextTab.className = 'tab';
    summaryTab.className = 'tab active';
    fullTextContent.style.display = 'none';
    summaryContent.style.display = 'block';

    // Only proceed with summarization if we haven't already and aren't currently summarizing
    if (!summaryContent.textContent && !isSummarizing) {
      isSummarizing = true;
      summaryContent.innerHTML = '';
      
      // Show loading state immediately
      loadingIndicator.style.display = 'flex';
      errorMessage.style.display = 'none';
      summaryContent.appendChild(loadingIndicator);

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'summarize',
          text: extractedText
        });

        if (response.success) {
          loadingIndicator.remove();
          
          // Create summary content container
          const summaryText = document.createElement('div');
          summaryText.className = 'text-content';
          summaryText.textContent = response.summary;
          summaryContent.appendChild(summaryText);
          
          // Add action buttons
          const actionContainer = document.createElement('div');
          actionContainer.className = 'action-container';

          // Save button
          const saveButton = document.createElement('button');
          saveButton.className = 'action-button save';
          saveButton.innerHTML = 'Save Summary';
          saveButton.onclick = async () => {
            try {
              const result = await chrome.runtime.sendMessage({
                action: 'saveSummary',
                summary: response.summary,
                url: window.location.href,
                title: document.title
              });
              if (result.success) {
                saveButton.innerHTML = '✓ Saved';
                saveButton.disabled = true;
                saveButton.classList.add('disabled');
              }
            } catch (error) {
              console.error('Failed to save summary:', error);
            }
          };

          // Share button
          const shareButton = document.createElement('button');
          shareButton.className = 'action-button share';
          shareButton.innerHTML = 'Share';
          shareButton.onclick = async () => {
            try {
              await navigator.clipboard.writeText(response.summary);
              shareButton.innerHTML = '✓ Copied';
              setTimeout(() => {
                shareButton.innerHTML = 'Share';
              }, 2000);
            } catch (error) {
              console.error('Failed to copy summary:', error);
            }
          };

          actionContainer.appendChild(saveButton);
          actionContainer.appendChild(shareButton);
          summaryContent.appendChild(actionContainer);
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
      } finally {
        loadingIndicator.style.display = 'none';
        isSummarizing = false;
      }
    }
  };

  dialog.appendChild(closeBtn);
  dialog.appendChild(title);
  dialog.appendChild(tabContainer);
  dialog.appendChild(fullTextContent);
  dialog.appendChild(summaryContent);
  dialog.appendChild(errorMessage);
  document.body.appendChild(dialog);

  // Handle clicks outside the dialog
  const handleClickOutside = (event) => {
    if (dialog && !dialog.contains(event.target) && !event.target.classList.contains('text-extractor-button')) {
      dialog.remove();
      dialog = null;
      document.removeEventListener('click', handleClickOutside);
    }
  };

  // Add click outside handler after a small delay to prevent immediate triggering
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 100);

  // Clean up on page changes
  const cleanup = () => {
    if (dialog) {
      dialog.remove();
      dialog = null;
    }
    document.removeEventListener('click', handleClickOutside);
  };

  window.addEventListener('popstate', cleanup);
  window.addEventListener('beforeunload', cleanup);
}

// Listen for enable/disable messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Text Extractor: Received message', request);
  try {
    if (request.action === 'toggleExtension') {
      isEnabled = request.enabled;
      const existingButton = document.querySelector('.text-extractor-button');
      if (isEnabled && !existingButton) {
        createButton();
      } else if (!isEnabled && existingButton) {
        existingButton.remove();
        if (dialog) dialog.remove();
      }
      sendResponse({ success: true });
    }
    return true; // Keep the message channel open for async response
  } catch (error) {
    console.error('Text Extractor: Error handling message:', error);
    sendResponse({ success: false, error: error.message });
    return true;
  }
});

// Check initial state and create button
console.log('Text Extractor: Checking initial state');
chrome.storage.local.get(['enabled'], (result) => {
  console.log('Text Extractor: Initial state', result);
  isEnabled = result.enabled !== false; // Default to enabled if not set
  if (isEnabled) {
    createButton();
  }
});