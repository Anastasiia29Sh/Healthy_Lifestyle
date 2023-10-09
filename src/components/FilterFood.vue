<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-text-field
          label="Max кол-во калорий"
          v-model="maxCalories"
          type="number"
          suffix="Ккал"
          variant="underlined"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          type="number"
          label="Max кол-во белков"
          v-model="maxProteins"
          suffix="г"
          variant="underlined"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Max кол-во жиров"
          v-model="maxFats"
          suffix="г"
          type="number"
          variant="underlined"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Max кол-во углеводов"
          v-model="maxCarbs"
          suffix="г"
          type="number"
          variant="underlined"
        />
      </v-col>
    </v-row>
    <v-btn variant="tonal" @click="filtration()" class="btn-ok">ОК</v-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLisfFoodsStore } from "@/store/listFoods";
import { storeToRefs } from "pinia";

const listFoodStore = useLisfFoodsStore();
const { foods } = storeToRefs(listFoodStore);
const { getAllFoods } = listFoodStore;
getAllFoods();

const emit = defineEmits(["foodFilter"]);

const maxCalories = ref("");
const maxProteins = ref("");
const maxFats = ref("");
const maxCarbs = ref("");

function filtration() {
  maxCalories.value =
    isNaN(maxCalories.value) || maxCalories.value === ""
      ? searchMaxValue("calories")
      : parseFloat(maxCalories.value);
  maxProteins.value =
    isNaN(maxProteins.value) || maxProteins.value === ""
      ? searchMaxValue("proteins")
      : parseFloat(maxProteins.value);
  maxFats.value =
    isNaN(maxFats.value) || maxFats.value === ""
      ? searchMaxValue("fats")
      : parseFloat(maxFats.value);
  maxCarbs.value =
    isNaN(maxCarbs.value) || maxCarbs.value === ""
      ? searchMaxValue("carbs")
      : parseFloat(maxCarbs.value);

  if (
    maxCalories.value >= 0 &&
    maxProteins.value >= 0 &&
    maxFats.value >= 0 &&
    maxCarbs.value >= 0
  ) {
    let foodFilter = foods.value.filter(
      (f) =>
        f.calories <= maxCalories.value &&
        f.proteins <= maxProteins.value &&
        f.fats <= maxFats.value &&
        f.carbs <= maxCarbs.value
    );
    emit("foodFilter", foodFilter);
  }
}
function searchMaxValue(parametr) {
  return foods.value
    .map((item) => item[parametr])
    .reduce((prev, current) => (prev > current ? prev : current));
}
</script>

<style scoped lang="scss">
@use "../styles/settings";

.btn-ok {
  @include settings.btnStyle();
}
.mess {
  @include settings.mess();
}
</style>