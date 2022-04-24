<template>
  <div id="Browser">
    <v-container fluid>
      <v-row :class="this.$headerColor">
        <v-col cols="4">
          <v-btn class="primary" height="50">
            <v-icon> mdi-upload</v-icon>
            <input
              type="file"
              ref="file"
              id="file"
              class="inputfile"
              v-on:change="handleUpload()"
            />
            <label for="file"> Upload a picture... </label>
          </v-btn>
        </v-col>
        <v-col>
          <h2 class="display-1 font-weight-bold mb-3">Picture Gallery</h2>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-if="dialog"
      :background-color="this.$headerColor"
      v-model="dialog"
      persistent
      :width="350"
    >
      <v-card :color="this.$headerColor">
        <v-img
          :src="curItem.img2"
          :width="curItem.width"
          :height="curItem.height"
        ></v-img>
        <v-text-field
          dark
          background-color="orange darken-4"
          ripple
          v-model="curItem.title"
          @keydown.enter="renameImage(curItem.oldName, curItem.title)"
        >
        </v-text-field>
        <v-card-actions>
          <v-row justify="space-between">
            <v-menu dark>
              <v-btn v-on="on" class="primary"> Actions </v-btn>
              <v-list>
                <v-list-item
                  @click="processImage('lighter', curItem.title, curItem.img)"
                >
                  <v-list-item-title>Lighter</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="processImage('darker', curItem.title, curItem.img)"
                >
                  <v-list-item-title> Darker</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="
                    processImage('rotateR', curItem.title, item.img, item.img)
                  "
                >
                  <v-list-item-title>Rotate Clockwise</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="processImage('rotateL', curItem.title, curItem.img)"
                >
                  <v-list-item-title
                    >Rotate Counter Clockwise</v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  @click="processImage('smaller', curItem.title, curItem.img)"
                >
                  <v-list-item-title>Smaller</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="processImage('bigger', curItem.title, curItem.img)"
                >
                  <v-list-item-title>Bigger</v-list-item-title>
                </v-list-item>
                <v-list-item> </v-list-item>
                <v-list-item
                  @click="processImage('delete', curItem.title, curItem.img)"
                >
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn color="primary" @click="done()"> Done </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container fluid :class="this.$bgColor">
      <v-row justify="start" align="end">
        <div v-for="item in imageList" :key="item.id">
          <v-col>
            <v-card :class="fgColor" @click="updateInfo(imageList[item.id])">
              <v-icon> mdi-dots-vertical </v-icon>
              <v-layout col justify-end>
                <v-img
                  :width="item.width"
                  :height="item.height"
                  :src="item.img2"
                  v-model="curItem.img2"
                ></v-img>
                <div class="inputfile2" v-html="item.img"></div>
              </v-layout>
            </v-card>
          </v-col>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import EventBus from "../event-bus";
// const server = "http://192.168.1.22/";
export default {
  name: "browser",
  components: {},
  data() {
    return {
      //      show: true,
      dialog: false,
      response: [],
      fgColor: "",
      imageList: [],
      item: [],
      waitActive: false,
      waitColor: "purple",
      GetData: [],
      focused: false,
      updateName: [],
      files: [], // dragNdrop
      file: "",
      curItem: [],
    };
  },
  formHtml(item) {
    return item.image + this.editedIndex === -1 ? "New Item" : "Edit Item";
  },
  methods: {
    findIndexByKeyValue(_array, key, value) {
      for (var i = 0; i < _array.length; i++) {
        if (_array[i][key] == value) {
          return i;
        }
      }
      return -1;
    },
    done() {
      //      this.show = false;
      //      this.show = true;
      this.dialog = false;
    },

    updateInfo(item) {
      this.curItem = item;
      console.log(item.id);
      //      this.show = false;
      this.dialog = true;
    },
    processImage(func, title, img) {
      //      const changesSize = ["bigger", "smaller", "rotateR", "rotateL"];
      EventBus.$emit("wait", "true");

      var url =
        this.$pythonServer + "/processImage?msg=" + func + "&filename=" + title;
      // alert(url);
      //      if (changesSize.indexOf(func) > -1) {
      //        this.dialog = false;
      //        this.show = false;
      //      }
      axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          var data = response.data;
          if (data.status > 200) {
            alert(data.statusText);
            return;
          }
          var index = this.findIndexByKeyValue(this.imageList, "title", title);
          if (index == -1) {
            alert("Image not found in array");
            return -1;
          }
          if (func === "delete") {
            this.imageList.splice(index, 1);
          } else {
            //          var url ="<img src='" + this.$imagePath + title  + ".jpg>"
            console.log("Img : " + img);
            //            this.imageList[index]["img"] = this.$imagePath + title + ".jpg ";

            this.imageList[index]["img2"] =
              this.$imagePath + title + ".jpg?cache=" + Math.random();
            this.imageList[index]["width"] = data.width;
            this.imageList[index]["height"] = data.height;
            //            if (changesSize.indexOf(func) > -1) {
            this.dialog = false;
            this.dialog = true;
            EventBus.$emit("wait", "false");
            //            }
          }
        })
        .catch((error) => {
          alert(error);
        });
    },
    renameImage(oldName, newName) {
      var url =
        this.$pythonServer +
        "/renamefile?filename=" +
        encodeURIComponent(oldName) +
        "&msg=" +
        encodeURIComponent(newName);
      // alert(url);
      axios({
        method: "GET",
        url: url,
      })
        .then(() => {
          this.setTitle(newName);
          //          this.dialog = false;
          //          this.show = true;

          // alert(this.response);
        })
        .catch((error) => {
          alert(error);
        });
    },

    getPics(imageList) {
      var url = this.$pythonServer + "getImageList?id=" + this.$imagePath;
      axios({
        method: "GET",
        url: url,
        //      url: this.$pythonServer +
        // url: "https://test.ebcrides.org/" + "getImageList",
        headers: {},
      })
        // axios({ method: "GET", "url": "https://httpbin.org/ip" }).
        .then((response) => {
          var images = [];
          images = response.data;
          for (var i = 0; i < images.length; i++) {
            var img = this.$imagePath + images[i].title + ".jpg";

            images[i]["img"] = "<img src='" + img + "'>";
            images[i]["img2"] = img + "?cache=" + Math.random();
            console.log(img);
            imageList.push(images[i]);
          }

          EventBus.$emit("wait", "false");
        })
        .catch((error) => {
          EventBus.$emit("wait", "false");
          alert(error);
        });
    },

    setTitle(newName) {
      var i = 0;
      while (i < this.imageList.length) {
        if (this.imageList[i].title === newName) {
          this.imageList[i].oldName = newName;
          break;
        }
        i += 1;
      }
    },

    handleUpload() {
      //   this.fileName = e.name;
      EventBus.$emit("wait", "true");
      this.file = this.$refs.file.files[0];
      var fileName = this.file.name;
      var formData = new FormData();

      formData.append("file", this.file);
      var url = this.$fileServer + "upload/upload.php";
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          var fileCount = this.imageList.length;
          var img = this.$imagePath + fileName;
          this.imageList.unshift({
            id: fileCount,
            img: "<img src='" + img + "' > ",
            img2: img + "?cache=" + Math.random(),
            title: fileName.split(".")[0],
            oldName: fileName.split(".")[0],
          });
          EventBus.$emit("wait", "false");
        })
        .catch((error) => {
          alert("FAILURE!!" + error);
          EventBus.$emit("wait", "false");
        });
    },
  },
  mounted() {
    EventBus.$emit("wait", "true");
    this.getPics(this.imageList);
    this.fgColor = this.$fgColor;
  },
};
</script>
<style>
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile2 {
  position: absolute;
  opacity: 0;
  z-index: 1;
}
.inputfile + label {
  font-size: 1em;
  font-weight: 400;
  color: white;
  background-color: transparent;
  display: inline-block;
  margin: 0.2em;
}

.v-sheet.v-list {
  background: rgb(77, 155, 245);
}
</style>
