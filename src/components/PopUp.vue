<template>
  <div id="PopUp">
    <v-row>
      <v-dialog
        v-model="dialog"
        width="400"
        persistent
        scrollable
        dialog="true"
      >
        <v-card :class="this.$headerColor" class="wrap-text">
          <v-card-title>
            {{ title }}
          </v-card-title>
          <v-card-text :class="this.$bgColor" style="max-height: 200px">
            <h3>
              {{ message }}
            </h3>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions :class="this.$bgColor">
            <template>
              <div>
                <slot>
                  <v-btn class="primary darken-3" text @click="jay('okay')">
                    Okay
                  </v-btn>
                  <v-btn class="primary darken-3" text @click="jay('cancel')">
                    Cancel
                  </v-btn>
                </slot>
              </div>
            </template>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  methods: {
    jay(msg) {
      this.$emit(msg);
      this.dialog = false;
    },
    newTitle(title) {
      this.dialog = true;
      this.title = title;
    },
    open(title, message, resolve) {
      this.dialog = true;
      this.title = title;
      this.resolve = resolve;
      this.message = message;
    },
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: "primary",
      width: 290,
      zIndex: 200,
    },
  }),
};
</script>
<style scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
  word-break: normal;
}
</style>
