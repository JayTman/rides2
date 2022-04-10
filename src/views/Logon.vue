<template>
  <div id="logon">
    <v-container fluid>
      <v-card height="800px">
        <v-layout align-center justify-center>
          <v-dialog
            width="400px"
            persistent
            transition="dialog-bottom-transition"
            v-model="show"
          >
            <v-card class="elevation-10">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Ye Login</v-toolbar-title>
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
                <div v-if="show === false">
                  <router-link to="/"> </router-link>
                </div>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Logon",

  data() {
    return {
      show: true,
    };
  },
  props: {
    //    drawer: Boolean,
  },

  methods: {
    login() {
      this.$router.push("/");
      alert("login init " + this.$show);
    },
    password() {
      alert("passwd");
    },
  },
  created() {
    alert("moumred init " + this.$init);
  },
};
</script>
