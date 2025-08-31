// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true, savedSummaries: [] });
});

// Handle summarization requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request);
  // Keep the message channel open for async response
  let isResponseAsync = false;
  if (request.action === 'summarize') {
    handleSummarization(request.text)
      .then(summary => sendResponse({ success: true, summary }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }

  if (request.action === 'saveSummary') {
    handleSaveSummary(request.summary, request.url, request.title)
      .then(result => sendResponse({ success: true, ...result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'deleteSummary') {
    handleDeleteSummary(request.id)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleSummarization(text) {
  // Get API key
  const result = await chrome.storage.local.get(['openai_api_key']);
  const apiKey = result.openai_api_key;

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set it in the extension popup.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text concisely and accurately."
          },
          {
            role: "user",
            content: `Please summarize the following text in a clear and concise way:\n\n${text}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get summary from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
}

async function handleSaveSummary(summary, url, title) {
  const { savedSummaries = [] } = await chrome.storage.local.get(['savedSummaries']);
  const newSummary = {
    id: Date.now().toString(),
    summary,
    url,
    title,
    date: new Date().toISOString()
  };
  
  const updatedSummaries = [newSummary, ...savedSummaries];
  await chrome.storage.local.set({ savedSummaries: updatedSummaries });
  return { id: newSummary.id, summaries: updatedSummaries };
}

async function handleDeleteSummary(id) {
  const { savedSummaries = [] } = await chrome.storage.local.get(['savedSummaries']);
  const updatedSummaries = savedSummaries.filter(summary => summary.id !== id);
  await chrome.storage.local.set({ savedSummaries: updatedSummaries });
  return updatedSummaries;
}