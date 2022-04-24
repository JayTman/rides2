<template>
  <div id="List">
    <v-container fluid :class="this.$bgColor">
      <v-row justify="center">
        <h2 class="display-1 font-weight-bold mb-3">Ride List</h2>
      </v-row>
      <RidesTable :rideLeader="this.rideLeader" status="all" />
    </v-container>
  </div>
</template>

<script>
import RidesTable from "@/components/RidesTable";

export default {
  // import EventBus from "@/event-bus";

  //import clickMixin from "@/mixins"
  name: "List",
  // mixins: [clickMixin],
  components: {
    RidesTable,
  },

  data() {
    return {
      rideLeader: "all",
      status: "all",
    };
  },

  methods: {},
};
</script>
