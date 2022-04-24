<template>
  <div id="RideStatus">
    <v-container fluid :class="this.$bgColor">
      <v-card :color="this.$headerColor" height="240">
        <v-row justify="center">
          <h2>Ride Leader Email Messages</h2>
        </v-row>
        <v-row>
          <v-col>
            <v-row justify="center">
              <h3 class="font-weight-bold mb-3">
                Send An Email to All Ride Leaders
              </h3>
            </v-row>
            <v-card height="94" :class="this.$headerColor" flat> </v-card>
            <v-row justify="center">
              <v-btn
                color="primary"
                @click="emailMessage(allRideLeaders, 'all')"
              >
                New Year Email
              </v-btn>
              <v-btn
                color="primary"
                @click="emailMessage(unconfirmedRideLeaders, 'unconfirmed')"
              >
                Unconfirmed Rides
              </v-btn>
            </v-row>
          </v-col>
          <v-col>
            <v-row justify="center">
              <h3 class="font-weight-bold mb-3">
                Send an Email to single Ride Leader
              </h3>
            </v-row>
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
            <v-card class="primary" width="350" dark>
              <v-autocomplete
                v-model="rideLeader"
                label="Select
                  Name..."
                :items="allRideLeaders"
                @change="setRideLeaderName(rideLeader)"
              ></v-autocomplete>
            </v-card>
            <v-btn
              color="primary"
              @click="emailMessage(rideLeader, 'all')"
              :disabled="rideLeader === '' ? true : false"
            >
              A List of All Rides
            </v-btn>
            <v-btn
              color="primary"
              @click="emailMessage(rideLeader, 'unconfirmed')"
              :disabled="rideLeader === '' ? true : false"
            >
              Unconfirmed Rides
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <PopUp v-on:okay="msg('okay')" v-on:cancel="msg('cancel')" ref="popup">
      </PopUp>
      <v-card :class="this.$bgColor">
        <v-row justify="center">
          <h2>Ride Leader Status {{ this.$currentYear }}</h2>
        </v-row>
        <v-row>
          <v-col>
            <template>
              <StatusTable />
            </template>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
// import Login from "@/components/Login.vue";
import PopUp from "@/components/PopUp.vue";
import StatusTable from "@/components/StatusTable.vue";
// import ButtonTip from "@/components/ButtonTip.vue";
import EventBus from "@/event-bus.js";

export default {
  name: "RideStatus",
  components: {
    //    ButtonTip,
    PopUp,
    //    Login,
    StatusTable,
  },
  props: {},

  data() {
    return {
      showRefresh: false,
      summaryData: [],
      expanded: [],
      singleExpand: false,
      calendar: this.$calendar,
      statusList: [],
      rideLeader: "",
      rideLeadersSelected: [],
      unconfirmedRideLeaders: [],
      allRideLeaders: [],
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
    setRideLeaderName(name) {
      this.rideLeader = name;
      // alert(getFuncName() + ": " + error)this.rideLeader);
    },

    emailMessage(name, status) {
      this.status = status;
      if (typeof name == "string") {
        this.rideLeadersSelected = [];
        this.rideLeadersSelected.push(name);
      } else {
        name = name.join();
      }

      // alert("emailMessage " + name + " " + status);
      var title =
        "Emailing a list of " + this.status.toUpperCase() + " Rides to: ";
      this.$refs.popup.open(title, name);
      this.rideLeadersSelected = [];
      this.rideLeadersSelected = name;
      // message = message.slice(1);
    },

    msg(res) {
      if (res === "okay") {
        var url =
          this.$pythonServer +
          "summaryMail?cal=" +
          this.$calendar +
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
          //            alert(this.statusList);
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

    EventBus.$emit("wait", "true");
    this.createSummary();
    EventBus.$emit("wait", "false");
    EventBus.$on("allRideLeaders", (x) => {
      this.allRideLeaders = x;
    });
    EventBus.$on("unconfirmedRideLeaders", (x) => {
      this.unconfirmedRideLeaders = x;
      //      alert("setting unconfirmed" + this.unconfirmedRideLeaders);
    });
  },
};
</script>
