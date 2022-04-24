<template>
  <div id="app">
    <v-app>
      <!--       <v-container height="200" class="yellow">
 -->
      <v-card fluid height="95">
        <v-system-bar height="95" :color="this.$menuColor">
          <v-app-bar
            :color="this.$menuColor"
            dark
            fixed
            height="80"
            elevation="6"
          >
            <v-row justify="start" align="center">
              <v-app-bar-nav-icon
                @click="drawer = !drawer"
                background-color="primary"
              >
              </v-app-bar-nav-icon>
              <h2>Rides Chair Dashboard</h2>
            </v-row>
          </v-app-bar>
        </v-system-bar>
        <v-row>
          <v-progress-linear
            height="10px"
            :v-model="waitActive"
            :active="waitActive"
            :indeterminate="waitActive"
            :color="this.$waitColor"
          >
          </v-progress-linear>
        </v-row>
      </v-card>
      <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
        :color="this.$menuColor"
        dark
        v-on:wait="setWait($event)"
      >
        <v-list>
          <v-list-item to="/"> Ride Leader Status </v-list-item>
          <v-list-item to="/List"> Ride List </v-list-item>
          <v-list-item to="/Browser"> Image Browser </v-list-item>
          <v-list-item to="/RideLeaders"> Ride Leader Editor</v-list-item>
          <v-list-item
            to="/msgEditor/confirmRides.msg/Unconfirm Rides Message/"
          >
            Unconfirm Rides Message
          </v-list-item>
          <v-list-item to="/msgEditor/reminder.msg/Ride Reminder Message/">
            Ride Reminder Message
          </v-list-item>

          <v-list-item to="/msgEditor/allRidesList.msg/New Year Message/">
            New Year Message
          </v-list-item>
          <v-list-item to="/newYearReset"> New Year Reset </v-list-item>
          <v-list-item to="/login"> Login </v-list-item>
          <v-list-item to="/RideReview/Neal Ney/all"> Ride Review </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script>
// const server = "http://192.168.1.12/ebc.ebcrides.org/";

import EventBus from "@/event-bus";
export default {
  name: "App",
  data: () => ({
    showMenu: true,
    drawer: false,
    waitActive: false,
    hello: "no",
  }),

  mounted() {
    EventBus.$on("showMenu", (x) => {
      if (x == "true") {
        this.showMenu = true;
      } else if (x == "false") {
        this.showMenu = false;
      }
    });

    EventBus.$on("wait", (x) => {
      if (x == "true") {
        this.waitActive = true;
      } else if (x == "false") {
        this.waitActive = false;
      }
    });
  },
};
</script>
<style>
v-sheet.v-list .v-list-item--link ".theme--light".v-list-item {
  font-size: 8pt;
}
.v-sheet.v-list {
  background: #234f81;
}
/*
.bodyFont {
  font-size: 8pt;
}
.headerFont {
  font-family: "Mansalva", cursive;
  font-size: 18pt;
}
*/
</style>
