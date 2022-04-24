<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/vue"></script>
  </head>
  <body>
    <div id="app">
      <h1>hello App</h1>
    </div>
  </body>
  <script>
    new Vue({
      el: "#app",
    });
  </script>
</html>
<!--
    template:'
    <h1> hello </h1>
  <div id="msg-editor">
       <v-textarea>
       {{data}}
</v-textarea>       
</div>
import axios from "axios";
const server = "http://192.168.1.22/ebc.ebcrides.org/";
export default {
  name: "msgEditor",
   data() {
    return {
   },
  methods: {
    getit(filename) {
      EventBus.$emit("wait", "true");
      var url = "http://192.168.1.27/" + "getfile?msg=newYear.msg"
      // alert(url );
      axios({
        method: "GET",
        url: url,
      })
        .then((results) => {
          this.data = results.data;
          //        alert(this.rideLeaderList);
        })
        .catch((error) => {
          EventBus.$emit("wait", "false");
          alert(error);
          console.log(error);
        });
    },
  }
}
 '
</template>
 -->
