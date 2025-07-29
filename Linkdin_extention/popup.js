const profileUrls = [
  "https://www.linkedin.com/in/debkumar-mallick-542119249/",
  "https://www.linkedin.com/in/rohan-roy-9847aa164/",
  "https://www.linkedin.com/in/sagarkumar9525/"
];

document.getElementById('startBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "startScraping", urls: profileUrls });
});
