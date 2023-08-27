<template>
  <div>
    <br />
    <h1>Whitelist</h1>
    <br />
    <p class="text-subtitle-1 blocksatz">
      Here you can add domains to whitelist. These domains wont get blocked.
    </p>
    <v-card class="pa-3 mt-3 mb-3">
      <v-text-field v-model="url" clearable label="New Domain"></v-text-field>
      <v-btn @click="addHost">Add</v-btn>
    </v-card>

    <v-list dense nav class="mt-3">
      <v-list-item v-for="host in Object.keys(whiteList)" :key="host">
        <v-list-item-title>{{ host }}</v-list-item-title>
        <v-list-item-action>
          <v-btn icon @click="removeHost(host)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="js">
export default {
    data: () => ({
        whiteList: {},
        url: ""
    }),
    mounted: function () {
        browser.storage.local.get("whitelist").then((data) => {
            if (data == undefined || data.whitelist == undefined) {
                return
            } else {
                this.whiteList = data.whitelist
            }
        });
    },
    methods: {
        getWhitelist() {
            browser.storage.local.get("whitelist").then((data) => {
                if (data == undefined || data.whitelist == undefined) {
                    return
                } else {
                    this.whiteList = data.whitelist
                }
            });
        },
        addHost() {
            let hostname = ""
            try {
                hostname = (new URL(this.url)).hostname
            } catch {
                hostname = this.url;
            }
            this.whiteList[hostname] = ""
            browser.storage.local.set({ whitelist: this.whiteList })
            this.url = ""
            this.getWhitelist()
        },
        removeHost(host) {
            delete this.whiteList[host]
            browser.storage.local.set({ whitelist: this.whiteList })
            this.getWhitelist()
        }
    },
};
</script>
