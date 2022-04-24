import Vue from "vue";
// import EventBus from "./event-bus.js";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import EventBus from ".///event-bus";
import axios from "axios";
import moment from "moment";

Vue.config.productionTip = false;
// var globalStorepj = [];

const addr = "https://test.ebcrides.org/";
Vue.prototype.$pythonServer = addr;

// const addr = "http://192.168.1.71/";
// BEDROOM 3 const addr = "http://192.168.1.29/";

// Vue.prototype.$pythonServer = addr + "ebc/";

Vue.prototype.$fileServer = addr;
Vue.prototype.$imagePath = addr + "images/cal/";

// jays ride schedule
Vue.prototype.$calendar = "ksbmqapicnorxb63e1"; /// Vue.prototype.$calendar ="ks6vey3851dksidkzc"; // test113//
// Vue.prototype.$calendar = "ks4f2ityp82zqj3zsh"; / / EBC read only

Vue.prototype.$menuColor = "#BA3B46";
Vue.prototype.$waitColor = "deep orange";
Vue.prototype.$fgColor = "orange lighten-3";
Vue.prototype.$bgColor = "orange lighten-2 bodyFont";
Vue.prototype.$headerColor = "deep orange ligten-2 headerFont";

Vue.prototype.$prevYear = "2022";
Vue.prototype.$currentYear = "2023";

//Vue.prototype.$rideList = [];
//Vue.prototype.$customHeaders = [];

Vue.config.errorHandler = (err, vm, info) => {
  alert("Error: " + vm + "\n" + err + "\n" + info);
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.

  // TODO: Perform any custom logic or log to server
};
Vue.mixin({
  data() {
    return {
      statusFieldName: "none",
      statusFieldValue: "none",
      statusFieldID: "none",
      config: [],
      customHeaders: [],
      //      rideList: [],
      allRideLeaders: [],
      unconfirmedRideLeaders: [],
      statusList: [],
    };
  },
  methods: {
    pp(object) {
      console.log(JSON.stringify(object, 4, " "));
    },
    findIndexByKey(_array, key, value) {
      for (var i = 0; i < _array.length; i++) {
        if (_array[i][key] === value) {
          return i;
        }
      }
      return -1;
    },

    findValuesByKey(_array, key, value) {
      var values = {};
      for (var i = 0; i < _array.length; i++) {
        if (_array[i][key] === value) {
          var base = _array[i]["type_data"]["options"];
          for (var j = 0; j < base.length; j++) {
            values[base[j].id] = base[j].name;
          }
        }
      }
      return values;
    },

    findNameByKey(_array, key, value) {
      var index = this.findIndexByKey(_array, key, value);

      if (index != -1) {
        return _array[index]["name"];
      } else {
        return index;
      }
    },
    createStatusList() {
      if (this.statusList.length > 0) {
        return;
      }

      var values = {};
      var i = this.findIndexByKey(this.config, "name", this.statusFieldName);
      if (i === -1) {
        return { status: "not found" };
      }
      var base = this.config[i]["type_data"]["options"];
      for (var j = 0; j < base.length; j++) {
        values[base[j].id] = base[j].name;
      }
      this.statusList = Object.entries(values);
      //      console.log(k, v);
    },
    getRide(rideID, currentRide) {
      var APIkey =
        "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

      var url =
        "https://api.teamup.com/" + this.$calendar + "/events/" + rideID;
      /*
       */
      axios({
        method: "GET",
        url: url,
        headers: {
          "Teamup-Token": APIkey,
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          currentRide = response.data["event"];
          console.log(currentRide);
        })
        .catch((error) => {
          this.teamupError(error, true);
          EventBus.$emit("wait", "false");
        });
    },
    //          var sid = this.statusFieldID;
    //          var snm = this.statusFieldName;
    updateRide(ride, newRide) {
      var APIkey =
        "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

      var url =
        "https://api.teamup.com/" + this.$calendar + "/events/" + newRide["id"];
      axios({
        method: "PUT",
        url: url,
        data: ride,
        //        data: newData,
        headers: {
          "Teamup-Token": APIkey,
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          newRide = response.data.event;
          return newRide;
        })
        .catch((error) => {
          this.teamupError(error, true);
          EventBus.$emit("wait", "false");
        });
    },
    /*
    getStatusList() {
      var values = {};
      var i = this.findIndexByKey(this.config, "name", this.statusFieldName);
      if (i === -1) {
        return { status: "not found" };
      }
      var base = this.config[i]["type_data"]["options"];
      for (var j = 0; j < base.length; j++) {
        values[base[j].id] = base[j].name;
      }
      return values;
    },
    */
    teamupError(error, msg = "") {
      console.log(msg + " " + error);
      /*
            var x = JSON.strinify(error, 4);
            var errorMsg = "\nERROR:\n" + x;
            var er =
              error.response.data.error.title +
              "\n" +
              error.response.data.error.message;
            if (msg !== "") errorMsg = msg + errorMsg + er;
            console.log(errorMsg);
            alert(msg);
      */
    },
    getStatusID(name) {
      this.createStatusList();
      for (var i = 0; i < this.statusList.length; i++) {
        var x = this.fuzzyMatch(this.statusList[i][1], name);
        if (x === true) {
          return this.statusList[i][0];
        }
      }
      return -1;
    },

    async createSummary() {
      this.summaryData = [];
      await this.getRides("all", "unconfirmed").then((resp) => {
        this.rideList = resp;
      });

      this.createStatusList();
      for (var i = 0; i < this.statusList.length; i++) {
        this.headers.push({
          text: this.statusList[i][1],
          value: this.statusList[i][0],
          width: 10,
        });
      }
      for (var cnt = 0; cnt < this.rideList.length; cnt++) {
        var ride = this.rideList[cnt];
        if (ride["who"] === "") {
          continue;
        }
        var rideLeaderIndex = this.findIndexByKey(
          this.summaryData,
          "rideLeader",
          ride["who"]
        );

        // ride leader not in list
        if (rideLeaderIndex === -1) {
          this.summaryData.push({ rideLeader: ride["who"] });
          this.unconfirmedRideLeaders.push(ride["who"]);
          rideLeaderIndex = this.findIndexByKey(
            this.summaryData,
            "rideLeader",
            ride["who"]
          );
          if (rideLeaderIndex === -1) {
            return "ERROR";
          }
          // initialize status fields to zereo
          var keys = Object.values(this.statusList);
          for (i = 0; i < keys.length; i++) {
            this.summaryData[rideLeaderIndex][keys[i][0]] = 0;
          }
        }
        //          if (this.headers.includes(status) === false) {
        //            this.headers.push(status);
        //        }
        var val = ride["custom"][this.statusFieldID][0];
        this.summaryData[rideLeaderIndex][val] += 1;
      }
      EventBus.$emit("unconfirmedRideLeaders", this.unconfirmedRideLeaders);
    },

    fuzzyMatch(againstThis, matchThis) {
      if (againstThis.toLowerCase().search(matchThis.toLowerCase()) > -1) {
        return true;
      } else {
        return false;
      }
    },

    /*
    lookup values for field definitions and store them for easier access
    */
    convertCustomFields(ride) {
      ride["displayCustom"] = {};
      for (let key in ride["custom"]) {
        /*         console.log(key);
         */
        var displayKey = this.findNameByKey(this.config, "id", key);
        //                  var displayKey = this.config[index].name;
        //        ride['displayCustom'] = displayKey;
        var index = this.findIndexByKey(this.config, "id", key);
        //    var types = this.config[index]["type_data"];
        if (this.config[index]["type"] == "choices") {
          var displayValue = this.findNameByKey(
            this.config[index]["type_data"]["options"],
            "id",
            ride["custom"][key][0]
          );
        } else {
          displayValue = ride["custom"][key];
        }
        //        ride[displayKey] = displayValue;
        ride[displayKey] = displayValue;
        ride["displayCustom"][displayKey] = displayValue;
        //
        // store the status fields in globals
        if (this.statusFieldName === "none") {
          if (this.fuzzyMatch(displayKey, "status")) {
            this.statusFieldID = key;
            this.statusFieldName = displayKey;
          }
        }
      }
    },

    async getRides(
      rideLeader,
      status,
      func = null,
      start = this.$currentYear + "-1-1",
      end = this.$currentYear + "-12-31"
    ) {
      return new Promise((resolve, reject) => {
        const rideList = [];

        // console.log("start date: " + start + "end ddate " + end + rideLeader + "status " + status);
        EventBus.$emit("wait", "true");
        const APIkey =
          "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

        //
        // get  field definitions
        const url =
          "https://api.teamup.com/" + this.$calendar + "/configuration";
        axios({
          method: "GET",
          url: url,
          headers: {
            "Teamup-Token": APIkey,
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            this.config =
              response.data["configuration"]["fields"]["definitions"];
            EventBus.$emit("wait", "true");
            var APIkey =
              "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

            //
            // get  ride data
            var url2 =
              "https://api.teamup.com/" +
              this.$calendar +
              "/events?startDate=" +
              start +
              "&endDate=" +
              end;
            axios({
              method: "GET",
              url: url2,
              headers: {
                "Teamup-Token": APIkey,
                "Content-type": "application/json; charset=UTF-8",
              },
            })
              .then((response2) => {
                for (
                  var cnt = 0;
                  cnt < response2.data["events"].length;
                  cnt++
                ) {
                  // Ignore weekly rides
                  var ride = response2.data.events[cnt];
                  if (ride.rrule.search("YEAR") === -1) {
                    continue;
                  }

                  //ignore if no ride leader
                  if (ride["who"] === "") {
                    continue;
                  }
                  // create a list of all ride leaders
                  if (this.allRideLeaders.indexOf(ride["who"]) === -1) {
                    this.allRideLeaders.push(ride["who"]);
                  }

                  if (rideLeader !== "all") {
                    if (rideLeader !== ride["who"]) {
                      continue;
                    }
                  }

                  // if custom fields exists for this ride
                  if ("custom" in ride === true) {
                    this.convertCustomFields(ride);
                    //                  console.log(cnt + ". " + this.pp(ride));

                    if (status === "unconfirmed") {
                      //                      var sf =
                      this.$;
                      var rideStatus =
                        ride["displayCustom"][this.statusFieldName];
                      if (rideStatus.toLowerCase().search("confirm") > -1) {
                        continue;
                      }
                    }
                  }

                  // KLUDGE not a reliable check
                  // need to check sub calendar id
                  if (ride.title.toLowerCase().search("club") !== -1) {
                    continue;
                  }
                  var dt = "";
                  dt = moment(ride["start_dt"], "YYYY-MM-DDTHH:mm:ssZ").format(
                    "MM/DD/YY HH:mm"
                  );
                  ride["Date"] = dt;
                  ride["dialog"] = false;
                  rideList.push(ride);
                  //                 total += 1;
                }
                this.allRideLeaders.sort();
                rideList.sort((a, b) => (a.who > b.who ? 1 : -1));
                EventBus.$emit("allRideLeaders", this.allRideLeaders);
                // console.log(
                //  "Processed " +
                //                  cnt +
                //                ". Created rideList with a total of " +
                //              total
                //          );

                EventBus.$emit("wait", "false");
                if (func !== null) {
                  func(rideList);
                  resolve(rideList);
                  return rideList;
                } else {
                  resolve(rideList);
                }
              })

              .catch((error) => {
                EventBus.$emit("wait", "false");
                alert("Rides List Error fetching rides list " + error);
                this.teamupError(error, true);
                reject("Failed @etRides" + error);
              });
          })
          .catch((error) => {
            this.teamupError(error, true);
            EventBus.$emit("wait", "false");
            reject("Failed @etRides" + error);
          });
      });
    },
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
