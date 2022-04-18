<template>
  <div id="About">
    <v-row>
      <v-card>
        <v-dialog persistent v-model="dialog" width="500">
          <v-card class="primary lighten-4">
            <v-col>
              <v-row justify="center">
                <h2 class="display-1 font-weight-bold mb-3">About</h2>
              </v-row>
            </v-col>
            <v-col>
              <v-row justify="space-around">
                NODE_ENV: {{ this.$node_env }}
              </v-row>
              <v-row justify="space-around"> Hostname: {{ hostName }} </v-row>
              <v-row justify="space-around">
                python server: {{ this.$pythonServer }}
              </v-row>
              <v-row justify="space-around"> server: {{ this.$addr }} </v-row>

              <v-row justify="space-around">
                Active Calendar:
                {{ this.$calendar }}
              </v-row>
              <v-row justify="space-around">
                Restore Calendar From:
                {{ this.restoreCalendar }}
              </v-row>
              <v-row justify="space-around">
                <v-btn @click="reloadTestCalendar()" color="primary">
                  Reload Test Calendar
                </v-btn>
                <v-btn @click="done()" color="primary"> Done </v-btn>
              </v-row>
            </v-col>
            <v-snackbar
              v-model="snackbar"
              timeout="-1"
              absolute
              centered
              color="warning lighten-2 black--text"
            >
              {{ text }}
            </v-snackbar>
          </v-card>
        </v-dialog>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import axios from "axios";
import EventBus from "@/event-bus.js";
export default {
  components: {},
  data() {
    return {
      dialog: true,
      hostName: "",
      pythonServer: "notset",
      snackbar: false,
      restoreCalendar: "forTesting.jsn",
      text: "Hang On, this will take a couple of minutes",
    };
  },
  methods: {
    done() {
      this.dialog = false;
      this.$router.push({ path: "/" });
    },
    reloadTestCalendar() {
      this.snackbar = true;
      EventBus.$emit("wait", "true");
      var url =
        this.$pythonServer +
        "reloadTestCalendar?cal=" +
        this.$calendar +
        "&msg=" +
        this.restoreCalendar;
      axios({
        method: "GET",
        url: url,
      })
        .then((resp) => {
          this.msg = resp.data;
          EventBus.$emit("wait", "false");
          this.snackbar = false;
          this.updateResetFlag("WRITE", "2020 Reset by Reload of test data");
          this.$router.push({ path: "/NewYearReset" });

          // alert(this.response);
        })
        .catch((error) => {
          alert("reload test calendar " + error);
          EventBus.$emit("wait", "false");
        });
    },
    updateResetFlag(mode, newYearDate) {
      var url =
        this.$pythonServer +
        "/newYearCheck?filename=newYearCheck.msg&id=" +
        mode +
        "&msg=" +
        newYearDate;
      axios({
        method: "GET",
        url: url,
        //      url: this.$pythonServer +
        // url: "https://test.ebcrides.org/" + "getImageList",
      })
        // axios({ method: "GET", "url": "https://httpbin.org/ip" }).
        .then((response) => {
          console.log("dateeeee " + response.data);
          this.prevResetDate = response.data;
          if (this.prevResetDate.substr(0, 4) === this.currentYear.toString()) {
            this.snackbarColor = "red lighten-3 black--text";
          }
        });
    },
  },
  mounted() {
    this.hostName = location.host;
    this.pythonServer = this.$confi.py;
  },
};
</script>
<style scoped></style>
