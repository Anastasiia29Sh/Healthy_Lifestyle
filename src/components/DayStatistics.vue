<template>
  <v-row>
    <v-col cols="5">
      <v-text-field
        label="Дата"
        v-model="selectedDate"
        type="date"
        variant="underlined"
        append-icon="mdi-send"
        class="ml-2"
        @click:append="getStatisticsDay()"
      />
    </v-col>
  </v-row>
  <p class="mess">{{ mess }}</p>
  <Pie :options="chartOptions" :data="piaChartData" class="pia-chart mt-2" />
</template>

<script setup>
import { ref } from "vue";
import { useLisfFoodsStore } from "@/store/listFoods";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const listFoodStore = useLisfFoodsStore();
// const { foods } = storeToRefs(listFoodStore);
const { getAllFoods, getListTotalCPFCFoodStatistics } = listFoodStore;
getAllFoods();

const emit = defineEmits(["totalCaloriesDay", "updateSelectedDate"]);

const mess = ref("");

let currentDate = new Date();
currentDate =
  currentDate.getFullYear() +
  "-" +
  ("0" + (currentDate.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + currentDate.getDate()).slice(-2);
const selectedDate = ref(currentDate);

const piaChartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
});

function getStatisticsDay() {
  if (checkDate(selectedDate.value)) {
    let date = formatDate(selectedDate.value);
    // получаем общее кол-во кбжу всех "съеденных" продуктов за день
    let listTotalCPFCFoodStatisticsDay = getListTotalCPFCFoodStatistics(
      date,
      date
    );
    if (listTotalCPFCFoodStatisticsDay.length !== 0) {
      piaChartData.value = {
        labels: ["Калории", "Белки", "Жиры", "Углеводы"],
        datasets: [
          {
            backgroundColor: ["#CCFF90", "#FFE57F", "#FDD835", "#F4FF81"],
            data: [
              listTotalCPFCFoodStatisticsDay[0].calories,
              listTotalCPFCFoodStatisticsDay[0].proteins,
              listTotalCPFCFoodStatisticsDay[0].fats,
              listTotalCPFCFoodStatisticsDay[0].carbs,
            ],
          },
        ],
      };
      emit("totalCaloriesDay", listTotalCPFCFoodStatisticsDay[0].calories);
    } else {
      piaChartData.value = {
        labels: ["Нет данных"],
        datasets: [{ backgroundColor: ["#00000027"], data: [100] }],
      };
      emit("totalCaloriesDay", 0);
    }
    emit("updateSelectedDate");
  }
}
getStatisticsDay();

function checkDate(selectedDate) {
  if (selectedDate !== "") {
    let year = selectedDate.split("-")[0];
    if (year >= 2000 && year <= 2050) {
      mess.value = "";
      return true;
    }
  } else {
    mess.value = "Введите корректную дату";
    return false;
  }
}

function formatDate(date) {
  let day = date.split("-")[2].replace(/^0+/g, "");
  let month = date.split("-")[1];
  let year = date.split("-")[0];
  return new Date(year + ", " + month + ", " + day);
}
</script>

<style scoped lang="scss">
@use "../styles/settings";

.block-show {
  display: block;
}
.pia-chart {
  width: 72% !important;
  height: 72% !important;
  margin: 0 auto;
}
.mess {
  @include settings.mess();
}
</style>