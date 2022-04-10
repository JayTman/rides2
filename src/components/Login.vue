<template>
  <div id="Login">
    <v-container fluid>
      <v-dialog
        width="400px"
        persistent
        transition="dialog-bottom-transition"
        v-model="this.showLogin"
        show="this.show"
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
            <v-btn color="primary" @click="logMeIn()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: true,
      name: "Login",
      showLogin: true,
      item: [],
    };
  },
  methods: {
    logMeIn() {
      this.dialog = false;
      this.$router.push({ path: "/" });
    },
    password() {
      alert("passwd");
    },
  },
  mounted() {},
};
</script>

<style scoped>
/* 
.v-overlay__scrim {
  background: url(https:/ebcrides.org/images/cal/loginBackground.jpg) no-repeat
    center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
 */
</style>
