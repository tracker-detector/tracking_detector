<template>
  <div>
    <div v-if="requests.length == 0">
      <v-subheader class="deep-purple--text accent-4"
        >Captured Requests</v-subheader
      >
      <div
        style="text-align: center; margin-top: 150px"
        class="deep-purple--text accent-4"
      >
        No requests captured for this page...
      </div>
    </div>
    <v-list v-else flat style="height=100%">
      <v-subheader class="deep-purple--text accent-4"
        >Captured Requests
        <v-spacer />
        <v-btn @click="clipBoard(requests)" icon>
          <v-icon color="deep-purple accent-4">mdi-content-paste</v-icon>
        </v-btn>
      </v-subheader>
      <v-list-item v-for="item in requests" :key="item.url">
        <v-icon class="mr-2" color="deep-purple accent-4">mdi-web</v-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.url }}</v-list-item-title>
          <v-list-item-subtitle>
            Blocked: {{ item.blocked }} <br />
            Initiator: {{ item.initiator }} <br />
            Method: {{ item.method }} <br />
            Predict: {{ item.predict.toFixed(3) }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn @click="clipBoard(item)" icon>
            <v-icon small color="deep-purple accent-4"
              >mdi-content-paste</v-icon
            >
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <br />
      <br />
    </v-list>
  </div>
</template>

<script>
export default {
  props: ["requests"],
  methods: {
    clipBoard(item) {
      navigator.clipboard.writeText(JSON.stringify(item));
    },
  },
  computed: {
    trackers: function () {
      if (this.requests == null) {
        return [];
      }
      const trackersRep = this.requests
        .filter((req) => req.blocked)
        .map((x) => {
          const { hostname } = new URL(x.url);
          return {
            url: hostname,
            predict: x.predict,
          };
        });
      const trackerHosts = trackersRep
        .map((x) => x.url)
        .filter((value, index, array) => array.indexOf(value) === index);
      return trackerHosts.map((req) => {
        const numberOfRequestToHost = trackersRep.filter(
          (trReq) => trReq.url == req
        ).length;
        const avaragePredict =
          trackersRep
            .filter((trReq) => trReq.url == req)
            .map((trReq) => trReq.predict)
            .reduce((pv, cv) => pv + cv, 0) / numberOfRequestToHost;
        return {
          url: req,
          amountOfRequests: numberOfRequestToHost,
          avgPredict: avaragePredict,
        };
      });
    },
  },
};
</script>
