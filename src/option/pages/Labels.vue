<template>
  <div>
    <br />
    <h1>Labels</h1>
    <br />
    <p class="text-subtitle-1 blocksatz">
      Here you can find a request history of your most recent requests which are
      chunked in sets of hundred. You can manually label them and send them to
      our backend.
    </p>
    <v-card class="mt-3 pa-3">
      <v-text-field label="ApiKey" v-model="apiKey"></v-text-field>
      <v-btn @click="validateApiKey">Validate</v-btn>
    </v-card>
    <v-list dense nav v-if="chunkIds.length > 0 && validated" class="mt-3">
      <v-list-item
        v-for="item in chunkIds"
        :key="item"
        link
        :to="'/labels/' + item"
      >
        <v-list-item-content>
          <v-list-item-title
            >Chunk: {{ item }} | Progress
            {{ chunkProgress[item] == null ? "0" : chunkProgress[item] }}/{{
              lengths[item]
            }}</v-list-item-title
          >
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="removeProgress(item)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div
      class="d-flex flex-row-reverse mt-2"
      v-if="Object.values(chunkProgress).length > 0 && validated"
    >
      <v-btn @click="sendLabeledRequest"
        >Submit ({{
          Object.values(chunkProgress).reduce((a, b) => a + b)
        }}
        Entries)</v-btn
      >
    </div>
  </div>
</template>
<script lang="js">
export default {
  data: () => ({
    chunkIds: [],
    chunkProgress: {},
    labels: {},
    lengths: {},
    apiKey: "",
    validated: false,
    timer: undefined,
  }),
  mounted: function () {
    browser.storage.local.get("settings").then((data) => {
      console.log(data)
      if (data == undefined) {
        return;
      } else {

        this.apiKey = data.settings.apiKey
        this.validated = this.apiKey != undefined
      }
    });
    this.timer = setInterval(() => {
      browser.storage.local.get("keys").then((data) => {
        if (data.keys != undefined) {
          this.chunkIds = data.keys;
          browser.storage.local.get().then(data => {
            const lengths = {}
            this.chunkIds.map(x => {
              if (data[x]) {
                lengths[x] = data[x].length || 0
              }

            })
            this.lengths = lengths
          })

          this.chunkIds.map(x => {

            browser.storage.local.get(x + "_labels").then((data) => {
              if (data == null || data[x + "_labels"] == null) {
                return
              }
              this.labels[x] = data[x + "_labels"]
              let progress = Object.values(data[x + "_labels"]).length
              let tmp = JSON.parse(JSON.stringify(this.chunkProgress))
              tmp[x] = progress
              this.chunkProgress = tmp
            })
          })
        }
      });
    }, 200);
  },
  methods: {
    sendLabeledRequest() {
      Object.keys(this.labels).map(key => {
        browser.storage.local
          .get(key)
          .then((data) => {
            const toSend = data[key].filter(x => Object.keys(this.labels[key]).includes(x.requestId))
            const withoutSend = data[key].filter(x => !Object.keys(this.labels[key]).includes(x.requestId))
            const labeledToSend = toSend.map(request => {
              request.labels = [{
                blocklist: "human",
                isLabeled: this.labels[key][request.requestId],
              }]
              return request
            })
            fetch("https://tracking-detector-gym.de/api/requests/multiple", {
              headers: {
                "X-API-Key": "Bearer " + this.apiKey,
                "Accept": "application/json",
                "Content-Type": "application/json",
              },
              method: 'POST',
              body: JSON.stringify(labeledToSend)
            }).then(response => {
              if (response.status == 201) {
                if (withoutSend.length == 0) {
                  const updatedChunkIds = this.chunkIds.filter(x => x != key)
                  browser.storage.local.set({ keys: updatedChunkIds })
                  const objR = {}
                  objR[key] = null
                  browser.storage.local.set(objR)
                } else {
                  const obj = {}
                  obj[key] = withoutSend
                  browser.storage.local.set(obj)
                }
                const objL = {}
                objL[key + "_labels"] = null
                browser.storage.local.set(objL)
              }
            })
          });
      })

    },
    validateApiKey() {
      fetch("https://tracking-detector-gym.de/api/requests/health", {
        headers: {
          "X-API-Key": "Bearer " + this.apiKey,
        },
      }).then(response => {
        if (response.status == 200) {
          this.validated = true
          browser.storage.local.get("settings").then((data) => {
            if (data == undefined) {
              return;
            } else {
              this.validated = this.apiKey != undefined
              browser.storage.local.set({
                settings: {
                  rate: data.settings.rate,
                  active: data.settings.active,
                  modelUri: data.settings.modelUri,
                  apiKey: this.apiKey,
                },
              });
            }
          });

        }
      })
    },
    removeProgress(item) {
      const updatedChunkIds = this.chunkIds.filter(x => x != item)
      browser.storage.local.set({ keys: updatedChunkIds })
      const objR = {}
      objR[item] = null

      browser.storage.local.set(objR)
      const objL = {}
      objL[item + "_labels"] = null
      browser.storage.local.set(objL)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
