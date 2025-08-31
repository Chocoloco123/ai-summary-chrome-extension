import React, { useState, useEffect } from 'react';
import './Popup.css';
import './index.css';

const Popup = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [savedSummaries, setSavedSummaries] = useState([]);

  useEffect(() => {
    // Get initial states
    chrome.storage.local.get(['enabled', 'openai_api_key', 'savedSummaries'], (result) => {
      setIsEnabled(result.enabled !== false);
      setIsApiKeySet(!!result.openai_api_key);
      setApiKey(result.openai_api_key || '');
      setSavedSummaries(result.savedSummaries || []);
    });

    // Listen for changes to saved summaries
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.savedSummaries) {
        setSavedSummaries(changes.savedSummaries.newValue || []);
      }
    });
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    chrome.storage.local.set({ enabled: newState });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleExtension',
          enabled: newState
        });
      }
    });
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API key');
      return;
    }
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
      setIsApiKeySet(true);
      setIsEditing(false);
      setShowApiKey(false);
      setMessage('API key saved successfully');
      setTimeout(() => setMessage(''), 3000);
    });
  };

  const handleApiKeyDelete = () => {
    chrome.storage.local.remove('openai_api_key', () => {
      setApiKey('');
      setIsApiKeySet(false);
      setMessage('API key removed');
      setTimeout(() => setMessage(''), 3000);
    });
  };

  return (
    <div className="App">
      <div>
        <h1 className="title">Text Extractor & Summarizer</h1>
      </div>
      
      {/* Extension Toggle */}
      <div className="section flex-row space-between">
        <span className="text-regular">Extension Status</span>
        <div className="flex-row">
          <span className={`text-regular ${isEnabled ? 'text-success' : 'text-muted'}`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <label className="toggle-switch">
            <span className="visually-hidden">Enable extension</span>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              aria-label="Enable extension"
            />
            <span className="toggle-slider" role="presentation"></span>
          </label>
        </div>
      </div>

      {/* API Key Management */}
      <div className="section">
        <div className="section-header">
          <span className="text-regular">OpenAI API Key</span>
          <div className="button-container">
            {isApiKeySet && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Key
              </button>
            )}
            {isApiKeySet && (
              <button
                onClick={handleApiKeyDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {(!isApiKeySet || isEditing) ? (
          <div>
                          <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="input-field"
                aria-label="OpenAI API Key"
                id="api-key-input"
              />
            <div className="flex-row space-between">
              <label className="text-small flex-row">
                <input
                  type="checkbox"
                  checked={showApiKey}
                  onChange={() => setShowApiKey(!showApiKey)}
                />
                Show Key
              </label>
              <div className="button-container">
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      chrome.storage.local.get(['openai_api_key'], (result) => {
                        setApiKey(result.openai_api_key || '');
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleApiKeySubmit}
                  className="btn btn-primary"
                  aria-label="Save API key"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-success flex-row">
            <span>✓</span>
            API key is set and ready to use
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* Saved Summaries */}
      <div className="section">
        <div className="section-header">
          <span className="text-regular">Saved Summaries</span>
        </div>
        <div className="summaries-section">
          {savedSummaries.length > 0 ? (
            savedSummaries.map((summary) => (
              <div key={summary.id} className="summary-card">
                <div className="summary-header">
                  <a
                    href={summary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="summary-title"
                  >
                    {summary.title || 'Untitled Page'}
                  </a>
                </div>
                <div className="summary-date">
                  {new Date(summary.date).toLocaleDateString()}
                </div>
                <div className="summary-content">
                  {summary.summary}
                </div>
                <div className="summary-actions">
                  <div className="button-container">
                    <button
                      className="btn btn-secondary"
                      onClick={async () => {
                        await navigator.clipboard.writeText(summary.summary);
                        setMessage('Summary copied to clipboard');
                        setTimeout(() => setMessage(''), 2000);
                      }}
                    >
                      📋 Copy
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        await chrome.runtime.sendMessage({
                          action: 'deleteSummary',
                          id: summary.id
                        });
                        setMessage('Summary deleted');
                        setTimeout(() => setMessage(''), 2000);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-summaries">
              No saved summaries yet. Use the extension on any webpage to create summaries.
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="section instructions">
        <div className="instructions-container">
          <p className="text-regular instructions-title">How to use:</p>
          <ol className="text-regular">
            <li>Enable the extension and add your OpenAI API key</li>
            <li>Visit any webpage and click the floating button (📄)</li>
            <li>View extracted text and AI-generated summary</li>
            <li>Use 'Save' to store summaries locally or 'Share' to copy to clipboard</li>
          </ol>
        </div>
        
        <div className="storage-notice">
          <p>
            <span className="storage-notice-icon">ℹ️</span>
            <span>
              <strong>Note:</strong> Summaries are stored in your local browser storage. 
              They will persist until you delete them or clear your browser data, but are not synced across devices.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Popup;