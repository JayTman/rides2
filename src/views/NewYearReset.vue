<template>
  <div id="NewYearReset">
    <v-card :color="this.$headerColor" height="100">
      <v-row justify="center">
        <h1>New Year Reset</h1>
      </v-row>
    </v-card>
    <v-card :color="this.$headerColor">
      <div v-if="prevResetDate.substr(0, 4) !== currentYear.toString()">
        <v-row justify="center">
          <v-card-title>
            This will archive the rides from
            {{ prevYear }}, and set all the rides for {{ currentYear }} to
            Pending.
          </v-card-title>
        </v-row>
        <v-row justify="center">
          <v-btn
            @click="newYearReset()"
            :class="snackbarColor"
            height="100"
            elevation="12"
          >
            Reset the Calendar for use in {{ currentYear }}
          </v-btn>
        </v-row>
        <v-row justify="center">
          {{ snackbarText }}
        </v-row>
        <!-- 
        <v-resetMsg v-model="resetMsg" width="500" overlay-color="red lighten-2">
          <v-card color="green lighten-2">
            <v-row justify="center">
              <v-btn
                @click="newYearReset()"
                color="green"
                dark
                height="100"
                elevation="12"
              >
                Reset the Calendar for use in {{ currentYear }}
              </v-btn>
              <v-row justify="center"> </v-row>
              <v-card-actions>
                <v-row justify="center">
                  <v-btn class="yellow" snackbarText @click="resetMsg = false">
                    OK
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-row>
          </v-card>
        </v-resetMsg>
 -->
      </div>
      <div v-else>
        <v-row justify="center">
          <v-card
            width="400"
            :color="snackbarColor"
            dark
            height="150"
            class="text-center"
          >
            <v-col>
              <v-row justify="center">
                <v-card-subtitle>
                  <h2>
                    The New Year reset has been run for this year on
                    {{ prevResetDate.substr(5, 20) }}.<br />
                  </h2>
                  <br />
                  You can only reset the rides calendar once per year.
                </v-card-subtitle>
              </v-row>
            </v-col>
          </v-card>
        </v-row>
      </div>
      <v-snackbar
        v-model="snackbar"
        :timeout="this.timeout"
        absolute
        :color="snackbarColor"
      >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="black"
            :disabled="snackBtn"
            snackbarText
            v-bind="attrs"
            @click="ack()"
          >
            OK
          </v-btn>
        </template>
      </v-snackbar>
      <v-card :color="this.$headerColor" height="30"> </v-card>
      <v-col>
        <v-row justify="center">
          <v-btn @click="overrideLock()" color="red yellow--snackbarText" dark>
            Override Lockout
          </v-btn>
        </v-row>
      </v-col>
    </v-card>

    <StatusTable />
  </div>
</template>

<script>
import axios from "axios";
// import PopUp from "@/components/PopUp.vue";
import StatusTable from "@/components/StatusTable.vue";
// import confirm from "@/components/Confirm.vue";
// import ButtonTip from "@/components/ButtonTip.vue";
import EventBus from "@/event-bus.js";

export default {
  name: "NewYearReset",
  components: {
    //    ButtonTip,
    //         PopUp,
    //    Confirm,
    StatusTable,
  },
  props: {},

  data() {
    return {
      snackbarText: "",
      timeout: -1,
      snackBtn: true,
      resetMsg: false,
      snackbar: false,
      snackbarColor: "green",
      prevYear: "",
      prevResetDate: "",
      currentYear: "",
      showRefresh: false,
      pending: false,
      summaryData: [],
      expanded: [],
      singleExpand: false,
      rideLeader: "",
      calendar: this.$calendar,
      rideLeaderList: ["jay"],
      rideList: [],
      msg: "",
      status: "",

      headers: [
        {
          Text: "Ride Leader",
          align: "start",
          value: "rideLeader",
          width: "60",
        },
      ],
    };
  },
  methods: {
    ack() {
      this.snackbar = "false";
      //      this.$router.push({ path: "/" });
      this.$router.push({ path: "/" });
    },
    overrideLock() {
      this.updateResetFlag("WRITE", "2020 Reset by Override");
      this.snackbarColor = "red  white--text";
    },
    updateResetFlag(mode, newYearDate) {
      var url =
        this.$pythonServer +
        "/newYearCheck?filename=newYearCheck.msg&id=" +
        mode +
        "&msg=" +
        newYearDate;
      axios({
        method: "GET",
        url: url,
        //      url: this.$pythonServer +
        // url: "https://test.ebcrides.org/" + "getImageList",
      })
        // axios({ method: "GET", "url": "https://httpbin.org/ip" }).
        .then((response) => {
          console.log("dateeeee " + response.data);
          this.prevResetDate = response.data;
          if (this.prevResetDate.substr(0, 4) === this.currentYear.toString()) {
            this.snackbarColor = "red lighten-3 black--text";
          }
        });
    },

    async newYearReset() {
      this.snackbar = true;
      this.prevYear = this.getYear("previous");
      this.currentYear = this.getYear("current").toString();
      if (this.prevResetDate.substr(0, 4) === this.currentYear.toString()) {
        this.snackbarText = "already done";
        return true;
      } else {
        this.snackbarText = "Resetting for the New Year";
        var today = new Date();
        var dt = today.toDateString();
        var year = today.getFullYear().toString();
        var resetDate = year + " " + dt;
        console.log("at newyearreset " + year + " " + dt + resetDate);
        EventBus.$emit("wait", "true");
        //
        //      this.getRides("all", "all", this.u2).then((resp) => {
        await this.updateYear(this.prevYear).then((resp) => {
          console.log(
            resp + "********** last year done [" + this.prevYear + "]"
          );
        });
        await this.updateYear(this.currentYear).then((resp) => {
          console.log(
            resp + "this year done ********** [" + this.currentYear + "]"
          );
        });
      }
    },

    async updateYear(year) {
      this.getConfig();
      let rideList = [];
      //            this.currentYear = this.getYear("current");
      //            this.prevYear = this.getYear("previous");
      //            rideList.none = "none";

      var startDate = "";
      var endDate = "";
      if (year === this.prevYear) {
        startDate = this.prevYear + "-1-1";
        endDate = this.prevYear + "-12-31";
      } else {
        startDate = this.currentYear + "-1-1";
        endDate = this.currentYear + "-12-31";
      }
      console.log("year pased in " + year + "prev year is " + this.prevYear);

      await this.getRides("all", "all", null, startDate, endDate)
        .then((resp) => {
          rideList = resp;
          if (rideList.length === 0) {
            return;
          }
          var APIkey =
            "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";
          const axiosConfig = {
            headers: {
              "Teamup-Token": APIkey,
              "Content-type": "application/json; charset=UTF-8",
            },
          };

          const url = "https://api.teamup.com/" + this.$calendar + "/events/";
          const promises = [];
          const promises2 = [];
          for (let j = 0; j < rideList.length; j++) {
            if (rideList[j].rrule.search("WEEK") !== -1) {
              console.log("ERROR checking for WEEK " + rideList[j]);
              continue;
            }
            if (rideList[j].title.search("Club Meet") !== -1) {
              console.log("ERROR" + rideList[j]);
              continue;
            }
            promises.push(axios.get(url + rideList[j].id, axiosConfig));
          }

          Promise.all(promises).then((resp) => {
            const statusID = this.statusFieldID;
            const pend = this.getStatusID("pend");
            for (let j = 0; j < resp.length; j++) {
              const ride = resp[j].data.event;

              if (year === this.prevYear) {
                ride.redit = "single";
              } else {
                ride.redit = "all";
                ride.custom[statusID][0] = pend;
              }
              promises2.push(axios.put(url + ride.id, ride, axiosConfig));
              if (ride.custom[statusID][0] !== pend)
                console.log("pending not set " + this.pp(ride));
            }
            Promise.all(promises2).then(() => {});
            console.log("done promises 2");
            console.log("update reset flag");
            var today = new Date();
            var resetDate =
              today.getFullYear().toString() + " " + today.toDateString();
            this.updateResetFlag("WRITE", resetDate);
            this.snackbarText = "New Year Reset completed.";
            this.snackbar = true;
            this.snackBtn = false;
            if (this.snadkbar === false) this.$router.push({ path: "/" });
          });
        })
        .catch((err) => {
          console.log("ERRROR");

          console.log(err);
        });
    },
  },
  mounted() {
    this.updateResetFlag("READ", "");
    this.prevYear = this.getYear("previous");
    this.currentYear = this.getYear("current");
    EventBus.$on("pending", (value) => {
      this.pending = value;
    });
  },
};
</script>
<style scoped>
.border {
  padding: 300px;
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>
