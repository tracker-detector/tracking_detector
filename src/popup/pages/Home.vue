<template>
  <div style="padding: 0; margin: 0">
    <Header :requests="requests" />
    <Controlls />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Controlls from "../components/Controlls.vue";
export default {
  props: ["requests"],
  components: {
    Header,
    Controlls,
  },
};
</script>
