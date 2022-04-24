<template>
  <div id="logon">
    <v-container fluid>
      <v-dialog
        width="400px"
        persistent
        transition="dialog-bottom-transition"
        v-model="show"
      >
        <v-card class="elevation-10">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                name="login"
                label="Login"
                type="text"
              ></v-text-field>
              <v-text-field
                id="password"
                name="password"
                label="Password"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Logon",

  data() {
    return {
      show: false,
      itmes: [],
      item: [],
    };
  },
  props: {
    //    drawer: Boolean,
  },

  methods: {
    login() {
      alert("login init " + this.show);
      this.$router.push({ path: "/" });
      this.show = false;
    },
    password() {
      alert("passwd");
    },
  },
  created() {
    //    alert("moumred init " + this.$init);
    this.itmes = this.createSummary();
  },
};
</script>

<style></style>
