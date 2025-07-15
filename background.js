let activeDomain = null;
let lastActiveTime = Date.now();

async function trackTime() {
  if (!activeDomain) return;

  const now = Date.now();
  const seconds = Math.floor((now - lastActiveTime) / 1000);
  lastActiveTime = now;

  const data = await chrome.storage.local.get([activeDomain]);
  const current = data[activeDomain] || 0;
  await chrome.storage.local.set({ [activeDomain]: current + seconds });
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await trackTime();
  const tab = await chrome.tabs.get(tabId);
  if (tab?.url) {
    activeDomain = new URL(tab.url).hostname;
    lastActiveTime = Date.now();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    await trackTime();
    activeDomain = new URL(tab.url).hostname;
    lastActiveTime = Date.now();
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  await trackTime();
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeDomain = null;
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        activeDomain = new URL(tab.url).hostname;
        lastActiveTime = Date.now();
      }
    });
  }
});
