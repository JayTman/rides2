<template>
  <div id="Browser">
    <v-container fluid :class="this.$headerColor">
      <v-row justify="center">
        <Tip
          color="blue"
          text="You can do some minor editing to each image by clicking on the image. Pull down the Actions menu to see the possible actions. <br /> On MS Windows you can drag and drop between the Image manager and the ride Editor in the Calendar. On Apple computers you need to copy and paste. Drang and drop work??? on  Android and IOS <br />"
        >
          <slot>
            <h1>Image Manager</h1>
          </slot>
        </Tip>
      </v-row>
      <v-row justify="center">
        <v-btn class="primary btn">
          <v-icon> mdi-upload</v-icon>
          Upload a Picture
          <input
            class="uploadBtn"
            type="file"
            ref="file"
            id="file"
            v-on:change="handleUpload()"
          />
        </v-btn>
      </v-row>
      <v-dialog
        :class="this.$headerColor"
        v-model="dialog"
        persistent
        width="350"
      >
        <v-card :color="this.$headerColor">
          <v-col>
            <v-row justify="center">
              <v-img
                :src="curItem.img2"
                :max-width="curItem.width"
                :max-height="curItem.height"
              ></v-img>
            </v-row>
          </v-col>
          <v-text-field
            dark
            :background-color="this.inputColor"
            ripple
            :label="curItem.oldName"
            v-model="curItem.title"
            @mousedown="changeColor()"
            @keydown.enter="renameImage(curItem.oldName, curItem.title)"
          >
          </v-text-field>
          <v-card> </v-card>
          <v-card-actions>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="primary">
                  <v-icon> mdi-dots-vertical</v-icon>
                  Actions
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  @click="copyIt(curItem.title)"
                  v-clipboard:copy="copyIt(curItem.title)"
                >
                  Copy Image Source Code
                </v-list-item>
                <v-list-item
                  @click="copyIt(curItem.title)"
                  v-clipboard:copy="copyIt2(curItem.title)"
                >
                  Copy Image Link
                </v-list-item>

                <v-list-item @click="processImage('lighter', curItem.title)">
                  Lighter
                </v-list-item>
                <v-list-item @click="processImage('darker', curItem.title)">
                  Darker
                </v-list-item>

                <v-list-item
                  @click="processImage('rotateR', curItem.title, item.img)"
                >
                  Rotate Clockwise
                </v-list-item>

                <v-list-item @click="processImage('rotateL', curItem.title)">
                  Rotate Counter Clockwise
                </v-list-item>
                <v-list-item @click="processImage('smaller', curItem.title)">
                  Smaller
                </v-list-item>
                <v-list-item @click="processImage('bigger', curItem.title)">
                  Bigger
                </v-list-item>
                <v-list-item> </v-list-item>
                <v-list-item @click="processImage('delete', curItem.title)">
                  <v-list-item-title color="red">Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-row justify="space-around">
              <v-btn color="primary" @click="done()"> Done </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <v-container fluid :class="this.$bgColor" v-show="show">
      <v-row justify="start" align="end">
        <div v-for="item in imageList" :key="item.id">
          <v-col>
            <v-card :class="fgColor" @click="updateInfo(imageList[item.id])">
              <v-layout col justify-end>
                <v-img
                  class="image2 warning"
                  :src="item.img2"
                  :width="item.width"
                  :height="item.height"
                ></v-img>
                <v-card
                  class="image"
                  v-model="item.img"
                  color="red"
                  :width="item.width"
                  :height="item.height"
                  v-html="item.img"
                ></v-card>
              </v-layout>
              <v-card-text>
                {{ item.title.substr(0, 25) }}
              </v-card-text>
            </v-card>
          </v-col>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import EventBus from "../event-bus";
import Tip from "../components/Tip.vue";
// const server = "http://192.168.1.22/";
export default {
  name: "Browser",
  components: {
    Tip,
  },
  data() {
    return {
      inputColor: "orange darken-4",
      show: true,
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
  methods: {
    tttt(x, y) {
      alert("one" + x);
      alert(y);
    },
    findIndexByKeyValue(_array, key, value) {
      for (var i = 0; i < _array.length; i++) {
        if (_array[i][key] === value) {
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
    copyIt(title) {
      return (
        "<img src='" +
        this.$addr +
        "images/cal/" +
        this.$imageDir +
        title +
        ".jpg' style='float: left; margin: 10px;'/>"
      );
    },
    copyIt2(title) {
      return this.$addr + this.$imageDir + title + ".jpg";
    },
    updateInfo(item) {
      this.curItem = item;
      //      console.log(item.id);
      //      this.show = false;
      this.dialog = true;
    },
    processImage(func, title) {
      //      const changesSize = ["bigger", "smaller", "rotateR", "rotateL"];
      EventBus.$emit("wait", "true");
      var url =
        this.$pythonServer +
        "/processImage?msg=" +
        func +
        "&id=" +
        this.$imageDir +
        "&filename=" +
        encodeURIComponent(title);

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
          }
          var index = this.findIndexByKeyValue(this.imageList, "title", title);
          if (index === -1) {
            alert("Image not found in array " + title);
          }
          if (func === "delete") {
            this.imageList.splice(index, 1);
            for (var i = index; i < this.imageList.length; i++) {
              this.imageList[i].id -= 1;
            }
            //'http://192.168.1.71/images/cal/20041025_004.jpg?cache=0.7576416406214024'
            //'<img src='http://192.168.1.71/images/cal/20041025_004.jpg'>'
            EventBus.$emit("wait", "false");
            //            this.dialog = "false";
            this.done();
          } else {
            //          var url ="<img src='" + this.$imagePath + title  + ".jpg>"
            //            console.log("index: " + index + "Img : " + img);
            //            this.imageList[index]["img"] = this.$imagePath + title + ".jpg ";
            this.imageList[index].img =
              "<img src='" + this.$addr + this.$imageDir + title + ".jpg' >";
            this.imageList[index].img2 =
              this.$addr +
              this.$imageDir +
              title +
              ".jpg?cache=" +
              Math.random();
            this.imageList[index].width = data.width;
            this.imageList[index].height = data.height;
            EventBus.$emit("wait", "false");
            //            if (changesSize.indexOf(func) > -1) {

            //            }
          }
        })
        .catch((error) => {
          alert(error);
        });
    },
    changeColor() {
      this.inputColor = "grey darken-1";
    },
    renameImage(x, y) {
      //      var oldName = x;
      //      var newName = y;
      var url =
        this.$pythonServer +
        "/renamefile?id=images/cal/" +
        "&filename=" +
        encodeURIComponent(x) +
        "&msg=" +
        encodeURIComponent(y);
      // alert(url);
      axios({
        method: "GET",
        url: url,
      })
        .then((results) => {
          var index = this.findIndexByKeyValue(this.imageList, "oldName", x);
          if (index === -1) {
            alert("Image not found in array " + x);
          }
          this.inputColor = "orange darken-4";
          this.imageList[index].title = results.data;
          this.imageList[index].oldName = results.data;
          this.done();
          //          this.dialog = false;
          //          this.show = true;
          // alert(this.response);
        })
        .catch((error) => {
          alert(error);
        });
    },
    getPictures(imageList) {
      EventBus.$emit("wait", "true");
      var url = this.$pythonServer + "/getPictures?id=" + this.$imageDir;
      axios({
        method: "GET",
        url: url,
        //      url: this.$pythonServer +
        // url: "https://test.ebcrides.org/" + "getImageList",
      })
        // axios({ method: "GET", "url": "https://httpbin.org/ip" }).
        .then((response) => {
          var images = [];
          images = response.data;
          for (var i = 0; i < images.length; i++) {
            var img =
              this.$addr + this.$imageDir + encodeURIComponent(images[i].title);
            images[i].img = "<img src='" + img + ".jpg'>";

            images[i].img2 = img + ".jpg?cache=" + Math.random();
            // console.log(images[i].title);
            imageList.push(images[i]);
            console.log(this.pp(images[i]));
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
      EventBus.$emit("wait", "true");
      this.file = this.$refs.file.files[0];
      var fileName = this.file.name;
      var formData = new FormData();
      formData.append("file", this.file);
      // console.log(img + " " + title);
      //      var url = this.$pythonServer + "upload/upload.php";
      //  var url = this.$pythonServer + "upload/upload.php";
      var url = this.$addr + "upload/upload.php";
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((dim) => {
          var size = dim.data.split(",");
          var fileCount = this.imageList.length;
          var img = this.$addr + this.$imageDir + fileName;
          var title = fileName.substr(0, fileName.lastIndexOf(".jpg"));
          console.log("title: " + title);
          console.log(size[0] + " s1 " + size[1]);
          for (var i = 0; i < fileCount; i++) {
            this.imageList[i].id += 1;
          }
          this.imageList.unshift({
            id: 0,
            img: "<img src='" + img + "'>",
            img2: img + "?cache=" + Math.random(),
            title: title,
            oldName: title,
            width: size[0],
            height: size[1],
          });
          var x = this.imageList[0];
          console.log(x);
          EventBus.$emit("wait", "false");
        })
        .catch((error) => {
          alert("FAILURE!!" + error);
          EventBus.$emit("wait", "false");
        });
    },
  },
  mounted() {
    this.getPictures(this.imageList);
    this.fgColor = this.$fgColor;
  },
};
</script>

<style>
.popup {
  border: black 20px;
}

.image {
  /*  width: 0.1px;
    height: 0.1px;
    */
  position: absolute;
  opacity: 00;
  z-index: 1;
}
.image2 {
  opacity: 100;
  color: transparent;
  z-index: 1;
}
.btnx {
  opacity: 100;
  position: absolute;
  z-index: -1;
}
.uploadBtn {
  /*  width: 0.1px;
    height: 0.1px;
    */
  position: absolute;
  opacity: 00;
  background-color: red;
  min-height: 40px;
  z-index: 1;
}
.v-list.v-sheet.theme--light {
  background-color: #ffba7a;
}
</style>
