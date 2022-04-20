<template>
  <v-container fluid :class="this.$bgColor">
    <v-row>
      <!--       <v-layout align-start wrap col justify-space-around>
 -->
      <!--         bg: 
        fg: "#57647f",
        header: "#576490",
 -->
      <v-card
        v-for="item in rideList"
        :key="item.id"
        dark
        class="card"
        :color="
          checkConfirm(item.custom, 'change')
            ? changeColor
            : checkConfirm(item.custom, 'confirm')
            ? confirmColor
            : pendColor
        "
        width="300"
        elevation="5"
      >
        <v-card :color="cardColors.bg">
          <v-col>
            <v-row justify="space-around">
              <v-btn
                v-model="item.custom"
                :color="confirmColor"
                light
                @click="setStatus('confirm', item)"
                :disabled="checkConfirm(item.custom, 'confirm')"
              >
                Confirm Ride
              </v-btn>
              <v-btn
                class="button"
                :color="changeColor"
                @click="setStatus('change', item)"
                :disabled="checkConfirm(item.custom, 'change')"
              >
                <!-- 
                  color="#743b44"
 -->
                Change Ride
              </v-btn>
            </v-row>
          </v-col>
        </v-card>
        <rideCard :item="item" :statusName="statusName" />
        <v-dialog persistent v-model="item.dialog" width="400">
          <v-card :color="cardColors.bg" dark>
            <v-col>
              <v-toolbar :color="cardColors.header" dark>
                Describe your changes in the box below. <br />
              </v-toolbar>
              <v-textarea
                background-color="#3b4474"
                auto-grow
                outlined
                clearable
                hint="press SEND when you're done."
                v-model="rideChgInfo"
              ></v-textarea>
              <v-card-actions>
                <v-btn
                  dark
                  color="green darken-1"
                  @click="emailInfo(item, rideChgInfo)"
                  >Send
                </v-btn>
                <v-btn dark color=" red darken-1" @click="item.dialog = false"
                  >Cancel</v-btn
                >
              </v-card-actions>
              <rideCard :item="item" :statusName="statusName" />
            </v-col>
          </v-card>
        </v-dialog>
      </v-card>
      <!--       </v-layout>
 -->
    </v-row>
  </v-container>
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
    rideStatus: {
      Type: String,
      vale: "pending",
    },
    rideLeader: {
      Type: String,
      value: "JoAnn Davis",
    },
  },
  data() {
    return {
      statusField: "foo",
      confirmColor: "#18ff03 ",
      changeColor: "orange lighten-3 black--text ",

      pendColor: "yellow  lighten-2 black--text ",
      dialog2: false,
      modifyInfo: "",
      rideChgInfo: "",
      changePending: "",
      statusName: "",
      cardColors: {
        bg: "grey  black--text ",
        header: "#576490",
      },
      rideList: [],
      filled: true,
      leaderList: [],
      statusID: this.statusFieldID,
      statusValues: [],
      customFields: [],
    };
  },
  methods: {
    /*
            #buttons = ""
        ## get time and date into format that google likes
        #p= parse(ride['start_dt'])
        #tz = dt.datetime.strftime(p, '%z')
        #if tz == "":
            #tz = 0
        #else:
            #tz = int(dt.datetime.strftime(p, '%z')[:3])

        #p = p - relativedelta(hours=+tz)
        #sdate = dt.datetime.strftime(p,'%Y%m%dT%H%M00Z')
        #p= parse(ride['end_dt'])
        #p = p - relativedelta(hours=+tz)
        #edate = dt.datetime.strftime(p,'%Y%m%dT%H%M00Z')
        #gcal = "https://calendar.google.com/calendar/r/eventedit?sprop=website:www.teamup.com"
        #gcal += "&text=" + quote_plus(str(ride['title'])) + "&dates=" + sdate + "/"
        #gcal += edate
        #gcal += "&location=" + quote_plus(str(ride['location'])) + "&details=" + quote(str(ride['notes']))
        #gcal += "a&sf=True"


        #googleButton = "<div style=-wrap:wrap;><a href='" + gcal + "' target='_blank' rel='noreferrer noopener external' style=margin-left:5px>"
        #googleButton += "<img src='https://ebcrides.org/images/cal/google-calendar.png' alt=''></a>"

        #iCalButton = "<a href='https://teamup.com/" + calendar + "/events/" + ride['id'] + ".ics' download='EBC_Ride'>"
        #iCalButton += "<img src='https://ebcrides.org/images/cal/icalendar.png' alt='' style=margin-left:55px;></a>"


        #buttons += "<h6 style=text-align:left>Press the button below to add this to your personal calendar</h6><br>" + googleButton + iCalButton
*/
    openWin(ride) {
      var win = window.open("about:blank");
      var url = "https://teamup.com/" + this.$calendar + "/events/" + ride; //    oalert("oen");
      //  this.teamup = url;
      win.location = url;
    },

    emailInfo(ride, desc) {
      //      var templateString = this.$refs.rideCard(ride, this.statusFieldName);

      var msg = "<p><h3 >" + ride.Date + " " + ride.title + "</h3></p>";
      msg +=
        ride.who +
        " has requested the following changes for  thsis ride.  <br />";

      var btn =
        "<div><a href= 'https://teamup.com/" +
        this.$calendar +
        "/events/" +
        ride.id +
        "  target=editRide'";
      btn += "<button class='btn'>Edit the Ride</button> </a></div>";

      // btn += "</body><style>";
      btn +=
        "</body><style>  .btn {   background-color:  #154c81; color:white;  padding: 10px 24px; ";
      btn +=
        "font-size: 14px;  display: inline-block; text-decoration: none; }  .btn:hover {background:  #88aed1 ;} ";
      btn +=
        " .desc {  background: #FFE082; color:black;  padding: 10px 24px; }";
      btn += " html { background-color: #eee; } </style> </html>";

      var url =
        this.$pythonServer +
        "/rideChangeMsg?" +
        "rideLeader=" +
        // "rideLeader=" +
        ride.who +
        "&msg=" +
        encodeURIComponent(
          msg + "<p readonly class='desc'>" + desc + "</p></br>" + btn
        );

      axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          var success = response.data;
          this.setStatus("changeit", ride);
          console.log(success);
          ride.dialog = false;
        })
        .catch((error) => {
          alert(error);
          ride.dialog = false;
          desc = "";
          EventBus.$emit("wait", "false");
        });
    },

    setStatus(newStatus, ride) {
      var x = 1;
      if (newStatus === "change") {
        ride.dialog = true;
        console.log("setting status to: " + x);
        return;
      }
      if (newStatus === "changeit") {
        ride.dialog = false;
        newStatus = "change";
      }
      var APIkey =
        "ca3fec0bc53190c90863e0f41579e27cbc98a57a97c909455df7db816f4ae4bd";

      var url =
        "https://api.teamup.com/" + this.$calendar + "/events/" + ride.id;

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
          var current = response.data.event;
          var x = this.getStatusID(newStatus);
          console.log("new status id: " + x);
          var sid = this.statusFieldID;
          this.statusName = this.statusFieldName;
          current.custom[this.statusFieldID][0] = x;
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
              ride.custom = response.data.event.custom;
              var index = this.findIndexByKey(this.config, "id", sid);
              var val = this.findNameByKey(
                this.config[index].type_data.options,
                "id",
                ride.custom[sid][0]
              );
              ride.displayCustom[this.statusName] = val;
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

    /*     findIndexByKeyValue(_array, key, value) {
      for (var i = 0; i < _array.length; i++) {
        if (_array[i][key] === value) {
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
 */
    checkConfirm(custom, field) {
      var id = custom[this.statusFieldID][0];
      var confirm = this.getStatusID("confirm");

      var change = this.getStatusID("change");
      if ((id === confirm || id === change) && field === "confirm") {
        return true;
        //      } else if (id === change && field === "change") {
      }
      if (id === change && field === "change") {
        return true;
      }
      return false;
    },
    async init() {
      EventBus.$emit("wait", "true");
      //      alert(this.rideStatus + this.rideLeader);
      var x = await this.getRides(this.rideLeader, this.rideStatus).then(
        (resp) => {
          this.rideList = resp;
          this.statusName = this.statusFieldName;
          EventBus.$emit("showMenu", "false");
          EventBus.$emit("wait", "false");
          //        this.statusName = this.rideStatusName;
        }
      );
      console.log(x);
    },
  },
  mounted() {
    //      var rideLeader = "Joanne Davis";
    this.init();
  },
};
</script>
<style scoped>
.v-sheet.v-card {
  margin-bottom: 10px;
}

.wrap-text {
  -webkit-line-clamp: unset !important;
  word-break: normal;
}

.btn {
  background-color: purple;
}
.card {
  border: 8px solid #18ff03;
  border-top: 25px solid #18ff03;
  border-bottom: 0px solid #7deba749;
  margin: 10px;
}
</style>
