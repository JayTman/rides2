<template>
  <div id="statusTable">
    <v-data-table
      fixed-header
      v-show="pending"
      show-expand
      :height="windowSize.y"
      hide-default-footer
      expand-icon="mdi-menu-open --color blue -lighten-4 white--text"
      :headers="headers"
      item-key="rideLeader"
      contextmenu=""
      single-expand
      :itemsPerPage="-1"
      :items="summaryData"
      :class="this.$bgColor"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      @item-expanded="newRL($event['item'])"
    >
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <v-container>
            <RidesTable
              :rideLeader="item.rideLeader"
              rideStatus="pending"
              :ridesList="rideLeaderList"
              :statusFieldN="statusFieldName"
              hideHeader="hide"
            />
          </v-container>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// import axios from "axios";
import RidesTable from "@/components/RidesTable.vue";
import EventBus from "@/event-bus.js";

export default {
  name: "StatusTable",
  components: {
    RidesTable,
  },
  props: {},

  data() {
    return {
      showRefresh: false,
      showNewYear: true,
      summaryData: [],
      //      expanded: [],
      rideList: [],
      singleExpand: false,
      rideLeader: "",
      calendar: this.$calendar,
      status: "",
      itemExpanded: null,
      newRides: [],
      rideLeaderList: [],
      headerColor: this.$fgColor,
      windowSize: {
        x: 0,
        y: 0,
      },

      headers: [
        {
          text: "RIDE LEADER",
          align: "start",
          value: "rideLeader",
          width: "55",
        },
      ],
      pending: true,
    };
  },

  methods: {
    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight - 350,
      };
    },
    async newRL(it) {
      await this.getRides(it.rideLeader, "pending").then((resp) => {
        EventBus.$emit("wait", "false");
        this.rideLeaderList = resp;
      });
    },

    async createSummary() {
      var summaryData = [];
      var rd = [];
      EventBus.$emit("wait", "true");
      await this.getRides("all", "pending").then((resp) => {
        rd = resp;
      });
      this.rideList = rd;
      this.getstatusValues();
      var confirm = this.getStatusID("confirm");

      for (var i = 0; i < this.statusValues.length; i++) {
        this.headers.push({
          text: this.statusValues[i][1],
          value: this.statusValues[i][0],
          width: 5,
        });
      }
      var keys = Object.values(this.statusValues);
      for (var cnt = 0; cnt < this.rideList.length; cnt++) {
        var ride = this.rideList[cnt];
        if (ride.who === "") {
          continue;
        }
        var rideLeaderIndex = this.findIndexByKey(
          summaryData,
          "rideLeader",
          ride.who
        );

        // ride leader not in list
        if (rideLeaderIndex === -1) {
          //          this.pending = true;
          if (ride.status === confirm) {
            continue;
          }
          summaryData.push({
            rideLeader: ride.who,
          });
          rideLeaderIndex = this.findIndexByKey(
            summaryData,
            "rideLeader",
            ride.who
          );
          if (rideLeaderIndex === -1) {
            return "ERROR";
          }
          // initialize status fields to zereo
          for (i = 0; i < keys.length; i++) {
            summaryData[rideLeaderIndex][keys[i][0]] = 0;
          }
        }
        //          if (this.headers.includes(status) === false) {
        //            this.headers.push(status);
        //        }
        var val = ride.custom[this.statusFieldID][0];
        summaryData[rideLeaderIndex][val] += 1;
      }
      this.summaryData = summaryData;
    },
    // results are loop through list of ride leaders
    /*       for (i = 0; i < summaryData.length; i++) {
        for (var j = 0; j < this.statusValues.length; j++) {
          if (this.statusValues[j][0] === confirm) {
            continue;
          }
           on
          if (summaryData[i][this.statusValues[j][0]] > 0) {
            this.summaryData.push(summaryData[i]);
            break;
          }
        }
      }
 */ //      this.$emit("okay");
  },
  mounted() {
    EventBus.$emit("wait", "true");
    this.createSummary();
    this.onResize();
  },
};
</script>
<style>
.foo {
  justify-items: end;
  justify-content: end;
  text-align-last: left;
  font-size: 11px;
  line-height: 24px;
  font-weight: inherit;
}
.cols {
  width: 30;
}
</style>
