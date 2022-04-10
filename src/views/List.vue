<template>
  <div id="List">
    <v-card :color="this.$headerColor">
      <v-row justify="center" align="center">
        <h2 class="display-1 font-weight-bold mb-3">Rides List</h2>
      </v-row>
    </v-card>
    <v-card :color="this.$bgColor">
      <template>
        <RidesTable
          rideLeader="all"
          ridesStatus="all"
          :ridesList="this.ridesList"
          :statusFieldN="this.statusFieldName"
          hideHeader="nohide"
        />
      </template>
    </v-card>
  </div>
</template>

<script>
import RidesTable from "@/components/RidesTable";

export default {
  // import EventBus from "@/event-bus";

  // import clickMixin from "@/mixins"
  name: "List",
  // mixins: [clickMixin],
  components: {
    RidesTable,
  },

  data() {
    return {
      rideLeader: "all",
      status: "all",
      ridesList: [],
    };
  },

  methods: {
    async init(rideLeader, rideStatus) {
      var x = await this.getRides(
        rideLeader,
        rideStatus,
        null,
        "1/1/" + this.getYear("current"),
        "12/1/" + this.getYear("current")
      ).then((response) => {
        this.ridesList = response;
        this.fgColor = this.$fgColor;
        if (rideStatus === "all") {
          this.allHeaders = [{ text: "Calendar", value: "edit" }];
          this.hideHeader = null;
          // this.allHeaders.concat(this.headers.concat(this.customHeaders));
        }
        console.log(x);
      });
    },
  },

  mounted() {
    this.init("all", "all");
  },
};
</script>
