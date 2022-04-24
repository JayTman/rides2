<template>
  <v-tooltip class="bigger" open-delay="1500ms" color="black" top>
    <template v-slot:activator="{ on }">
      <v-btn
        :height="height"
        :width="width"
        :color="color"
        v-on="on"
        @click="raiseClickEvent()"
        :disabled="disable"
      >
        <v-icon :color="iconcolor" :disabled="true" :value="value">
          {{ icon }}
        </v-icon>
        {{ text }}
      </v-btn>
    </template>
    <span v-html="tooltip"></span>
    <!-- <span>  {{ tooltip }}  </span>  -->
  </v-tooltip>
</template>

<script>
export default {
  name: "buttontip",
  props: {
    text: { type: String, required: false, default: "" },
    disable: { type: Boolean, required: false, default: null },
    icon: { type: String, required: false, default: "" },
    color: { type: String, required: false, default: "primary" },
    iconcolor: { type: String, required: false, default: "white" },
    tooltip: { type: String, required: false, default: "" },
    value: { type: String, required: false, default: "" },
    height: { type: String, required: false, default: "" },
    width: { type: String, required: false, default: "" },
    eventname: { type: String, required: false, default: "clickyclicky" },
  },
  /*
computed: {
    width: this.height * 3,
  },
*/
  methods: {
    raiseClickEvent() {
      this.$emit(this.eventname);
    },
  },
};
</script>
<style lang="sass">
$tooltip-font-size: 22
</style>
