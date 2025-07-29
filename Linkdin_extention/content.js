chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "scrapeProfile") {
    
    // Helper to wait for an element selector to appear (timeout 10 sec for example)
    function waitForElement(selector, timeout = 10000) {
      return new Promise((resolve) => {
        const intervalTime = 100;
        let timeElapsed = 0;
        const interval = setInterval(() => {
          const el = document.querySelector(selector);
          if (el) {
            clearInterval(interval);
            resolve(el);
          } else if (timeElapsed > timeout) {
            clearInterval(interval);
            resolve(null);
          }
          timeElapsed += intervalTime;
        }, intervalTime);
      });
    }

    // Helper sleep function to wait fixed time in ms
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Wait for critical element(s) to ensure page loaded (e.g. name)
    const nameElem = await waitForElement('h1.inline.t-24.break-words');
    
    // Wait at least 3 seconds (3000 ms) before scraping to ensure full load
    await sleep(3000);

    // Now safely scrape the various fields

    const name = nameElem?.innerText.trim() || "";

    const location = document.querySelector('.text-body-small.inline.t-black--light.break-words')?.innerText.trim() || "";

    const aboutElem = await waitForElement('div.KZpoURgJIBLUFqRJwxbsiSDzWwwvkhySSsdXM span[aria-hidden="true"]');
    const about = aboutElem?.innerText.trim() || "";

    const bioLine = document.querySelector('.text-body-medium.break-words')?.innerText.trim() || "";

    const ulElem = document.querySelector('ul.epKNBpquzOJjQYicnsJUNFunDoKIQJQ') || document.querySelector('ul');

    let followerCount = "";
    let connectionCount = "";

    if (ulElem) {
      let followersSpan = ulElem.querySelector('li.text-body-small.t-black--light.inline-block a span.t-bold');
      if (!followersSpan) {
        followersSpan = ulElem.querySelector('li:nth-child(1) > span.t-bold');
      }
      followerCount = followersSpan ? followersSpan.innerText.trim() : "";

      let connectionsSpan = ulElem.querySelector('li.text-body-small:nth-child(2) a span span.t-bold');
      if (!connectionsSpan) {
        connectionsSpan = ulElem.querySelector('li:nth-child(2) > span > span.t-bold');
      }
      connectionCount = connectionsSpan ? connectionsSpan.innerText.trim() : "";
    }

    const url = window.location.href;

    // Send the scraped data back to background script
    chrome.runtime.sendMessage({
      type: "profileData",
      data: {
        name,
        url,
        about,
        bio: bioLine,
        location,
        followerCount,
        connectionCount,
        bioLine,
      },
    });
  }
});
