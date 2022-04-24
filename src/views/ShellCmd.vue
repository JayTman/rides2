<template>
  <div id="ShellCmd">
    <vue-command :commands="commands" />
  </div>
</template>

<script>
import VueCommand, { createStdout } from "vue-command";
import "vue-command/dist/vue-command.css";

export default {
  components: {
    VueCommand,
  },

  data: () => ({
    commands: {
      dir: () => createStdout("ls"),
    },
  }),
};
</script>
