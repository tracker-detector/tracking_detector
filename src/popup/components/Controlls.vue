<template>
  <div>
    <div style="padding: 0 16px 0 16px">
      <div class="mt-3">
        <div class="text-subtitle-1">Active Model</div>
        <v-select
          class="mt-1"
          color="deep-purple accent-4"
          item-color="deep-purple accent-4"
          :items="models.map((x) => x.name)"
          v-model="activeModelName"
          @change="onModelChange"
          solo
          dense
        ></v-select>
      </div>
      <div class="d-flex flex-row align-center justify-space-between">
        <div class="text-subtitle-1">Blocking is active</div>
        <v-switch
          v-model="settings.active"
          color="deep-purple accent-4"
          style="height: 30px"
          @change="onSettingsChanged"
        ></v-switch>
      </div>
      <div class="mt-3">
        <div class="text-subtitle-1">Blocking sensitivity</div>
        <v-slider
          v-model="settings.rate"
          color="deep-purple accent-4"
          track-color="deep-purple accent-1"
          :min="0"
          :max="100"
          class="align-center mt-3"
          @change="onSettingsChanged"
        >
          <template v-slot:append>
            <p>{{ settings.rate / 100 }}</p>
          </template>
        </v-slider>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    settings: {
      active: true,
      rate: 80,
      modelUri: undefined,
    },
    activeModelName: "Default",
    models: [],
  }),
  mounted: function () {
    browser.storage.local.get("settings").then((data) => {
      if (data == undefined) {
        return;
      } else {
        this.settings = {
          active: data.settings.active,
          rate: data.settings.rate * 100,
          modelUri: data.settings.modelUri,
        };
        this.activeModelName = this.determineActiveModelName(
          this.settings.modelUri
        );
      }
    });
    fetch("https://tracking-detector-gym.de/api/transfer/models")
      .then((respone) => {
        return respone.json();
      })
      .then((body) => {
        const modelNames = Object.keys(body);
        const zippedModels = modelNames
          .map((name) => {
            return Object.keys(body[name])
              .filter((zip) => !zip.startsWith(name))
              .map((dataset) => ({
                name: name + "_" + dataset,
                url: `https://tracking-detector-gym.de/api/transfer/models/${name}/${dataset}/model.json`,
              }));
          })
          .flat();
        zippedModels.push({
          name: "Default",
          url: browser.runtime.getURL("model/model.json"),
        });
        this.models = zippedModels;
      });
  },
  methods: {
    onSettingsChanged() {
      browser.storage.local.set({
        settings: {
          active: this.settings.active,
          rate: this.settings.rate / 100,
          modelUri: this.settings.modelUri,
        },
      });
    },
    determineActiveModelName(uri) {
      const regex =
        /https:\/\/tracking-detector-gym\.de\/api\/transfer\/models\/([^\/]+)\/([^\/]+)\/model\.json/;
      const match = uri.match(regex);

      if (match && match.length === 3) {
        return `${match[1]}_${match[2]}`;
      } else {
        return "Default";
      }
    },
    onModelChange() {
      console.log(this.settings);
      const newActive = this.models.find((x) => x.name == this.activeModelName);
      this.settings.modelUri = newActive.url;
      console.log(this.settings);
      this.onSettingsChanged();
    },
  },
};
</script>
