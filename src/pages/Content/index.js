console.log('Text Extractor: Content script loaded');

// Initialize button and dialog
let isEnabled = true;
let dialog = null;
let isSummarizing = false;

// Create and add the floating button
function createButton() {
  console.log('Text Extractor: Creating button');
  const button = document.createElement('button');
  button.id = 'text-extractor-button';
  button.innerHTML = '📄';
  button.title = 'Extract & Summarize Text';
  
  const buttonStyles = {
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    zIndex: '2147483647',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    padding: '0',
    margin: '0',
    outline: 'none'
  };

  Object.assign(button.style, buttonStyles);
  
  document.body.appendChild(button);
  console.log('Text Extractor: Button created');
  
  button.addEventListener('click', showDialog);
  return button;
}

// Create and show dialog with page text
async function showDialog() {
  console.log('Text Extractor: Showing dialog');
  if (dialog) {
    dialog.remove();
    dialog = null;
    return;
  }

  dialog = document.createElement('div');
  const dialogStyles = {
    position: 'fixed',
    right: '80px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '400px',
    maxHeight: '80vh',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: '2147483646',
    overflowY: 'auto',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#333'
  };
  Object.assign(dialog.style, dialogStyles);
  
  const closeBtn = document.createElement('button');
  const closeBtnStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  Object.assign(closeBtn.style, closeBtnStyles);
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => dialog.remove();
  
  const title = document.createElement('h3');
  const titleStyles = {
    marginTop: '0',
    marginBottom: '15px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold'
  };
  Object.assign(title.style, titleStyles);
  title.textContent = 'Extracted Text & Summary';

  const extractedText = document.body.innerText;
  
  // Create tabs
  const tabContainer = document.createElement('div');
  const tabContainerStyles = {
    display: 'flex',
    marginBottom: '15px',
    borderBottom: '1px solid #ddd'
  };
  Object.assign(tabContainer.style, tabContainerStyles);

  const createTab = (text, isActive = false) => {
    const tab = document.createElement('button');
    const tabStyles = {
      padding: '8px 16px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      color: isActive ? '#4285f4' : '#666',
      borderBottom: isActive ? '2px solid #4285f4' : 'none',
      marginBottom: '-1px'
    };
    Object.assign(tab.style, tabStyles);
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
  const loadingStyles = {
    display: 'none',
    backgroundColor: '#e8f0fe',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#1a73e8',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };
  Object.assign(loadingIndicator.style, loadingStyles);
  
  // Add loading spinner
  const spinner = document.createElement('div');
  const spinnerStyles = {
    width: '16px',
    height: '16px',
    border: '2px solid #1a73e8',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };
  Object.assign(spinner.style, spinnerStyles);
  
  // Add loading text
  const loadingText = document.createElement('span');
  loadingText.textContent = 'AI is analyzing the text and generating a summary...';
  
  // Add keyframes for spinner animation
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
  
  loadingIndicator.appendChild(spinner);
  loadingIndicator.appendChild(loadingText);

  // Error message
  const errorMessage = document.createElement('div');
  const errorStyles = {
    display: 'none',
    color: '#dc3545',
    padding: '10px',
    marginTop: '10px',
    fontSize: '12px'
  };
  Object.assign(errorMessage.style, errorStyles);

  // Copy button
  const copyButton = document.createElement('button');
  const copyButtonStyles = {
    position: 'absolute',
    top: '10px',
    right: '40px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  Object.assign(copyButton.style, copyButtonStyles);
  copyButton.innerHTML = '📋';
  copyButton.title = 'Copy to clipboard';

  let currentContent = extractedText;
  copyButton.onclick = () => {
    navigator.clipboard.writeText(currentContent);
    copyButton.innerHTML = '✓';
    setTimeout(() => {
      copyButton.innerHTML = '📋';
    }, 2000);
  };

  // Tab switching logic
  fullTextTab.onclick = () => {
    fullTextTab.style.color = '#4285f4';
    fullTextTab.style.borderBottom = '2px solid #4285f4';
    summaryTab.style.color = '#666';
    summaryTab.style.borderBottom = 'none';
    fullTextContent.style.display = 'block';
    summaryContent.style.display = 'none';
    currentContent = extractedText;
  };

  summaryTab.onclick = async () => {
    fullTextContent.style.display = 'none';
    summaryContent.style.display = 'block';
    
    if (!summaryContent.textContent && !isSummarizing) {
      isSummarizing = true;
      summaryContent.innerHTML = '';
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
          const summaryText = document.createElement('div');
          Object.assign(summaryText.style, {
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333'
          });
          summaryText.textContent = response.summary;
          summaryContent.appendChild(summaryText);
          currentContent = response.summary;
          
          // Add action buttons
          const actionContainer = document.createElement('div');
          Object.assign(actionContainer.style, {
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            justifyContent: 'flex-end'
          });

          const saveButton = document.createElement('button');
          Object.assign(saveButton.style, {
            padding: '8px 16px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          });
          saveButton.innerHTML = '💾 Save Summary';
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
                Object.assign(saveButton.style, {
                  backgroundColor: '#28a745',
                  cursor: 'default'
                });
              }
            } catch (error) {
              console.error('Failed to save summary:', error);
            }
          };

          const shareButton = document.createElement('button');
          Object.assign(shareButton.style, {
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          });
          shareButton.innerHTML = '📤 Share';
          shareButton.onclick = async () => {
            try {
              await navigator.clipboard.writeText(response.summary);
              shareButton.innerHTML = '✓ Copied';
              setTimeout(() => {
                shareButton.innerHTML = '📤 Share';
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
        summaryContent.style.display = 'block';
        isSummarizing = false;
      }
    }

    fullTextTab.style.color = '#666';
    fullTextTab.style.borderBottom = 'none';
    summaryTab.style.color = '#4285f4';
    summaryTab.style.borderBottom = '2px solid #4285f4';
    fullTextContent.style.display = 'none';
    summaryContent.style.display = 'block';
  };

  dialog.appendChild(closeBtn);
  dialog.appendChild(copyButton);
  dialog.appendChild(title);
  dialog.appendChild(tabContainer);
  dialog.appendChild(fullTextContent);
  dialog.appendChild(summaryContent);
  dialog.appendChild(loadingIndicator);
  dialog.appendChild(errorMessage);
  document.body.appendChild(dialog);
}

// Listen for enable/disable messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Text Extractor: Received message', request);
  if (request.action === 'toggleExtension') {
    isEnabled = request.enabled;
    const existingButton = document.getElementById('text-extractor-button');
    if (isEnabled && !existingButton) {
      createButton();
    } else if (!isEnabled && existingButton) {
      existingButton.remove();
      if (dialog) dialog.remove();
    }
    sendResponse({ success: true });
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