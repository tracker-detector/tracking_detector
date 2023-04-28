<template>
  <div class="secondary gradient mb-3">
    <div
      class="d-flex flex-row align-center pt-5"
      style="padding: 0 16px 0 16px"
    >
      <img
        :src="faviconUrl"
        alt="logo"
        height="40px"
        style="margin-right: 10px"
      />
      <div class="text-h5">{{ url || "test" }}</div>
    </div>
    <div style="padding: 0 16px 0 16px; flex: 1" class="mt-5">
      <div class="text-subtitle-1">Blocked Trackers</div>
      <div
        class="text-h2 d-flex flex-row-reverse align-center"
        style="color: white"
      >
        {{ trackers.length }}
      </div>
      <div
        class="text-subtitle-1 d-flex flex-row-reverse align-center"
        style="color: white"
      >
        Total: {{ requests.length }} | Blocked: {{ blocked }}
      </div>
      <br />
    </div>
  </div>
</template>
<script>
export default {
  props: ["requests"],
  data: () => ({
    url: undefined,
    faviconUrl: undefined,
    timer: null,
    items: [
      {
        items: [{ title: "tracker1" }],
        title: "Trackers",
      },
    ],
  }),
  mounted: function () {
    this.timer = setInterval(() => {
      browser.storage.local.get("info").then((data) => {
        if (this.faviconUrl != data.info.favIconUrl) {
          this.faviconUrl = data.info.favIconUrl;
        }
        if (this.url != new URL(data.info.url).hostname) {
          this.url = new URL(data.info.url).hostname;
        }
      });
      if (this.props && this.props.requests) {
        this.items[0].items = this.props.requests;
      }
    }, 200);
  },
  computed: {
    trackers: function () {
      return this.requests == null
        ? []
        : this.requests
            .filter((x) => x.blocked)
            .map((x) => new URL(x.url).hostname)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((x) => ({
              title: x,
            }));
    },
    blocked: function () {
      return this.requests.filter((req) => req.blocked).length;
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style>
.gradient {
  background: linear-gradient(to top left, #6600cc 5%, #99ccff 80%);
}
</style>
