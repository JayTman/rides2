import Vue from "vue";
import EventBus from "@/event-bus";
import axios from "axios";

/****************/
Vue.prototype.$node_env = process.env.NODE_ENV;
var node_env = process.env.NODE_ENV;
console.log("NODE_ENV is " + node_env);

Vue.prototype.$addr = "";

if (node_env === "cal") {
  Vue.prototype.$addr = "https://cal.ebcrides.org/";
} else if (node_env === "python") {
  // bedroom 3
  Vue.prototype.$addr = "https://python.ebcrides.org/";
} else if (node_env === "attic") {
  // bedroom 3
  Vue.prototype.$addr = "http://192.168.1.29/";
} else if (node_env === "dev") {
  // bedroom 4ll
  Vue.prototype.$addr = "http://192.168.1.40/";
} else if (node_env === "staging") {
  // bedroom 4
  Vue.prototype.$addr = "http://test.ebcrides.org/";
} else if (node_env === "prod") {
  Vue.config.productionTip = true;
  Vue.prototype.$addr = "https://ebcrides.org/";
} else {
  Vue.prototype.$addr = "http://192.168.1.40/";
  console.log("NODE_ENV not set");
}

//0401 test
Vue.prototype.$addr = "https://python.ebcrides.org/";
Vue.prototype.$calendar = "ksrdre9m4dz88zvpex";
Vue.prototype.$addr = "https://" + location.host + "/";
Vue.prototype.$imageDir = "images/cal/";
if (node_env === "development") {
  Vue.prototype.$pythonServer = "http://192.168.1.40/python/";
  Vue.prototype.$addr = "http://192.168.1.40/";
} else Vue.prototype.$pythonServer = "https://python.ebcrides.org/python/";
console.log(
  "END RUN_ENV is " + node_env + " python server:" + Vue.prototype.$pythonServer
);

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

///

//    alert(Vue.prototype.$pythonServer);
var mytheme = "blue";
if (mytheme === "original") {
  Vue.prototype.$menuColor = "red darken-1";
  Vue.prototype.$waitColor = "deep orange";
  Vue.prototype.$fgColor = "orange lighten-2 bodyFont";
  Vue.prototype.$bgColor = "orange lighten-3";
  Vue.prototype.$headerColor = "deep orange ligten-2 headerFont";
} else if (mytheme === "blue") {
  Vue.prototype.$menuColor = "primary darken-1";
  Vue.prototype.$waitColor = "primary daren-2";
  Vue.prototype.$headerColor = "primary lighten-2 headerFont";
  Vue.prototype.$bgColor = "primary lighten-4";
  Vue.prototype.$fgColor = "primary lighten-3";
}

/*********/

Vue.prototype.$statusDisplayName = "";
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
Vue.prototype.$subClendars = [];

export default {
  data() {
    return {
      statusFieldName: "none",
      statusFieldValue: "none",
      statusFieldID: "none",
      config: [],
      customHeaders: [],
      //      rideList: [],
      allRideLeaders: [],
      pendingRideLeaders: [],
      statusValues: [],
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

    findNameByKey(_array, key, name) {
      var index = this.findIndexByKey(_array, key, name);
      if (index !== -1) {
        return _array[index].name;
      } else {
        return index;
      }
    },
    /*
        findNameByKey(_array, key, value) {
          var index = this.findIndexByKey(_array, key, value);
    
          if (index !== -1) {
            return _array[index].name;
          } else {
            return index;
          }
        },
    */
    findIDByName(_array, name) {
      for (var index = 0; index < _array.length(); ++index) {
        if (_array[index].name === name) return _array[index].id;
      }
      return -1;
    },

    //  returns the index of object in the array that where
    // key matches value
    findObjectIndexByKey(_array, key, value) {
      var ret = _array.findIndex(function (__array, key) {
        if (__array[key] == value) return true;
      });
      return ret;
    },

    getstatusValues() {
      if (this.statusValues.length > 0) {
        return;
      }

      var values = {};
      var values2 = [];
      this.getConfig();
      var i = this.findIndexByKey(this.config, "name", this.statusFieldName);
      if (i === -1) {
        alert("status field defs not found in configuration.");
        return -1;
      }
      var base = this.config[i].type_data.options;
      for (var j = 0; j < base.length; j++) {
        values[base[j].id] = base[j].name;
        values2[{ id: base[j].id, name: base[j].name }];
      }
      this.statusValues = Object.entries(values);
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
          currentRide = response.data.event;
          console.log(currentRide);
        })
        .catch((error) => {
          console.log(error + true);
          EventBus.$emit("wait", "false");
        });
    },
    //          var sid = this.statusFieldID;
    //          var snm = this.statusFieldName;
    updateRide(ride, newRide) {
      var APIkey =
        "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

      var url =
        "https://api.teamup.com/" + this.$calendar + "/events/" + newRide.id;
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
          console.log("error while updating ride " + error);
          EventBus.$emit("wait", "false");
        });
    },
    /*
    getstatusValues() {
      var values = { };
  var i = this.findIndexByKey(this.config, "name", this.statusFieldName);
  if (i === -1) {
        return {status: "not found" };
      }
  var base = this.config[i]["type_data"]["options"];
  for (var j = 0; j < base.length; j++) {
    values[base[j].id] = base[j].name;
      }
  return values;
    },
  */
    teamupError(error, msg = "") {
      alert("ERROR" + error + msg);
    },
    getStatusID(name) {
      this.getstatusValues();
      for (var i = 0; i < this.statusValues.length; i++) {
        var x = this.fuzzyMatch(this.statusValues[i][1], name);
        if (x === true) {
          return this.statusValues[i][0];
        }
      }
      return -1;
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
    sortObj(obj) {
      return Object.keys(obj)
        .sort()
        .reduce(function (result, key) {
          result[key] = obj[key];
          return result;
        }, {});
    },
    convertCustomFields(ride) {
      ride.displayCustom = {};
      for (const key in ride["custom"]) {
        /*         console.log(key);
         */
        var displayKey = this.findNameByKey(this.config, "id", key);
        //                  var displayKey = this.config[index].name;
        //        ride['displayCustom'] = displayKey;
        var index = this.findIndexByKey(this.config, "id", key);
        //    var types = this.config[index]["type_data"];
        if (this.config[index].type === "choices") {
          var displayValue = this.findNameByKey(
            this.config[index].type_data.options,
            "id",
            ride.custom[key][0]
          );
        } else {
          displayValue = ride.custom[key];
        }
        //        ride[displayKey] = displayValue;
        ride[displayKey] = displayValue;
        ride.displayCustom[displayKey] = displayValue;

        //
        // store the status fields in globals
        if (this.statusFieldName === "none") {
          if (this.fuzzyMatch(displayKey, "status")) {
            this.statusFieldID = key;
            this.statusFieldName = displayKey;
          }
        }
      }
      ride.displayCustom = this.sortObj(ride.displayCustom);
    },

    getConfig() {
      return new Promise((resolve, reject) => {
        var APIkey =
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
        }).then((response) => {
          this.config = response.data.configuration.fields.definitions;
          var url2 =
            "https://api.teamup.com/" + this.$calendar + "/subcalendars";
          axios({
            method: "GET",
            url: url2,
            headers: {
              "Teamup-Token": APIkey,
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((responseCal) => {
              this.$subCalendars = responseCal.data.subcalendars;
            })

            .catch((error) => {
              this.teamupError("getCOnfig " + error, true);
              EventBus.$emit("wait", "false");
              reject(error);
              return false;
            });
        });
        resolve(this.$subCalendars);
      });
    },

    getYear(whichYear) {
      //      await this.getConfig();
      var today = new Date();
      var month = today.getMonth();
      var year = today.getFullYear();

      if (month > 1) {
        year += 1;
      }
      //      console.log("sub cals " + this.$subCalendars.length)

      var currentYear = year;
      year -= 1;
      var prevYear = year;
      if (whichYear == "previous") return prevYear;
      else if (whichYear == "current") return currentYear;
      else return "error";
    },

    getRides(rideLeader, status, func = null, start = "", end = "") {
      this.getConfig();
      return new Promise((resolve, reject) => {
        const rideList = [];
        const skip = [];
        var passed = "datest passed in";
        if (start === "") {
          passed = "FALSE";
          start = "1/1/" + this.getYear("current");
          end = "12/1/" + this.getYear("current");
        }
        console.log(
          "start: " +
            start +
            " end: " +
            end +
            " rideLeader " +
            rideLeader +
            " status: " +
            status +
            "dates passed in: " +
            passed +
            "calendar " +
            this.$calendar
        );

        EventBus.$emit("wait", "true");
        var APIkey =
          "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

        //
        // get  field definitions
        console.log("Python server " + this.$pythonServer);

        var url2 =
          "https://api.teamup.com/" +
          this.$calendar +
          "/events?startDate=" +
          start +
          "&endDate=" +
          end;
        console.log("URL " + url2);
        axios({
          method: "GET",
          url: url2,
          headers: {
            "Teamup-Token": APIkey,
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response2) => {
            response2.data.events.sort((a, b) => (a.who > b.who ? 1 : -1));

            for (var cnt = 0; cnt < response2.data.events.length; cnt++) {
              // Ignore weekly rides

              var ride = response2.data.events[cnt];
              if (ride.rrule.search("YEAR") === -1) {
                ride.reason = "year";
                skip.push(ride);
                continue;
              }

              // ignore if no ride leader
              if (ride.who === "") {
                ride.reason = "who";
                skip.push(ride);
                continue;
              }
              // create a list of all ride leaders
              if (this.allRideLeaders.indexOf(ride.who) === -1) {
                this.allRideLeaders.push(ride.who);
              }

              var sub = this.findNameByKey(
                this.$subCalendars,
                "id",
                ride.subcalendar_id
              );
              if (this.fuzzyMatch(sub, "meet")) {
                ride.reason = "meeting";
                skip.push(ride);
                console.log("skipping meeting based on subcalendar");
                continue;
              }
              if (ride.title.toLowerCase().search("club") !== -1) {
                ride.reason = "meeting";
                console.log("skipping meeting based on title");
                skip.push(ride);
                continue;
              }

              if (rideLeader !== "all") {
                if (ride.who.indexOf(rideLeader) === -1) {
                  ride.reason = "no leader match";
                  skip.push(ride);
                  continue;
                }
              }

              // if custom fields exists for this ride
              if ("custom" in ride === true) {
                this.convertCustomFields(ride);
              }

              var dt = "";
              dt = new Date(Date.parse(ride.start_dt));
              ride.Date = dt.toLocaleDateString();
              ride.Date += " " + dt.getHours() + ":";
              ride.Date += ("00" + dt.getMinutes()).slice(-2);
              ride.dialog = false;
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
            console.log("Returning " + rideList.length + " rides.");
            skip.sort((a, b) => (a.reason > b.reason ? 1 : -1));
            for (cnt = 0; cnt < skip.length; cnt++) {
              var rd = skip[cnt];
              console.log(rd.reason);
            }
            if (rideList.length === 0) {
              console.log(
                "Found no ride data for " + start + " thru " + end + "."
              );
              resolve(rideList);
            }
            if (func !== null) {
              EventBus.$emit("wait", "false");
              func(rideList);
              resolve(rideList);
              // return rideList;
            } else {
              EventBus.$emit("wait", "false");
              resolve(rideList);
            }
          })
          .catch((error) => {
            EventBus.$emit("wait", "false");
            this.teamupError(error, url2);
            reject(error);
          });
      });
    },
  },
};
