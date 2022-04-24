<template>
  <div id="RideLeaders">
    <v-container fluid :class="this.$bgColor">
      <v-data-table
        :headers="headers"
        :items="Info"
        :items-per-page="100"
        sort-by="Last"
        :class="this.$bgColor"
      >
        >
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-row justify="start">
                <v-col cols="5">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add a Ride Leader
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn color="primary" dark id="btn" class="mb-2">
                    <input
                      foo
                      type="file"
                      ref="myFile"
                      id="file"
                      class="fileinput"
                      @change="selectedFile"
                    />
                    Upload Club Express file
                  </v-btn>
                  <!--           <v-file-input
            label="Select Club Express file"
            background-color="primary"
            chips
            v-model="fileInput"
            @change="selectedFile()"
          ></v-file-input>
 -->
                  <v-btn
                    :disabled="show"
                    class="mb-2"
                    color="primary"
                    @click="saveCSVToServer()"
                  >
                    Save Club Express Changes
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.First"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Last"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email Address"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import EventBus from "@/event-bus";

export default {
  data: () => ({
    file: "",
    files: [],
    readers: [],
    text: "",
    dialog: false,
    dialogDelete: false,
    status: "",
    headers: [
      {
        text: "First Name",
        align: "start",
        value: "First",
      },
      { text: "Last Name", value: "Last" },
      { text: "Email ", value: "email" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    Info: [],
    show: "disabled",
    editedIndex: -1,
    editedItem: {
      First: "",
      Last: "",
      email: "",
    },
    defaultItem: {
      First: "",
      Last: "",
      email: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Fool" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    //var csv is the CSV file with headers

    processData(csv) {
      var lines = [];
      if (csv.indexOf("\r") > -1) {
        lines = csv.split("\r\n");
      } else {
        lines = csv.split("\n");
      }
      var result = [];

      var headers = lines[0].split(",");

      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }

        result.push(obj);
      }

      //return result; //JavaScript object
      //     this.headers = obj[headers];
      this.Info = result; //JSON
    },

    selectedFile() {
      this.show = "disabled";
      EventBus.$emit("wait", "true");
      console.log(this.$refs.myFile.files[0]);

      let file = this.$refs.myFile.files[0];

      // Credit: https://stackoverflow.com/a/754398/52160
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.processData(evt.target.result);
        this.show = false;
        EventBus.$emit("wait", "false");
      };
      reader.onerror = (evt) => {
        console.error(evt);
        EventBus.$emit("wait", "false");
      };
    },
    //
    // row delimiter is $ to avoid windows/unix newline issues
    //
    parseObjToCSVArray(d) {
      const items = d;
      const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
      const header = Object.keys(items[0]);
      const csv = [
        header.join(","), // header row first
        ...items.map((row) =>
          header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(",")
        ),
      ].join("$");
      return csv;
    },

    saveCSVToServer() {
      var csv = this.parseObjToCSVArray(this.Info);
      var url =
        this.$pythonServer + "putRideLeaderInfo?msg=" + JSON.stringify(csv);
      console.log(csv);
      axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          this.status = response.data;
          EventBus.$emit("wait", "false");
          this.show = "disabled";
        })
        .catch((error) => {
          this.show = "disabled";
          EventBus.$emit("wait", "false");
          alert("Ride Leader Info " + error);
        });
    },
    initialize() {
      EventBus.$on("uploadFile", (payload) => {
        this.handleUpload(payload);
      });
      EventBus.$emit("wait", "true");

      //
      // get CSV data
      var url = this.$pythonServer + "getRideLeaderInfo";
      axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          this.Info = response.data;
          EventBus.$emit("wait", "false");
        })
        .catch((error) => {
          EventBus.$emit("wait", "false");
          alert("Ride Leader Info Error" + error);
        });
    },
    editItem(item) {
      this.editedIndex = this.Info.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.Info.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.Info.splice(this.editedIndex, 1);
      this.closeDelete();
      this.saveCSVToServer();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.Info[this.editedIndex], this.editedItem);
      } else {
        this.Info.push(this.editedItem);
      }
      this.saveCSVToServer();

      this.close();
    },
  },
};
</script>

<style>
.xyz {
}
.fileinput {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  opacity: 0;
  z-index: 0;
}
.fileinput + label {
  font-size: 1.2em;
  font-weight: 400;
  color: white;
  background-color: #1976d2;
  display: inline-block;
  margin: 0.2em;
}

.v-menu {
  background-color: violet;
  color: black;
}
</style>
