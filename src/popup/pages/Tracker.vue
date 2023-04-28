<template>
  <div>
    <div v-if="trackers.length == 0">
      <v-subheader class="deep-purple--text accent-4"
        >Identified Tracker</v-subheader
      >
      <div
        style="text-align: center; margin-top: 150px"
        class="deep-purple--text accent-4"
      >
        No tracker detected for this page...
      </div>
    </div>
    <v-list v-else flat style="height=100%">
      <v-subheader class="deep-purple--text accent-4"
        >Identified Tracker</v-subheader
      >
      <v-list-item v-for="item in trackers" :key="item.url">
        <v-icon class="mr-2" color="deep-purple accent-4">mdi-bug</v-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.url }}</v-list-item-title>
          <v-list-item-subtitle
            >Num of Req: {{ item.amountOfRequests }} | AvgPredict:
            {{ item.avgPredict.toFixed(3) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <br />
      <br />
    </v-list>
  </div>
</template>

<script>
export default {
  props: ["requests"],
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
