// Required for manifest v3. Can be left empty unless you add more functionality.
let urlsToVisit = [];
let currentIndex = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startScraping") {
    urlsToVisit = message.urls;
    currentIndex = 0;
    openNextProfile();
  }
});

function openNextProfile() {
  if (currentIndex < urlsToVisit.length) {
    chrome.tabs.create({ url: urlsToVisit[currentIndex] }, (tab) => {
      const tabId = tab.id;

      // Listen for tab to finish loading
      chrome.tabs.onUpdated.addListener(function listener(id, changeInfo) {
        if (id === tabId && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          // Inject content script to scrape profile
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }, () => {
            // Send message to content.js to scrape
            chrome.tabs.sendMessage(tabId, { type: "scrapeProfile" });
          });
        }
      });
    });
  } else {
    console.log("All profiles processed.");
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "profileData") {
    console.log("Received profile data:", message.data);

    // POST to backend server
    fetch("http://localhost:3000/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.data)
    })
      .then(res => res.json())
      .then(response => console.log("Data saved to backend:", response))
      .catch(err => console.error("Error saving to backend:", err));

    // Close current tab and open next profile
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
    }
    currentIndex++;
    openNextProfile();
  }
});
