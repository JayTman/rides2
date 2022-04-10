<template>
  <div class="Tip">
    <v-tooltip
      open-delay="750ms"
      color="primary lighten-3 black--text"
      dark
      top
    >
      <template v-slot:activator="{ on, attrs }">
        <v-container>
          <v-row justify="start" align="center">
            <v-icon v-bind="attrs" v-on="on"> mdi-information-variant </v-icon>
            <slot />
          </v-row>
        </v-container>
      </template>
      <span v-html="'<h3>' + text + '</h3>'"> </span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    //    methods: {},
  },
};
</script>
