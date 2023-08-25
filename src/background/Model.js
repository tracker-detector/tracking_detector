import * as tf from "@tensorflow/tfjs";

const Model = async (modelUri) => {
  const model = await tf.loadLayersModel(modelUri);
  return {
    predict(features) {
      return model.predict(features);
    },
  };
};

export { Model };
