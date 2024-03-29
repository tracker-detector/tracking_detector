import Vue from "vue";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import Labels from "./pages/Labels.vue";
import Classifier from "./pages/Classifier.vue";
import Whitelist from "./pages/Whitelist.vue";
import VueRouter from "vue-router";
import JsonViewer from "vue-json-viewer";
import "vue-json-viewer/style.css";

Vue.use(VueRouter);
Vue.use(JsonViewer);

const routes = [
  { path: "/", component: Home },
  { path: "/labels", component: Labels },
  { path: "/labels/:id", component: Classifier },
  { path: "/whitelist", component: Whitelist },
];

const router = new VueRouter({
  base: "option/index.html",
  mode: "history",
  fallback: true,
  routes,
});

new Vue({
  el: "#app",
  vuetify,
  router,
  render: (h) => h(App),
});
