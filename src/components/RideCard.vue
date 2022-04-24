<template>
  <div name="RideCard">
    <v-container>
      <v-card color="#385F73" dark min-height="360">
        <v-col>
          Status: {{ this.statusFieldName }} Status: {{ statusName }}

          <v-row justify="center">
            <v-card-title class="wrap-text">
              {{ item["Date"] }}
              <br />
              {{ item.title }}
              <br />
            </v-card-title>
          </v-row>
        </v-col>
        <div v-if="'custom' in item">
          <v-col>
            <v-row
              justify="center"
              :key="index"
              v-model="item.custom"
              v-for="(val, propertyName, index) in item.displayCustom"
            >
              <div class="yellow--text" v-if="isStatus(propertyName) === true">
                {{ propertyName }}

                : {{ val }}
              </div>
              <div v-else>{{ propertyName }} {{ val }}</div>
            </v-row>
          </v-col>
        </div>
        <div v-html="item['notes']"></div>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "RideCard",
  data() {
    return {
      topColor: "#3b4474",
      bottomColor: null,
    };
  },
  props: {
    item: Object,
    statusName: String,
  },
  methods: {
    isStatus(field) {
      if (field === this.statusName) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
