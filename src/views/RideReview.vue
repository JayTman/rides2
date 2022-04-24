<template>
  <div id="rideReview">
    <v-container fluid :class="this.$bgColor">
      <v-row class="text-center">
        <v-col>
          <h2>Confirm Your Rides</h2>
          Stat {{ statusName }} - {{ this.rideStatusName }}
        </v-col>
      </v-row>

      <v-layout align-start col>
        <v-col v-for="item in rideList" :key="item.id">
          <v-row>
            <v-col>
              <v-dialog persistent v-model="item.dialog" width="400">
                <v-card :color="cardColors.bg" dark>
                  <v-toolbar :color="cardColors.header" dark>
                    Describe your changes in the box below. <br />
                  </v-toolbar>
                  <v-textarea
                    background-color="#3b4474"
                    auto-grow
                    outlined
                    hint="press SEND when you're done."
                  ></v-textarea>
                  <v-card-actions>
                    <v-btn
                      dark
                      color="green darken-1"
                      @click="emailInfo(item, rideChgInfo)"
                      >Send
                    </v-btn>
                    <div id="foo"></div>
                    <v-btn
                      dark
                      color=" red darken-1"
                      @click="item.dialog = false"
                      >Cancel</v-btn
                    >
                  </v-card-actions>
                  <rideCard :item="item" :statusName="statusName" />
                </v-card>
              </v-dialog>
              <v-card color="#3b4474" dark width="300">
                <v-row justify="center">
                  <v-col>
                    <v-btn
                      o
                      v-model="item.custom"
                      color="#6c3b74"
                      @click="setStatus('confirm', item)"
                      :disabled="checkConfirm(item.custom, 'confirm')"
                    >
                      Confirm Ride
                    </v-btn>
                    <v-btn
                      color="#743b44"
                      @click="setStatus('change', item)"
                      :disabled="checkConfirm(item.custom, 'change')"
                    >
                      Change Ride
                    </v-btn>
                  </v-col>
                </v-row>
                <rideCard :item="item" :statusName="statusName" />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import RideCard from "@/components/RideCard.vue";
import EventBus from "../event-bus";
// import buttontip from "@/components/ButtonTip.vue";
// const server = "http://192.168.1.22/";
export default {
  name: "rideReview",
  components: {
    RideCard,
  },
  props: {
    status: {
      Type: String,
      vaule: "unconfirmed",
    },
    rideLeader: {
      Type: String,
      value: "JoAnn Davis",
    },
    showMenu: {
      Type: Boolean,
    },
  },
  data() {
    return {
      dialog2: false,
      modifyInfo: "",
      rideChgInfo: "",
      changePending: "",
      statusName: "",
      cardColors: {
        bg: "c9cad9",
        "Lavender Blue": "d1d2f9",
        fg: "a3bcf9",
        "Cornflower Blue": "7796cb",
        header: "576490",
      },

      rideList: [],
      filled: true,
      leaderList: [],
      statusID: this.statusFieldID,
      statusList: [],
      customFields: [],
      cardColor: "yellow",
    };
  },
  methods: {
    openWin(ride) {
      var win = window.open("about:blank");
      var url = "https://teamup.com/" + this.$calendar + "/events/" + ride; //    oalert("oen");
      //  this.teamup = url;
      win.location = url;
    },

    emailInfo(ride, desc) {
      //      var templateString = this.$refs.rideCard(ride, this.statusFieldName);

      var msg =
        ride.who +
        " has requested the following changes for the ride: <br />" +
        ride.title +
        " on " +
        ride.Date +
        "<br /><br />";
      var btn =
        "<div><a href= 'https://teamup.com/" +
        this.$calendar +
        "/events/" +
        ride.id +
        "'";
      btn +=
        "target='_blank' rel='noreferrer noopener external' style=margin-left:5px";
      btn += ">Edit the Ride</a></div>";
      //        "<img src='https://ebcrides.org/images/cal/google-calendar.png' alt=''>Edit</a></div>";

      var url =
        this.$pythonServer +
        "/rideChangeMsg?msg=" +
        msg +
        desc +
        btn +
        "&rideLeader=" +
        ride.who;
      axios({
        method: "GET",
        url: url,
      }).then((response) => {
        var success = response.data;
        this.setStatus("changeit", ride);
        console.log(success);
      });
    },

    setStatus(newStatus, ride) {
      var x = 1;
      if (newStatus === "change") {
        ride.dialog = true;
        console.log(x);
        return;
      }
      if (newStatus === "changeit") {
        ride.dialog = false;
        newStatus = "change";
      }
      var APIkey =
        "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

      var url =
        "https://api.teamup.com/" + this.$calendar + "/events/" + ride["id"];

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
          var current = response.data["event"];
          var x = this.getStatusID(newStatus);
          console.log(x);
          var sid = this.statusFieldID;
          var snm = this.statusFieldName;
          current["custom"][this.statusFieldID][0] = x;
          current.redit = "all";
          axios({
            method: "PUT",
            url: url,
            data: current,
            //        data: newData,
            headers: {
              "Teamup-Token": APIkey,
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => {
              ride["custom"] = response.data.event["custom"];
              var index = this.findIndexByKey(this.config, "id", sid);
              var val = this.findNameByKey(
                this.config[index]["type_data"]["options"],
                "id",
                ride["custom"][sid][0]
              );
              ride["displayCustom"][snm] = val;
            })
            .catch((error) => {
              console.log(error);
              EventBus.$emit("wait", "false");
            });
        })
        .catch((error) => {
          console.log(error);
          EventBus.$emit("wait", "false");
        });
      //      var subject = ride.title;
      //      var emailId = "jaytwery@gmail.com";
      //      var body = ride.notes;
      //      var from = ride.who;
      EventBus.$emit("showRefresh", "true");
      //        "https://teamup.com/" + this.$calendar + "/events/" + rideID + "";
      //    oalert("oen");
      //  this.teamup = url;
    },

    findIndexByKeyValue(_array, key, value) {
      for (var i = 0; i < _array.length; i++) {
        if (_array[i][key] == value) {
          return i;
        }
      }
      return -1;
    },
    isStatus2(field) {
      if (field === this.statusFieldName) {
        return true;
      } else {
        return false;
      }
    },
    checkConfirm(custom, field) {
      var id = custom[this.statusFieldID][0];
      var confirm = this.getStatusID("confirm");

      var change = this.getStatusID("change");
      if (id === confirm && field === "confirm") {
        return true;
      } else if (id === change && field === "change") {
        return true;
      } else {
        return false;
      }
    },
    async init() {
      EventBus.$emit("wait", "true");
      var x = await this.getRides(this.rideLeader, this.status).then((resp) => {
        this.rideList = resp;
        console.log(x);
        EventBus.$emit("showMenu", "false");
        EventBus.$emit("wait", "fa lse");
        //        this.statusName = this.rideStatusName;
      });
    },
  },
  mounted() {
    //      var rideLeader = "Joanne Davis";
    this.init();
  },
};
</script>
<style>
.wrap-text {
  -webkit-line-clamp: unset !important;
  word-break: normal;
}

div.button {
  background: purple;
  color: white;
  margin-bottom: 2px;
  padding: 5px;
}

div.button:active {
  animation: blink 0.5s 20 alternate;
}

@keyframes blink {
  from {
    background-color: purple;
  }
  to {
    background-color: red;
  }
}
</style>
