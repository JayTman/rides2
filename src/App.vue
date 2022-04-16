<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-app-bar :color="this.$menuColor" dark fixed>
          <v-row justify="start" align="start">
            <v-col cols="1">
              <v-btn
                fixed
                x-small
                height="0"
                color="white--text"
                @click="drawer = !drawer"
              >
                Menu
              </v-btn>
              <v-app-bar-nav-icon fixed @click="drawer = !drawer">
              </v-app-bar-nav-icon>
            </v-col>
            <v-col>
              <h2>Rides Chair Dashboard</h2>
            </v-col>
          </v-row>
        </v-app-bar>
        <v-progress-linear
          height="80px"
          :v-model="waitActive"
          :indeterminate="waitActive"
          :color="this.$waitColor"
          :background-color="this.$menuColor"
        >
        </v-progress-linear>
        <v-navigation-drawer
          v-model="drawer"
          fixed
          temporary
          :color="this.$menuColor"
          dark
        >
          <!--         <v-on:wait="setWait($event)"
 -->

          <v-list>
            <v-list-item to="/"> Ride Leader Status </v-list-item>
            <v-list-item to="/List"> Ride List </v-list-item>
            <v-list-item to="/Browser"> Image Browser </v-list-item>
            <v-list-item to="msgEditor/pendingRides.msg/Pending Rides Message/">
              Edit Email Reports
            </v-list-item>
            <v-list-item to="/newYearReset"> New Year Reset </v-list-item>
            <v-list-item to="/RideLeaders"> Email Address Book</v-list-item>
            <v-list-item to="/RideReview/Neal Ney/pending">
              Ride Review
            </v-list-item>
            <v-list-item to="/About"> About </v-list-item>
          </v-list>
          >
        </v-navigation-drawer>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script>
// const server = "http://192.168.1.12/ebc.ebcrides.org/";

import EventBus from "@/event-bus";
export default {
  components: {},
  name: "App",
  data: () => ({
    drawer: false,
    waitActive: false,
  }),

  mounted() {
    process.env.VUE_APP_ROOT_API;
    EventBus.$on("wait", (x) => {
      if (x === "true") {
        //       console.log("waitActive true");
        this.waitActive = true;
      } else if (x === "false") {
        this.waitActive = false;
      }
    });
  },
};
</script>
<style>
/* .v-overlay__scrim {
  background: url(https:/ebcrides.org/images/cal/bg.jpg) no-repeat center center
    fixed;
 */

/*
<style>
.v-overlay__scrim {
    no-repeat center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}


.vuetify: {
  treeshake: true,
  defaultassets: {
    font: {
      size: 5pt;
    }
  }
}

#app {
  font-size: 12pt;
}
.col {
  padding: 0;
}

/.v-table {
  font-size: 0.5em;
}
.bodyFont {
  font-size: 0.5em;
}

.headerFont {
  font-family: "Mansalva", cursive;
  font-size: 18pt;
}
*/
</style>
