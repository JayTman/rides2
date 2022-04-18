import Vue from "vue";
// import VueClipboard from "vue-clipboard2";

function myconfig() {
  Vue.prototype.$node_env = process.env.NODE_ENV;
  var node_env = process.env.NODE_ENV;
  var py = process.env.VUE_APP_PYTHON + "/";
  Vue.prototype.$pythonServer = py;
  Vue.prototype.$addr = py;
  console.log(
    "NODE_ENV is " +
      node_env +
      " py is:" +
      py +
      " python server:" +
      Vue.prototype.$pythonServer
  );

  Vue.prototype.$addr = "https://test.ebcrides.org/";
  Vue.prototype.$pythonServer = Vue.prototype.$addr;

  if (node_env === "comet") {
    Vue.prototype.$addr = "https://test.ebcrides.org/";
    Vue.prototype.$pythonServer = Vue.prototype.$addr;
  } else if (node_env === "python") {
    // bedroom 3
    Vue.prototype.$addr = "https://python.ebcrides.org/";
    Vue.prototype.$pythonServer = Vue.prototype.$addr;
  } else if (node_env === "attic") {
    // bedroom 3
    Vue.prototype.$addr = "http://192.168.1.29/";
    Vue.prototype.$pythonServer = Vue.prototype.$addr + "ebc/";
  } else if (node_env === "development") {
    // bedroom 4
    Vue.prototype.$addr = "http://192.168.1.40/";
    Vue.prototype.$pythonServer = Vue.prototype.$addr + "ebc/";
  } else if (node_env === "production") {
    Vue.config.productionTip = true;
    Vue.prototype.$addr = "https://python.ebcrides.org/";
    Vue.prototype.$pythonServer = Vue.prototype.$addr;
  } else {
    console.log("RUN_ENV not set");
    return false;
  }

  //0401 test
  Vue.prototype.$calendar = "ksi78qut5vtychikc1";
  console.log(
    "END RUN_ENV is " +
      node_env +
      " py is:" +
      py +
      " python server:" +
      Vue.prototype.$pythonServer
  );
  // jays ride schedulea

  //   Vue.prototype.$calendar= "ksbmqapicnorxb63e1";

  // testVue
  //  Vue.prototype.$calendar = "ks7e95ybp6sovi6z8t";
  // test 2

  //  Vue.prototype.$calendar = "ks49sqrm5qi169kwpg";
  //  Vue.prototype.$addr = "https://test.ebcrides.org/";
  //  Vue.prototype.$pythonServer = addr;

  //  Vue.prototype.$addr
  //  = "http://192.168.1.40/";
  //  Vue.prototype.$pythonServer
  //  = addr + "ebc/";
  Vue.prototype.$imageDir = "images/cal/";

  ///

  //    alert(Vue.prototype.$pythonServer);
  return true;
}
const theme = "blue";
if (theme === "original") {
  Vue.prototype.$menuColor = "red darken-1";
  Vue.prototype.$waitColor = "deep orange";
  Vue.prototype.$fgColor = "orange lighten-2 bodyFont";
  Vue.prototype.$bgColor = "orange lighten-3";
  Vue.prototype.$headerColor = "deep orange ligten-2 headerFont";
} else if (theme === "blue") {
  Vue.prototype.$menuColor = "primary darken-1";
  Vue.prototype.$waitColor = "primary daren-2";
  Vue.prototype.$headerColor = "primary lighten-2 headerFont";
  Vue.prototype.$bgColor = "primary lighten-4";
  Vue.prototype.$fgColor = "primary lighten-3";
}

export { myconfig };
