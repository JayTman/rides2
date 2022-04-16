<template>
  <div id="ridesTable">
    <v-card :color="this.$headerColor">
      <v-row justify="center">
        <div v-if="rideLeader === 'all'">
          <Tip
            text="The phrase you enter on the Filter line will filer across all the colums in the report below. <br/> You can sort on one or more columns by clicking on the column heading(s) you wan to be sorted."
          >
            <slot>
              <v-text-field
                v-model="search"
                prefix=""
                label="Search & filter rides"
                prepend-icon="mdi-magnify"
                single-line
              ></v-text-field>
            </slot>
          </Tip>
        </div>
      </v-row>
    </v-card>

    <v-data-table
      hide-default-footer
      :hide-default-header="hideHeader === 'nohide' ? false : true"
      dense
      :height="windowSize.y"
      single-expand
      :fixed-header="hideHeader === 'nohide' ? true : false"
      :class="this.$fgColor"
      :headers="headers"
      :items="ridesList"
      :search="search"
      :itemsPerPage="-1"
    >
      <!--       <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th v-for="h in headers" :class="headerColor" :key="h.rideLeader">
              <span>{{ h.text }}</span>
            </th>
          </tr>
        </thead>
      </template>
 -->
      <template v-slot:item.edit="{ item }">
        <v-btn class="primary" small @click="teamUpEdit(item.id)"> Edit </v-btn>
      </template>
      <template v-slot:item.tz="{ item }">
        <v-chip :color="getColor(item[statusFieldName])">
          <v-icon color="black"> mdi-bicycle </v-icon>
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>
<script>
// import axios from "axios";
import Tip from "@/components/Tip";
import EventBus from "@/event-bus";

export default {
  components: {
    Tip,
  },
  name: "RidesTable",
  props: {
    rideLeader: {
      Type: String,
    },
    rideStatus: {
      Type: String,
    },
    ridesList: {
      Type: Array,
    },
    statusFieldN: {
      Type: String,
    },
    hideHeader: {
      Type: String,
    },
  },
  data() {
    return {
      windowSize: {
        x: 0,
        y: 0,
      },
      fgColor: "this.$fgColor",
      hidden: null,
      search: "",
      //      customHeaders: [],
      headers: [
        { text: "", value: "edit" },
        { text: "Ride Leader", align: "end", value: "who" },
        { text: "Date", value: "Date" },
        { text: "Name", value: "title" },
        { text: "", value: "tz", sortable: false },
      ],
    };
  },

  methods: {
    onResize(rideLeader) {
      console.log("rideleader" + rideLeader);
      if (rideLeader === "all")
        this.windowSize = {
          x: window.innerWidth,
          y: window.innerHeight - 200,
        };
      else this.windowSize = { x: window.innerWidth, y: "" };
    },
    getColor(Status2) {
      if (Status2.toLowerCase().search("confirm") > -1) {
        return "green";
      } else if (Status2.toLowerCase().search("cancel") > -1) {
        return "pink lighten-1";
      } else if (Status2.toLowerCase().search("leader") > -1) {
        return "pink darken-1 ";
      } else if (Status2.toLowerCase().search("change") > -1) {
        return "dee-purple accent-2";
      } else if (Status2.toLowerCase().search("pend") > -1) {
        return "brown lighten-1  white--text";
      }
      //      else if (Status.lower.match(/sun/g) > -1) return "red";
      //      else if (Status.lower.match(/wed/g) > -1) return "green";
      else return "grey";
    },
    teamUpEdit(rideID) {
      EventBus.$emit("showRefresh", "true");
      var url = "https://teamup.com/" + this.$calendar + "/events/" + rideID;
      const win = window.open(url);
      win.location = url;
      EventBus.$emit("showRefresh", "false");
    },

    async init() {
      EventBus.$emit("wait", "true");
      var ret = await this.getRides("all", "pending").then(() => {});
      if (ret === 0) {
        return;
      }
      this.headers.push({
        text: this.statusFieldName,
        value: this.statusFieldName,
        align: "start",
      });
    },
  },

  mounted() {
    this.init();
    this.onResize(this.rideLeader);
  },
};
</script>
<style scoped>
.v-data-table-header {
  color: lawngreen;
  background-color: lightpink;
}
</style>
