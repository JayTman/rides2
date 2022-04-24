<template>
  <div id="RideStatus">
    <v-row>
      <v-col>
        <v-card class="yellow lighten-3 flat">
          <v-row justify="center">
            <h3 class="font-weight-bold mb-3">
              Send An Email to All Ride Leaders
            </h3>
          </v-row>
          <v-card
            height="70px"
            flat
            class="yellow lighten-3"
            justify="space-between"
          >
          </v-card>
          <v-btn color="primary" @click="emailMessage('all', 'all', 1)">
            New Year Email
          </v-btn>
          <v-btn color="primary" @click="emailMessage('all', 'unconfirmed', 1)">
            Unconfirmed Reminder
          </v-btn>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="yellow lighten-3" flat>
          <v-row justify="center">
            <h3 class="font-weight-bold mb-3">
              Send an Email to a Single Ride Leader
            </h3>
          </v-row>
          <v-row justify="center">
            <v-sheet width="200">
              <v-select
                light
                class="yellow lighten-3"
                background-color=" yellow lighen-2"
                v-model="rideLeader"
                @change="setRideLeaderName(rideLeader)"
                :items="rideLeaderList"
                label="Select Name..."
              >
              </v-select>
            </v-sheet>
          </v-row>
          <v-btn
            color="primary"
            @click="emailMessage(rideLeader, 'all', 1)"
            :disabled="rideLeader === '' ? true : false"
          >
            A List of All Rides
          </v-btn>
          <v-btn
            color="primary"
            @click="emailMessage(rideLeader, 'unconfirmed', 1)"
            :disabled="rideLeader === '' ? true : false"
          >
            Unconfirmed Reminder
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <PopUp v-on:okay="msg('okay')" v-on:cancel="msg('cancel')" ref="popup">
      </PopUp>
      <div v-if="showRefresh === true">
        <v-btn @click="createSummary(true)"> Refresh When Done Editing</v-btn>
      </div>
    </v-row>
    <v-card>
      <v-row justify="center">
        <h2 class="display-1 font-weight-bold mb-3">Ride Leader Status</h2>
      </v-row>
    </v-card>
    <v-row>
      <v-col>
        <StatusTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import PopUp from "@/components/PopUp.vue";
import StatusTable from "@/components/StatusTable.vue";
// import ButtonTip from "@/components/ButtonTip.vue";
import EventBus from "@/event-bus.js";

export default {
  name: "RideStatus",
  components: {
    //    ButtonTip,
    PopUp,
    StatusTable,
  },
  props: {},

  data() {
    return {
      showRefresh: false,
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
    emailMessage(name, status, count) {
      if (count === 0) return;
      this.status = status;
      // alert("emailMessage " + name + " " + status);
      if (name === "all") {
        var message = this.rideLeaderList.join();
        message = message.slice(1);
      } else {
        message = name;
      }
      this.setRideLeaderName(message);
      var title = "Sending an Email for " + this.status + " rides to ";
      this.$refs.popup.open(title, message);
    },
    setRideLeaderName(name) {
      this.rideLeader = name;
      // alert(getFuncName() + ": " + error)this.rideLeader);
    },

    msg(res) {
      if (res === "okay") {
        var url =
          this.$pythonServer +
          "/summaryMail?cal=" +
          this.$calendar +
          "&rideLeader=" +
          this.rideLeader +
          "&rideStatus=" +
          this.status +
          "&test=False";
        // alert(url);
        axios({
          method: "GET",
          url: url,
        })
          //          .then(response => {
          .then(null)
          //            alert(this.rideLeaderList);
          //        })
          .catch((error) => {
            alert("summary email" + ": " + error);
          });
        //  else {
        //  alert("Got " + res);
        // }
      }
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
  },
};
</script>
