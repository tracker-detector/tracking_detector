<template>
  <div>
    <v-app
      style="
        width: 390px;
        max-height: 530px !important;
        min-height: 530px !important;
      "
    >
      <Home
        v-if="currentPage == 0"
        :url="url"
        :faviconUrl="faviconUrl"
        :requests="requests"
      />
      <div
        v-else-if="currentPage == 1"
        style="overflow-x: scroll; height: 100%"
      >
        <Tracker :requests="requests" />
      </div>
      <div
        v-else-if="currentPage == 2"
        style="overflow-x: scroll; height: 100%"
      >
        <Requests :requests="requests" />
      </div>
      <v-bottom-navigation
        fixed
        class="grad"
        v-model="currentPage"
        :background-color="purple"
        horizontal
      >
        <v-btn color="deep-purple accent-4" text>
          <span>Home</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn color="deep-purple accent-4" text>
          <span>Tracker</span>
          <v-icon>mdi-bug</v-icon>
        </v-btn>
        <v-btn color="deep-purple accent-4" text>
          <span>Requests</span>
          <v-icon>mdi-web</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </div>
</template>
<script>
import Home from "./pages/Home.vue";
import Tracker from "./pages/Tracker.vue";
import Requests from "./pages/Requests.vue";

export default {
  data: () => ({
    currentPage: 0,
    requests: [],
    url: undefined,
    faviconUrl: undefined,
    requestsTimer: undefined,
    infoTimer: undefined,
  }),
  methods: {
    switchPage(n) {
      this.currentPage = n;
    },
  },
  mounted: function () {
    this.requestsTimer = setInterval(() => {
      browser.storage.local.get("requests").then((data) => {
        try {
          if (
            this.requests != null &&
            this.requests.length < data.requests.length
          ) {
            this.requests = data.requests;
          }
        } catch (e) {}
      });
    }, 200);

    this.infoTimer = setInterval(() => {
      browser.storage.local.get("info").then((data) => {
        if (this.faviconUrl != data.info.favIconUrl) {
          this.faviconUrl = data.info.favIconUrl;
        }
        if (this.url != new URL(data.info.url).hostname) {
          this.url = new URL(data.info.url).hostname;
        }
      });
    }, 200);
  },
  beforeDestroy() {
    clearInterval(this.requestsTimer);
    clearInterval(this.infoTimer);
  },
  components: {
    Home,
    Tracker,
    Requests,
  },
};
</script>
<style>
/* width */
::-webkit-scrollbar {
  width: 5px;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #d0e7f1;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(171, 157, 250);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(64, 115, 182);
}
</style>
