<template>
  <div id="msgEditor">
    <v-container fluid :class="this.$bgColor">
      <v-row justify="center">
        <h2 class="display-1 font-weight-bold mb-3">
          {{ $route.params.title }}
        </h2>
        <v-tooltip open-delay="1500ms" color="black" top>
          <template v-slot:activator="{ on, attrs }">
            <v-container v-bind="attrs" v-on="on">
              <v-card color="yellow" elevation="5" width="400">
                Report variables: @RideLeader @RideList @RideButton
              </v-card>
            </v-container>
          </template>
          <span>
            When you send out a report to one or multiple ride leaders the
            following variables are available: <br />
            &emsp; @RideLeader will be set to the Ride Leader Name.<br />
            &emsp; @RideList will be replaced with the appropriate list of rides
            for the report being run. <br />
            &emsp; @RideButton will be replaced with a button to press (if
            needed) for the report being run. <br /><br />
            Right tooltip</span
          >
        </v-tooltip>
      </v-row>
      <div style="display: none">{{ (inp = content) }}</div>

      <div id="inp">
        <editor
          v-model="inp"
          :init="{
            oninit: getit(this.$route.params.filename),
            plugins:
              ' paste importcss searchreplace autolink  directionality code  charmap image link media   table charmap hr  anchor insertdatetime advlist lists  imagetools  quickbars emoticons',
            imagetools_cors_hosts: ['picsum.photos'],
            menubar: ' edit  insert format tools table',
            toolbar:
              'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | insertfile image media template link anchor  | ltr rtl',
            importcss_append: true,
            height: 600,
            image_caption: true,
            toolbar_mode: 'sliding',
            contextmenu: 'image',
            body_class: 'my_class',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px, forcolor:red }',
          }"
        >
        </editor>
      </div>
      <v-row>
        <v-layout col>
          <!--           <v-btn value="save" color="primary" @click="saveMsg('save')">
            Save
          </v-btn>
 -->
          <v-btn value="test" color="primary" @click="saveMsg('test')">
            Test
          </v-btn>
          <v-col cols="1"> </v-col>
          <buttontip
            @click="saveMsg('install')"
            color="green white--text"
            text="Install"
            tooltip="This will make the current version<br/>the version that the Revert buttton returns"
            eventname="click"
          ></buttontip>
          <buttontip
            @click="saveMsg('revert')"
            color="red white--text"
            text="Revert"
            tooltip="Go back to the last Installed</br>version of this message"
            eventname="click"
          ></buttontip>
        </v-layout>
      </v-row>
    </v-container>
  </div>
</template>
<script>
// import Editor from "../../../tinymce/node_modules/@tinymce/tinymce-vue";
import Editor from "@tinymce/tinymce-vue";
import axios from "axios";
import buttontip from "../components/ButtonTip";
export default {
  name: "msgEditor",
  components: {
    Editor,
    buttontip,
  },
  data() {
    return {
      //          showPopUp: false,
      //      calendar: "ksbmqapicnorxb63e1",
      editor: Editor,
      content: "",
      //    filename: "no",
      disabled: null,
      // title: "Nodda",
    };
  },
  _methods: {
    getit(filename) {
      var url = this.$pythonServer + "getfile?msg=" + filename;
      // alert(url );
      axios({
        method: "GET",
        url: url,
      })
        .then((results) => {
          this.content = results.data;
          //        alert(this.rideLeaderList);
        })
        .catch((error) => {
          alert(error);
        });
    },
    saveMsg(action) {
      var url = "";
      if (action === "test") {
        url =
          this.$pythonServer +
          "saveMsg?msgID=" +
          action +
          "&cal=" +
          this.$calendar +
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
          "&filename=" +
          this.$route.params.filename +
          "&msg=" +
          encodeURIComponent(this.inp);
      }
      // alert(url);
      axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          if (action === "revert") {
            //            this.getit(this.$route.params.filename);
          }
          this.response = response.data;
        })
        .catch((error) => {
          alert(error + ": " + error.response.data.message);
        });
    },
  },
  get methods_1() {
    return this._methods;
  },
  set methods_1(value) {
    this._methods = value;
  },
  get methods() {
    return this._methods;
  },
  set methods(value) {
    this._methods = value;
  },
  /*
  mounted() {
    this.getit(this.$route.params.filename);
  },
           var url = rver + "getFile?msg=" + this.$route.params.filename;
           alert(url);
           axios({
            method: "GET",
            url: url
          })
            .then(results => {
              this.results = results.data;
              alert(this.results);
              //        alert(this.rideLeaderList);
            })
            .catch(error => {
              console.log(error);
            });
        } */
};
</script>
<style>
.mceEditorArea {
  font-family: "MS Sans Serif";
  background: #ffffff;
}
.Editor {
  font-family: "MS Sans Serif";
  background: #ffffff;
}
.editor {
  font-family: "MS Sans Serif";
  background: #ffffff;
}
.v-btn {
  margin: 2px;
}
</style>
