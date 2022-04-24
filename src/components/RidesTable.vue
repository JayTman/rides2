<template>
  <div id="ridesTable">
    <div v-if="rideLeader === 'all'">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="search"
            prefix="Filter:"
            label=""
            prepend-icon="mdi-magnify"
            single-line
            width="25%"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        hide-details
        sortable
        multi-sort
        :class="fgColor"
        :headers="allHeaders"
        :items="this.rideList"
        :items-per-page="100"
        fixed-header
      >
        <template v-slot:item.edit="{ item }">
          <v-btn class="primary" small @click="teamUpEdit(item.id)">
            Edit
          </v-btn>
        </template>
        <template v-slot:item.tz="{ item }">
          <div :key="statusFieldName">
            <v-chip :color="getColor(item[statusFieldName])" small>
              {{ item[statusFieldName] }}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <v-data-table
        hide-details
        hide-default-header
        hide-default-footer
        dense
        :class="fgColor"
        :headers="allHeaders"
        :items="this.rideList"
        :items-per-page="100"
        height="230px"
      >
        >
        <template v-slot:item.edit="{ item }">
          <v-btn class="primary" small @click="teamUpEdit(item.id)">
            Edit
          </v-btn>
        </template>
        <template v-slot:item.tz="{ item }">
          <div :key="statusFieldName">
            <v-chip small :class="getColor(item[statusFieldName])">
              {{ item[statusFieldName] }}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import EventBus from "@/event-bus";

export default {
  name: "ridesTable",
  fgColor: "primary",
  props: {
    status: {
      Type: String,
    },
    rideLeader: {
      Type: String,
    },
  },
  data() {
    return {
      rides: [],
      fgColor: "this.$fgColor",
      hidden: null,
      search: "",
      //      customHeaders: [],
      headers: [
        { text: "Ride Leader", align: "start", value: "who" },
        { text: "Date", value: "Date", width: "8" },
        { text: "Name", value: "title" },
        { text: "Status", value: "tz" },
      ],
    };
  },

  methods: {
    getColor(Status) {
      if (Status.toLowerCase().search("confirm") > -1) {
        return "green lighten-3";
      } else if (Status.toLowerCase().search("cancel") > -1) {
        return "orange ligten-3";
      } else if (Status.toLowerCase().search("change") > -1) {
        return "blue lighten-4";
      } else if (Status.toLowerCase().search("pend") > -1) {
        return "red lighten-3";
      }
      //      else if (Status.lower.match(/sun/g) > -1) return "red";
      //      else if (Status.lower.match(/wed/g) > -1) return "green";
      else return "grey";
    },
    teamUpEdit(rideID) {
      const win = window.open("about:blank");
      EventBus.$emit("showRefresh", "true");
      var url =
        "https://teamup.com/" + this.$calendar + "/events/" + rideID + "";
      //    oalert("oen");
      //  this.teamup = url;
      win.location = url;
    },
  },
  computed: {
    allHeaders() {
      var h = [{ text: "", value: "edit" }];
      return h.concat(this.headers.concat(this.customHeaders));
    },
    rideStatus() {
      return this.statusFieldName;
    },
    rideList() {
      var rd = [];
      var confirm = this.getStatusID("confirm");
      console.log(this.rideLeader);
      for (var cnt = 0; cnt < this.rides.length; cnt++) {
        if (this.rideLeader !== "all") {
          if (this.rides[cnt].who !== this.rideLeader) {
            continue;
          }
        }
        console.log("id " + this.statusFieldID);
        console.log("status " + this.status);
        if (this.status !== "all") {
          if (this.rides[cnt]["custom"][this.statusFieldID][0] === confirm) {
            continue;
          }
        }
        rd.push(this.rides[cnt]);
      }
      return rd;
    },
    freq() {
      return this.item.rule.slice(5, 10);
    },
  },
  mounted() {
    this.getRides("all", "all").then((response) => {
      this.rides = response;
      this.fgColor = this.$fgColor;
    });
  },

  //    var x = this.rides.pop();
  //    alert("rideTable" + x);
  //    this.rides.push(x);
  /*   var rides = [];
//     console.log("mounted");
    rides = this.getRides(this.status, this.rideLeader);
    //    var x = this.rideListst.pop();
    //    this.rideList.push(x);
    //   var rides = [];
    for (var cnt = 0; cnt < rides.length; cnt++) {
      if (rides[cnt].rrule.search("YEAR") === -1) {
        continue;
      }
      //      this.rides.push(this.rideList[cnt]);
    }
    console.log("rides " + rides);
  },*/
};
</script>
<style scoped>
*body {
  background-color: #0c030a;
}
</style>
