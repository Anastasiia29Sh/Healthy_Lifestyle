<template>
  <div>
    <p class="title-filter mb-4">Выберите фильтры</p>
    <hr class="mb-6" />
    <v-row dense>
      <v-col cols="12">
        <p>Калории за порцию*</p>
        <v-radio-group v-model="n_calories" color="light-green-darken-4" inline>
          <v-radio label="Менее 100" value="0" />
          <v-radio label="100 - 250" value="1" />
          <v-radio label="250 - 500" value="2" />
          <v-radio label="Более 500" value="3" />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <p>Белки</p>
        <v-radio-group v-model="n_proteins" color="light-green-darken-4" inline>
          <v-radio label="Менее 15" value="0" />
          <v-radio label="15 - 30" value="1" />
          <v-radio label="30 - 50" value="2" />
          <v-radio label="Более 50" value="3" />
          <v-radio label="Все" value="4" />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <p>Жиры</p>
        <v-radio-group v-model="n_fats" color="light-green-darken-4" inline>
          <v-radio label="Менее 25" value="0" />
          <v-radio label="25 - 50" value="1" />
          <v-radio label="50 - 75" value="2" />
          <v-radio label="Более 75" value="3" />
          <v-radio label="Все" value="4" />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <p>Углеводы</p>
        <v-radio-group v-model="n_carbs" color="light-green-darken-4" inline>
          <v-radio label="Менее 25" value="0" />
          <v-radio label="25 - 50" value="1" />
          <v-radio label="50 - 75" value="2" />
          <v-radio label="Более 75" value="3" />
          <v-radio label="Все" value="4" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-btn variant="tonal" @click="filtration()" class="btn-ok">ОК</v-btn>
    <p class="mess mt-2">{{ mess }}</p>
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

const mess = ref("");
const emit = defineEmits(["foodFilter"]);

const n_calories = ref("");
const n_proteins = ref("");
const n_fats = ref("");
const n_carbs = ref("");

const criteria = ref({
  calories: [
    { min: 0, max: 99 },
    { min: 100, max: 249 },
    { min: 250, max: 499 },
    { min: 500, max: searchMaxValue("calories") },
  ],
  proteins: [
    { min: 0, max: 14 },
    { min: 15, max: 29 },
    { min: 30, max: 49 },
    { min: 50, max: searchMaxValue("proteins") },
    { min: 0, max: searchMaxValue("proteins") },
  ],
  fats: [
    { min: 0, max: 24 },
    { min: 25, max: 49 },
    { min: 50, max: 74 },
    { min: 75, max: searchMaxValue("fats") },
    { min: 0, max: searchMaxValue("fats") },
  ],
  carbs: [
    { min: 0, max: 24 },
    { min: 25, max: 49 },
    { min: 50, max: 74 },
    { min: 75, max: searchMaxValue("carbs") },
    { min: 0, max: searchMaxValue("carbs") },
  ],
});

function filtration() {
  if (n_calories.value !== "") {
    if (n_proteins.value === "") n_proteins.value = 4;
    if (n_fats.value === "") n_fats.value = 4;
    if (n_carbs.value === "") n_carbs.value = 4;
    let foodFilter = foods.value.filter(
      (f) =>
        f.calories.between(
          criteria.value.calories[n_calories.value].min,
          criteria.value.calories[n_calories.value].max
        ) &&
        f.proteins.between(
          criteria.value.proteins[n_proteins.value].min,
          criteria.value.proteins[n_proteins.value].max
        ) &&
        f.fats.between(
          criteria.value.fats[n_fats.value].min,
          criteria.value.fats[n_fats.value].max
        ) &&
        f.carbs.between(
          criteria.value.carbs[n_carbs.value].min,
          criteria.value.carbs[n_carbs.value].max
        )
    );
    mess.value = "";
    emit("foodFilter", foodFilter);
  } else mess.value = "Выберите необходимый диапазон калорий";
}
Number.prototype.between = function (min, max) {
  return this >= min && this <= max;
};
function searchMaxValue(parametr) {
  return foods.value
    .map((item) => item[parametr])
    .reduce((prev, current) => (prev > current ? prev : current));
}
</script>

<style scoped lang="scss">
@use "../styles/settings";

.title-filter {
  color: settings.$mainColorText;
  font-weight: bold;
}
.btn-ok {
  @include settings.btnStyle();
}
.mess {
  @include settings.mess();
}
</style>