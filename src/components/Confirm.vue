<template>
  <v-dialog v-model="dialog" :width="options.width" persistent scrollable>
    <v-card :class="this.$headerColor">
      <!--   <v-toolbar :class="this.$headerColor" class="wrap-text">
     -->
      <v-card-title class="wrap-text black--text">
        <!--         <v-toolbar-title class="white--text wrap-text">
 -->
        {{ title }}
        <!-- </v-toolbar-title>
 -->
      </v-card-title>
      <!--       </v-toolbar>
-->
      <v-card-text
        :class="this.$bgColor"
        style="max-height: 200px"
        class="wrap-text"
      >
        <h3>
          {{ message }}
        </h3>
      </v-card-text>
      <!--
      <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
 -->

      <v-card-actions class="pt-0">
        <v-col>
          <v-row justify="space-between">
            <v-btn class="green black--text" text @click.native="agree">{{
              options.agreeButtonText
            }}</v-btn>
            <v-btn
              class="red lighten-1 black--text"
              color="black"
              text
              @click.native="cancel"
            >
              {{ options.cancelButtonText }}</v-btn
            >
          </v-row>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: "primary",
      width: 400,
      zIndex: 200,
      agreeButtonText: "Yes",
      cancelButtonText: "Cancel",
    },
  }),
  methods: {
    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);

      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
