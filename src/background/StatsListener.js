import { ActiveTabListener } from "./ActiveTabListener";
import { EventManager } from "./EventManager";
import { Requests } from "./Request";
const StatsListener = (() => {
  const defaultRate = 0.8;
  const defaultActive = true;
  const defaultModelUri = browser.runtime.getURL("model/model.json");

  const activeConfig = {
    rate: defaultRate,
    active: defaultActive,
    modelUri: defaultModelUri,
    apiKey: undefined,
  };
  setInterval(() => {
    browser.storage.local.get("settings").then((data) => {
      if (data == undefined || data == null || data.settings == null) {
        browser.storage.local.set({
          settings: {
            rate: defaultRate,
            active: defaultActive,
            modelUri: defaultModelUri,
            apiKey: undefined,
          },
        });
      } else {
        const shouldReload =
          data.settings.active != activeConfig.active ||
          data.settings.rate != activeConfig.rate;
        const shouldReloadModel =
          data.settings.modelUri != activeConfig.modelUri;
        activeConfig.active = data.settings.active;
        activeConfig.rate = data.settings.rate;
        activeConfig.modelUri = data.settings.modelUri;
        activeConfig.apiKey = data.settings.apiKey;

        if (shouldReload) {
          const tabId = ActiveTabListener.getCurrentTab().id;
          browser.tabs.reload(tabId, { bypassCache: true }).then(() => {
            console.log("Current tab reloaded due to config change");
          });
          Requests.refreshDataForTab(tabId);
        }
        if (shouldReloadModel) {
          EventManager.fire("NewModelUri", activeConfig.modelUri);
        }
      }
    });
  }, 200);
  return {
    isActive() {
      return activeConfig.active;
    },
    getRate() {
      return activeConfig.rate;
    },
    getModelUri() {
      return activeConfig.modelUri;
    },
    getApiKey() {
      return activeConfig.apiKey;
    },
  };
})();

export { StatsListener };
