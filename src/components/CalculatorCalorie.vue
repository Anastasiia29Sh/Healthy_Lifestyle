<template>
  <v-text-field
    label="Возраст, лет"
    v-model="dataUser.age"
    type="number"
    variant="underlined"
  />
  <v-text-field
    label="Рост, в см"
    v-model="dataUser.height"
    type="number"
    variant="underlined"
  />
  <v-text-field
    label="Вес, в кг"
    v-model="dataUser.weight"
    type="number"
    variant="underlined"
  />
  <v-radio-group v-model="dataUser.gender" inline>
    <v-radio label="Мужчина" value="man"></v-radio>
    <v-radio label="Женщина" value="woman"></v-radio>
  </v-radio-group>
  <v-select
    label="Степень физической активности"
    :items="levelPhysicalActivity"
    v-model="dataUser.activity"
    item-title="title"
    item-value="value"
    variant="underlined"
  ></v-select>
  <v-btn @click="getNormCalorie()" class="calculate">Рассчитать</v-btn>
  <p class="mess mt-2">{{ mess }}</p>
</template>

<script setup>
import { ref } from "vue";

const levelPhysicalActivity = ref([
  { title: "минимальная активность", value: 1.2 },
  { title: "слабый уровень активности", value: 1.375 },
  { title: "умеренный уровень активности", value: 1.55 },
  { title: "тяжелая или трудоемкая активность", value: 1.7 },
  { title: "экстремальный уровень", value: 1.9 },
]);

const dataUser = ref({
  age: null,
  height: null,
  weight: null,
  gender: "man",
  activity: levelPhysicalActivity.value[0].value,
});

const props = defineProps({
  totalCaloriesDay: Number,
});

const emit = defineEmits(["normCalorie", "comment"]);

const mess = ref("");
const comment = ref("");
const normCalorie = ref(null);

// расчет суточной нормы калорий
function getNormCalorie() {
  if (verificationData()) {
    let partFormula =
      10 * dataUser.value.weight +
      6.25 * dataUser.value.height -
      5 * dataUser.value.age;
    partFormula =
      dataUser.value.gender === "man" ? partFormula + 5 : partFormula - 161;
    normCalorie.value = partFormula * parseFloat(dataUser.value.activity);
    checkExcessDeficiency();
    mess.value = "";
  } else {
    mess.value = "Введите корректные данные";
    normCalorie.value = null;
    comment.value = "";
  }
  emit("normCalorie", normCalorie.value);
  emit("comment", comment.value);
}

// проверка избытка и недостатка
function checkExcessDeficiency() {
  if (props.totalCaloriesDay > normCalorie.value) {
    comment.value =
      "Превышение на " +
      (props.totalCaloriesDay - normCalorie.value) +
      " Ккал!!!";
  } else if (props.totalCaloriesDay < normCalorie.value) {
    comment.value =
      "Недостаток " + (normCalorie.value - props.totalCaloriesDay) + " Ккал!!!";
  } else comment.value = "";
}

function verificationData() {
  let age = parseInt(dataUser.value.age);
  let height = parseFloat(dataUser.value.height);
  let weight = parseFloat(dataUser.value.weight);
  if (
    age > 0 &&
    age <= 100 &&
    height > 0 &&
    height <= 300 &&
    weight > 0 &&
    weight <= 1000
  )
    return true;
  else return false;
}
</script>

<style scoped lang="scss">
@use "../styles/settings";

.calculate {
  @include settings.btnStyle();
  background-color: #7cb342;
}
.mess {
  @include settings.mess();
}
</style>