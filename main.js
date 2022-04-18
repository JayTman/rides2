import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import mixin from "@/components/mixins";
import VueClipboard from "vue-clipboard2";
/* 
Vue.config.errorHandler = (err, vm, info) => {
  alert("Error: " + vm + "\n" + err + "\n" + info);
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
 
  // TODO: Perform any custom logic or log to server
};
 
 */

VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard); // const server = "http://192.168.1.22/";

Vue.mixin(mixin);
new Vue({
  router,
  mixins: [mixin],
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
