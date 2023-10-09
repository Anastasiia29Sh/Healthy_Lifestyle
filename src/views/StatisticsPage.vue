<template>
  <v-container class="this-page h-screen overflow-y-auto">
    <h2 class="ps-6">Статистика</h2>
    <v-tabs v-model="tab" class="mt-4">
      <v-tab value="personalization">Персонализация</v-tab>
      <v-tab value="total-statistics">Общая статистика</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <!-- Статистика дня и Персонализация -->
      <v-window-item value="personalization" class="personalization mt-8">
        <!-- Статистика дня -->
        <DayStatistics
          @totalCaloriesDay="
            (res) => {
              totalCaloriesDay = res;
            }
          "
          @updateSelectedDate="reset()"
        />
        <v-btn
          @click="openCalculatorСalorie = !openCalculatorСalorie"
          class="btn-calculator-calorie mt-8 mb-6"
          variant="outlined"
        >
          Рассчитать Вашу суточную норму калорий
        </v-btn>
        <div
          :class="[
            'calculator-сalorie',
            openCalculatorСalorie ? 'block-show' : '',
          ]"
        >
          <!-- Калькулятор калорий -->
          <CalculatorCalorie
            :totalCaloriesDay="totalCaloriesDay"
            @normCalorie="
              (res) => {
                normCalorie = res;
              }
            "
            @comment="
              (res) => {
                comment = res;
              }
            "
          />
          <p :class="['result', normCalorie === null ? '' : 'block-show']">
            Суточная норма калорий: {{ normCalorie }} Ккал
          </p>
          <p>{{ comment }}</p>
        </div>
      </v-window-item>
      <!-- Общая статистика -->
      <v-window-item value="total-statistics" class="total-statistics mt-8">
        <GeneralStatistics />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useLisfFoodsStore } from "@/store/listFoods";

// Компоненты
import DayStatistics from "@/components/DayStatistics.vue";
import GeneralStatistics from "@/components/GeneralStatistics.vue";
import CalculatorCalorie from "@/components/CalculatorCalorie.vue";

const listFoodStore = useLisfFoodsStore();
const { getAllFoods } = listFoodStore;
getAllFoods();

const tab = ref(null);

const totalCaloriesDay = ref();
const comment = ref("");
const normCalorie = ref(null);
const openCalculatorСalorie = ref(false);

function reset() {
  openCalculatorСalorie.value = false;
  comment.value = "";
  normCalorie.value = null;
}
</script>

<style scoped lang="scss">
.calculator-сalorie {
  display: none;
}
.btn-calculator-calorie {
  color: "#33691E";
  &:hover {
    background-color: #7cb342;
    color: #fff;
  }
}
.result {
  display: none;
}
.block-show {
  display: block;
}
</style>
