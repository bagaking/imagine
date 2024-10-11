chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展已安装");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("扩展已启动");
});

// 在标签页激活时执行
chrome.tabs.onActivated.addListener((activeInfo) => {
  //   executeScriptInTab(activeInfo.tabId);
});

// 在标签页更新时执行
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // executeScriptInTab(tabId);
  }
});

// 执行脚本的通用函数
function executeScriptInTab(tabId: number) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url && tab.url.startsWith("http")) {
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ["content.js"],
        })
        .then(() => {
          console.log("内容脚本已注入");
        })
        .catch((error) => {
          console.error("注入内容脚本时出错:", error);
        });
    }
  });
}

console.log("Background script loaded");
