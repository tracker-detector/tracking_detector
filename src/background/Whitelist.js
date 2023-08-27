const Whitelist = (() => {
  const defaultWhitelist = { "tracking-detector-gym.de": "" };
  let whitelist = defaultWhitelist;
  setInterval(() => {
    browser.storage.local.get("whitelist").then((data) => {
      if (data == undefined || data == null || data.whitelist == null) {
        browser.storage.local.set({
          whitelist: defaultWhitelist,
        });
      } else {
        whitelist = data.whitelist;
      }
    });
  }, 200);
  return {
    isWhitelisted(url) {
      let host = new URL(url).hostname;
      return whitelist[host] != undefined;
    },
  };
})();
export { Whitelist };
