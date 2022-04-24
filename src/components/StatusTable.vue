<template>
  <div id="statusTable">
    <v-container fluid>
      Status: {{ this.statusFieldName }}
      <v-data-table
        v-show="unconfirmed"
        show-expand
        expand-icon="mdi-arrow-down-bold"
        :single-expand="true"
        :headers="headers"
        :itemsPerPage="100"
        item-key="rideLeader"
        footer-props.items-per-page-options="50"
        :items="summaryData"
        :class="this.$bgColor"
      >
        <template v-slot:expanded-item="{ item }">
          <td :colspan="headers.length + 1">
            <v-card>
              <RidesTable :rideLeader="item.rideLeader" status="unconfirmed" />
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-container>
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
      expanded: [],
      rideList: [],
      singleExpand: false,
      rideLeader: "",
      calendar: this.$calendar,
      status: "",
      newRides: [],
      rideLeaderList: [],

      headers: [
        {
          text: "RIDE LEADER",
          align: "start",
          value: "rideLeader",
          width: "15",
        },
      ],
      unconfirmed: null,
    };
  },

  methods: {
    async createSummary() {
      var summaryData = [];

      await this.getRides("all", "unconfirmed").then((resp) => {
        this.rideList = resp;
        EventBus.$emit("wait", "false");
      });
      this.createStatusList();
      var confirm = this.getStatusID("confirm");

      for (var i = 0; i < this.statusList.length; i++) {
        if (this.statusList[i][0] === confirm) {
          continue;
        }
        this.headers.push({
          text: this.statusList[i][1],
          value: this.statusList[i][0],
          width: 10,
        });
      }
      var keys = Object.values(this.statusList);
      for (var cnt = 0; cnt < this.rideList.length; cnt++) {
        var ride = this.rideList[cnt];
        if (ride["who"] === "") {
          continue;
        }
        var rideLeaderIndex = this.findIndexByKey(
          summaryData,
          "rideLeader",
          ride["who"]
        );

        // ride leader not in list
        if (rideLeaderIndex === -1) {
          this.unconfirmed = true;
          EventBus.$emit("unconfirmed", "true");
          summaryData.push({ rideLeader: ride["who"] });
          rideLeaderIndex = this.findIndexByKey(
            summaryData,
            "rideLeader",
            ride["who"]
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
        var val = ride["custom"][this.statusFieldID][0];
        summaryData[rideLeaderIndex][val] += 1;
      }
      this.summaryData = summaryData;
      //      this.$emit("okay");
    },
  },
  mounted() {
    EventBus.$emit("wait", "true");
    this.createSummary();
  },
};
</script>
