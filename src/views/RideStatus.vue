<template>
  <div id="RideStatus">
    <v-card :color="this.$bgColor">
      <v-card :color="this.$headerColor">
        <v-row justify="center">
          <h2>Ride Leader Email Messages</h2>
        </v-row>

        <v-row justify="space-between">
          <v-col cols="5">
            <v-row justify="center">
              <h3 class="font-weight-bold mb-3">
                Send An Email to All Ride Leaders
              </h3>
            </v-row>
            <!--             <v-card height="44" :class="this.$headerColor" flat> </v-card>
 -->
            <v-row justify="center">
              <Tip
                text="This will send a list of all rides to all ride leaders. </br> Typically you'd only do this once at the beginning of the year."
              >
                <slot>
                  <v-btn
                    color="primary"
                    @click="emailMessage(allRideLeaders, 'all', 'newYear.msg')"
                  >
                    All Rides for <br />
                    the New Year
                  </v-btn>
                </slot>
              </Tip>
              <Tip
                text="This will send a list of pending rides ONLY to ride leaders who have pending rides. <br/> So if a ride leader has confirmed all of their rides,  then they won't see this email."
              >
                <slot>
                  <v-btn
                    color="primary"
                    @click="
                      emailMessage(
                        pendingRideLeaders,
                        'pending',
                        'pendingRides.msg'
                      )
                    "
                  >
                    pending Rides
                  </v-btn>
                </slot>
              </Tip>
            </v-row>
          </v-col>
          <v-col cols="4">
            <!-- 
              <v-select
                :color="this.$headerColor"
                v-model="rideLeader"
                label="Select Name..."
                :items="allRideLeaders"
                @change="setRideLeaderName(rideLeader)"
              >
              </v-select>
 -->
            <v-card color="transparent" height="170" flat>
              <v-row>
                <h3 class="font-weight-bold mb-3">
                  Send an Email to single Ride Leader
                </h3>
              </v-row>
              <v-row>
                <v-card class="transparent" width="308" flat>
                  <v-autocomplete
                    auto-select-first
                    v-model="rideLeader"
                    label="Select
                  Name..."
                    :items="allRideLeaders"
                    @change="setRideLeaderName(rideLeader)"
                    class="transparent"
                  ></v-autocomplete>
                </v-card>
              </v-row>
              <v-row justify="space-around">
                <v-btn
                  color="primary"
                  @click="emailMessage(rideLeader, 'all', 'allRides.msg')"
                  :disabled="rideLeader === '' ? true : false"
                >
                  All Rides
                </v-btn>
                <v-btn
                  color="primary"
                  @click="
                    emailMessage(rideLeader, 'pending', 'pendingRides.msg')
                  "
                  :disabled="rideLeader === '' ? true : false"
                >
                  pending Rides
                </v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>

      <confirm ref="confirm"></confirm>
      <v-card :class="this.$bgColor" height="60">
        <v-row justify="center">
          <h2>Ride Status {{ this.getYear("current") }}</h2>
        </v-row>
      </v-card>
      <template>
        <v-col>
          <StatusTable />
        </v-col>
      </template>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import StatusTable from "@/components/StatusTable.vue";
import Confirm from "@/components/Confirm.vue";
import Tip from "@/components/Tip.vue";
import EventBus from "@/event-bus.js";

export default {
  name: "RideStatus",
  components: {
    Confirm,
    Tip,
    StatusTable,
  },
  props: {},

  data() {
    return {
      snackbar: true,
      showRefresh: false,
      summaryData: [],
      expanded: [],
      singleExpand: false,
      calendar: this.$calendar,
      rideLeader: "",
      rideLeadersSelected: [],
      pendingRideLeaders: [],
      allRideLeaders: [],
      api: "",
      status: "",

      headers: [
        {
          text: "Ride Leader",
          align: "end",
          value: "rideLeader",
          width: "60",
        },
      ],
    };
  },

  methods: {
    setRideLeaderName(name) {
      this.rideLeader = name;
      // alert(getFuncName() + ": " + error)this.rideLeader);
    },

    emailMessage(name, status, messageFile) {
      this.status = status;
      if (typeof name === "string") {
        this.rideLeadersSelected = [];
        this.rideLeadersSelected.push(name);
      } else {
        name = name.join();
      }

      // alert("emailMessage " + name + " " + status);
      var title =
        "Emailing a list of " + this.status.toUpperCase() + " Rides to: ";
      var agreeButtonText = "Send";
      var msg = "";
      if (name === "") msg = "All Ride Leaders";
      else msg = name;
      this.$refs.confirm
        .open(title, msg, { agreeButtonText })
        .then((confirm) => {
          if (confirm === true) {
            console.log("at msg");
            this.msg("okay", messageFile);
          }
        });
      //      this.$refs.popup.open(title, name);
      this.rideLeadersSelected = [];
      this.rideLeadersSelected = name;
      // message = message.slice(1);
    },

    msg(res, msgFile = "") {
      if (res === "okay") {
        var url =
          this.$pythonServer +
          msgFile +
          "?cal=" +
          /*           "summaryMail?cal=" +
           */ this.$calendar +
          "&rideLeader=" +
          encodeURIComponent(this.rideLeadersSelected) +
          "&rideStatus=" +
          this.status +
          "&test=False";
        // alert(url);
        axios({
          method: "GET",
          url: url,
        })
          //          .then(response => {
          .then(true)
          //            alert(this.statusValues);
          //        })
          .catch((error) => {
            alert("summary email" + ": " + error);
          });
        //  else {
        //  alert("Got " + res);
        // }
      }
    },
  },

  mounted() {
    //    EventBus.$on("showRefresh", () => {
    //      this.createSummary();
    //      this.showRefresh = true;
    //    });
    this.api = process.env.VUE_APP_ROOT_API;
    EventBus.$emit("wait", "true");
    /*
     */
    EventBus.$on("allRideLeaders", (x) => {
      this.allRideLeaders = x;
      EventBus.$emit("wait", "false");
    });
    /*
   EventBus.$on("pendingRideLeaders", (x) => {
      this.pendingRideLeaders = x;
      //      alert("setting pending" + this.pendingRideLeaders);
    });
 */
  },
};
</script>
<style>
.v-application {
  line-height: "0.8";
}
v-sheet.list {
  background: hsl(61, 85%, 78%);
}
.v-sheet.v-list {
  color: rgb(230, 230, 159);
}
</style>
