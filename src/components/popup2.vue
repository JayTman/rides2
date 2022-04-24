<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="max-width"
    max-hight="max-max-hight"
    color="yellow"
  >
    <v-card>
      <v-toolbar color="deep-purple accent-4" cards dark flat>
        Enter your changes below:
      </v-toolbar>
      <v-card-title class="text-wrap"> </v-card-title>
      <v-textarea
        v-model="model"
        :auto-grow="autoGrow"
        :clearable="clearable"
        :filled="filled"
        :outlined="outlined"
        :hint="hint"
        :label="label"
        :loading="loading"
        :placeholder="placeholder"
        :rows="rows"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <template>
          <div>
            <slot>
              <v-btn color="green darken-1" @click="dialog = false"
                >popup2 Send to Rideschair</v-btn
              >
              <v-btn color="dark red darken-1" @click="dialog = false"
                >popup2 Cancel</v-btn
              >
            </slot>
          </div>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "popup2",
  props: {
    dialog: {
      Type: String,
    },
    hint: {
      Type: String,
    },
    label: {
      Type: String,
    },
    placeholder: {
      Type: String,
    },
    rows: {
      Type: Number,
    },
    maxWidth: {
      Type: Number,
      default: "450pz",
    },
    maxHeight: {
      Type: Number,
      default: "8",
    },
  },
  data() {
    false;
  },
};
</script>
