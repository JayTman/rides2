<template>
  <div id="NewYearReset">
    <v-container fluid :class="this.$bgColor">
      <v-row class="text-center">
        <v-col>
          <v-card :color="this.$headerColor">
            <h2>Reset the Calender for the New Year</h2>
            <h3>
              This will archive rides from {{ this.$prevYear }} and set the
              rides for {{ this.$currentYear }} to unconfirmed.
            </h3>
          </v-card>
        </v-col>
      </v-row>

      <v-card color="red darken-4" dark v-show="this.unconfirmed">
        <v-row class="text-left">
          <v-col>
            <v-card-title> Prepare for New year </v-card-title>
            <v-card-text>
              You should only reset the calendar for the new year when there are
              no rides marked Pending or Changes Pending for the current year.
              The rides shown below should have been set to either Confirmed or
              Canceled before the ride had occurred. <br />
              To correct these, you can click on the arrow buttons to show the
              rides that are still have the wrong status set, and then press the
              edit button to correct them.
              <br />
              <br />
              When you are done changing the status for all the rides, refresh
              this page.
            </v-card-text>
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-btn color="black" @click="newYearReset()">
            Reset the Calendar without <br />
            changing the Status of the Rides below</v-btn
          >
          <v-btn @click="reloadTestCalendar()" color="black">
            Reload Test Calendar
          </v-btn>
        </v-row>
      </v-card>
      <v-spacer></v-spacer>
      <v-snackbar v-model="snackBar" color="warning" centered light>
        {{ msg }}
        <template v-slot:action="{ attrs }">
          <v-btn class="grey" v-bind="attrs" @click="snackBar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-card width="100%" :color="this.$bgColor" v-show="!this.unconfirmed">
        <PopUp />
        <statusTable />
        <v-row>
          <v-col cols="md-6">
            <v-btn
              v-show="!unconfirmed"
              color="primary"
              @click="newYearReset()"
            >
              Reset the Calendar
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="reloadTestCalendar()" class="red" dark>
              Reload Test Calendar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row>
        <v-col>
          <confirm ref="confirm"></confirm>
          <StatusTable />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import PopUp from "@/components/PopUp.vue";
import Confirm from "@/components/Confirm.vue";
import StatusTable from "@/components/StatusTable.vue";
// import confirm from "@/components/Confirm.vue";
// import ButtonTip from "@/components/ButtonTip.vue";
import EventBus from "@/event-bus.js";

export default {
  name: "RideStatus",
  components: {
    //    ButtonTip,
    PopUp,
    Confirm,
    StatusTable,
  },
  props: {},

  data() {
    return {
      msg: "NO MESSAGE",
      timeout: 0,
      snackBar: false,
      showRefresh: false,
      unconfirmed: false,
      summaryData: [],
      expanded: [],
      singleExpand: false,
      rideLeader: "",
      calendar: this.$calendar,
      rideLeaderList: ["jay"],
      rideList: [],
      status: "",

      headers: [
        {
          text: "Ride Leader",
          align: "start",
          value: "rideLeader",
          width: "60",
        },
      ],
    };
  },
  methods: {
    async newYearReset() {
      /*
      if (
        await !confirm.open("Delete", "Are you sure?", {
          color: "red",
        })
      ) {
        // yes
        return;
      }
 */ EventBus.$emit("wait", "true");
      //
      //      this.getRides("all", "all", this.u2).then((resp) => {
      var x = await this.updateYear("prevYear").then((resp) => {
        console.log(resp + "********** last year done " + x);
      });
      x = await this.updateYear("currentYear").then((resp) => {
        console.log(resp + "this year done **********" + x);
      });
    },

    reloadTestCalendar() {
      this.msg = "Hang On, this will take a couple of minutes";
      this.$refs.confirm
        .open("Reload Test Calendar", this.msg, { color: "red" })
        .then(() => {});
      EventBus.$emit("wait", "true");
      var url = this.$pythonServer + "/reloadTestCalendar";
      axios({
        method: "GET",
        url: url,
      })
        .then(() => {
          this.msg = "Reload done";
          EventBus.$emit("wait", "false");
          this.$router.push({ path: "/" });

          // alert(this.response);
        })
        .catch((error) => {
          alert(error);
          EventBus.$emit("wait", "false");
          this.snackBar = false;
        });
    },

    async updateYear(year) {
      let rideList = [];
      rideList["none"] = "none";
      var startDate = "";
      var endDate = "";
      if (year === "prevYear") {
        startDate = this.$prevYear + "-1-1";
        endDate = this.$prevYear + "-12-31";
      } else {
        startDate = this.$currentYear + "-1-1";
        endDate = this.$currentYear + "-12-31";
      }

      await this.getRides("all", "all", null, startDate, endDate)
        .then((resp) => {
          rideList = resp;

          rideList = resp;
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
              console.log("ERROR" + rideList[j]);
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
              let ride = resp[j].data.event;
              //              console.log(ride);

              if (year === "prevYear") {
                ride.redit = "single";
              } else {
                ride.redit = "all";
                ride.custom[statusID][0] = pend;
              }
              promises2.push(axios.put(url + ride.id, ride, axiosConfig));
            }
            Promise.all(promises2);
            if (year === "currentYear") {
              //              var title = "Reset Completed";
              //                 this.$refs.popup.open(title);
              this.timout = 5000;
              this.msg = "Reset Completed.";
              this.snackBar = true;
              this.$router.push({ path: "/" });
            }
          });
        })
        .catch((err) => {
          console.log("ERRROR");

          console.log(err);
        });
    },
  },
  mounted() {
    EventBus.$on("unconfirmed", (value) => {
      this.unconfirmed = value;
    });
  },
};
</script>
