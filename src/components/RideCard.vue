<template>
  <div name="RideCard">
    <!--     <v-card z-index="10" color="#576490">
 -->
    <span class="wrap-text text-center">
      <v-card color="grey">
        <!--       <span class="foo" align="center" justify="center">
 -->
        <v-card-text class="text-h5 white--text">
          {{ item.who }}
          <br />
          {{ item.Date }}
          <br />
          {{ item.title }}
          <br />
        </v-card-text>
        <v-card-text class="text-h6">
          <div v-if="'custom' in item">
            <div
              v-for="(val, propertyName, index) in item.displayCustom"
              :key="index"
            >
              <div
                :class="
                  fuzzyMatch(val, 'change')
                    ? 'text-h6 pink--text lighten-6'
                    : fuzzyMatch(val, 'confirm')
                    ? 'text-h6 white--text'
                    : 'yellow lighten-2 black--text'
                "
                v-if="isStatus(propertyName) === true"
              >
                {{ propertyName }}
                : {{ val }}
              </div>
              <div v-else>
                <b>{{ propertyName }} {{ val }} </b>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="grey lighten-3" light>
        <span v-html="item['notes']" class="wrap-text"> </span>
      </v-card>
    </span>
  </div>
</template>
<script>
export default {
  name: "RideCard",
  data() {
    return {
      bg: "amber accent-4",
      bottomColor: "green",
    };
  },
  props: {
    item: Object,
    statusName: String,
  },
  methods: {
    isStatus(field) {
      //            this.convertCustomFields(item);
      if (field === this.statusFieldID) {
        return false;
      }
      if (field === this.statusName) {
        return true;
      }
      return false;
    },
    mounted() {},
  },
};
</script>
<style>
@label {
  font-family: "Arial Narrow Bold";
  font-size: 10pt;
}
</style>
