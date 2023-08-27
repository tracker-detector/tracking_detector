import { Model } from "./Model";
import { FeatureExtractor } from "./FeatureExtractor";
import { StatsListener } from "./StatsListener";
import { EventManager } from "./EventManager";
import { Whitelist } from "./Whitelist";
const RequestBlocker = (async () => {
  let model = await Model(StatsListener.getModelUri());
  EventManager.subscribe("NewModelUri", (modelUri) => {
    Model(modelUri).then((newModel) => {
      model = newModel;
    });
  });
  return {
    check(request) {
      let encoding = FeatureExtractor.encode(request);

      let result = model.predict(encoding);

      const values = result.dataSync();
      const arr = Array.from(values);
      if (Whitelist.isWhitelisted(request.url)) {
        return { predict: arr[0], blocked: false };
      }
      return { predict: arr[0], blocked: arr[0] >= StatsListener.getRate() };
    },
  };
})();

export { RequestBlocker };
