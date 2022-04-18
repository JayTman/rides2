<template>
  <div id="msgEditor">
    <v-card flat :color="this.$headerColor">
      <v-col align="center">
        <h3 class="display-1 font-weight-bold mb-3">Email Report Editor</h3>
      </v-col>
      <v-tabs
        background-color="brown"
        color="yellow"
        dark
        centered
        show-arrows
        center-active
      >
        <v-tab to="/msgEditor/pendingRides.msg/Pending Rides Message/">
          pending rides reminder
        </v-tab>
        <v-tab to="/msgEditor/allRides.msg/All Rides Message/">
          List of All Rides
        </v-tab>
        <v-tab to="/msgEditor/monthBefore.msg/Month before ride reminder/">
          month before reminder
        </v-tab>
        <v-tab to="/msgEditor/newYear.msg/New Year Message/"> New Year</v-tab>
        <v-tab to="/msgEditor/leaderNeeded.msg/Month Before Ride Leader Needed">
          Month Before Leader Needed</v-tab
        >
      </v-tabs>
      <Tip
        color="green"
        text="When creating a report
            following substitution variables are available: <br />  <br />
            @RideLeader &emsp;  will be set to the Ride Leader Name.<br />
            @RideList &emsp;  will be replaced with the appropriate rides
            for the report being run. <br />
            @RideButton &emsp;  will be replaced with an action button
            for the report being run. <br />
            @RideYear &emsp;  will be replaced with current year for  the Calendar.
             <br /> 
            <br />
            Some text formatting commands will work on these variables (size,color, font,
            etc.), and some won't."
      >
        <slot> Report Variables </slot>
      </Tip>
      <!--           <v-btn value="save" color="primary" @click="saveMsg('save')">
            Save
          </v-btn>
 -->
      <v-card :color="this.$bgColor">
        <v-container :class="this.$bgColor">
          <h3>
            {{ $route.params.title }}
          </h3>
          <!-- 
        This is tinymce
        APIkey: uc46vz0xq4tugh14zeq8f2f8pap1dqrb2p7l5azjmluczknf
        Website: https://www.tiny.cloud/
        Login: ebcrides@ebcrides.org
        Password: ebc55555cal
        registered domains: ebcrides.org, localhost
       -->

          <div style="display: none">{{ (inp = content) }}</div>

          <div id="inp">
            <editor
              v-model="inp"
              api-key="uc46vz0xq4tugh14zeq8f2f8pap1dqrb2p7l5azjmluczknf"
              :init="{
                body_class: 'Editor',
                backcolor: 'red',
                oninit: getMsgFile(this.$route.params.filename),
                plugins:
                  ' paste importcss searchreplace autolink  directionality code  charmap image link media   table charmap hr  anchor  advlist lists    quickbars emoticons',
                menubar: ' edit  insert format tools table',
                toolbar:
                  'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | insertfile image media template link anchor  | ltr rtl',
                importcss_append: true,
                height: 600,
                image_caption: true,
                toolbar_mode: 'sliding',
                contextmenu: 'image',
                body_class: 'my_class',
              }"
            >
            </editor>
          </div>
          <!--           <v-btn value="save" color="primary" @click="saveMsg('save')">
            Save
          </v-btn>
 -->
          <v-layout row>
            <v-col cols="3">
              <Tip
                text="This will send a message with the current version of this report to your email address. <br /> This will show you what the report would actually look like and save it."
              >
                <slot>
                  <v-btn value="test" color="primary" @click="saveMsg('test')">
                    Test
                  </v-btn>
                </slot>
              </Tip> </v-col
            ><v-col cols="2">
              <Tip
                text="Saves current version and determines what the Revert Buttton restores to. "
              >
                <slot>
                  <v-btn @click="saveMsg('install')" color="green white--text">
                    Save
                  </v-btn>
                </slot></Tip
              > </v-col
            ><v-col cols="2">
              <Tip text="Go back to the last saved</br>version of this message">
                <slot>
                  <v-btn @click="saveMsg('revert')" color="red white--text">
                    Revert
                  </v-btn>
                </slot>
              </Tip>
            </v-col>
          </v-layout>
        </v-container>
      </v-card>
    </v-card>
  </div>
</template>
<script>
// import Editor from "../../../tinymce/node_modules/@tinymce/tinymce-vue";
import Editor from "@tinymce/tinymce-vue";
import axios from "axios";
import Tip from "../components/Tip";
import EventBus from "@/event-bus";
export default {
  name: "msgEditor",
  components: {
    Editor,
    Tip,
  },
  data() {
    return {
      //          showPopUp: false,
      //      calendar: "ksbmqapicnorxb63e1",
      editor: Editor,
      headerColor: "green",
      content: "",
      //    filename: "no",
      disabled: null,
      // title: "Nodda",
    };
  },
  methods: {
    getMsgFile(filename) {
      EventBus.$emit("wait", "true");
      var url = this.$pythonServer + "getfile?msg=" + filename;
      axios({
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        url: url,
      })
        .then((results) => {
          this.content = results.data;

          //        alert(this.rideLeaderList);
          EventBus.$emit("wait", "false");
        })
        .catch((error) => {
          alert(error);
          EventBus.$emit("wait", "false");
        });
    },
    saveMsg(action) {
      var url = "";
      var rideStatus = "all";

      if (action === "test") {
        if (this.$route.params.filename.search("pending") > -1) {
          rideStatus = "pending";
        }
        url =
          this.$pythonServer +
          "saveMsg?msgID=" +
          action +
          "&cal=" +
          this.$calendar +
          "&rideStatus=" +
          rideStatus +
          "&filename=" +
          this.$route.params.filename +
          "&msg=" +
          encodeURIComponent(this.inp);
        // alert("fname:" + url);
      } else {
        url =
          this.$pythonServer +
          "saveMsg?msgID=" +
          action +
          "&cal=" +
          this.$calendar +
          "&rideStatus=" +
          rideStatus +
          "&filename=" +
          this.$route.params.filename +
          "&msg=" +
          encodeURIComponent(this.inp);
      }
      axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          if (action === "revert") {
            //            this.getit(this.$route.params.filename);
          }
          this.content = response.data;
        })
        .catch((error) => {
          alert(error + ": " + error.response.data.message);
        });
    },
  },

  mounted() {},
};
</script>
