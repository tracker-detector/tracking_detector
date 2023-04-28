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
      <div class="text-h5">{{ url }}</div>
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
  props: ["url", "faviconUrl", "requests"],
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
};
</script>
<style>
.gradient {
  background: linear-gradient(to top left, #6600cc 5%, #99ccff 80%);
}
</style>
