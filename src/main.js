import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import mixin from "@/components/mixins";
import VueClipboard from "vue-clipboard2";
// import fs from "fs";
/* 
Vue.config.errorHandler = (err, vm, info) => {
  alert("Error: " + vm + "\n" + err + "\n" + info);
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
 
  // TODO: Perform any custom logic or log to server
};
 


init() {
  console.log(" Writing into an file ");
  // Reading the file
  fs.readFile("ridesConfig.js", function (err, data) {
    if (err) {
      return console.error(err);
    }
    console.log("Data read : " + data.toString());

  });
}
);

// Sample.txt is an empty file
/* 
fs.writeFile(
  "sample.txt",
  "Let's write a few sentences in the file",
  function (err) {
    if (err) {
      return console.error(err);
    }

    // If no error the remaining code executes
    console.log(" Finished writing ");
    console.log("Reading the data that's written");
 */


VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard); // const server = "http://192.168.1.22/";

Vue.mixin(mixin);
fetch(process.env.BASE_URL + "config.json")
  .then((response) => response.json())
  .catch((error) => {
    alert(error);
  })
  .then((config) => {
    Vue.prototype.$config = config
    new Vue({
      router,
      mixins: [mixin],
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  })
