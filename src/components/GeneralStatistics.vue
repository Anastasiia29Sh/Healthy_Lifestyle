<template>
  <div class="selected-date">
    <p>Выберите даты, за которые будет считаться статистика</p>
    <v-row class="mt-2">
      <v-col cols="5">
        <v-text-field
          label="Начальная дата"
          v-model="startSelectedDate"
          type="date"
          variant="underlined"
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          label="Конечная дата"
          v-model="endSelectedDate"
          type="date"
          variant="underlined"
        />
      </v-col>
      <v-col cols="2">
        <v-btn
          @click="getStatistics()"
          variant="text"
          icon="mdi-send"
          size="large"
        />
      </v-col>
    </v-row>
    <p class="mess">{{ mess }}</p>
  </div>
  <div :class="['chart-data', 'mt-4', openChartData ? 'block-show' : '']">
    <!-- Общее кол-во кбжу за введенный диапазон дат -->
    <v-row class="all-total-cpfc-statistics" dense>
      <v-col cols="12"><U>Всего было потреблено:</U></v-col>
      <v-col cols="6"><b>Калории:</b> {{ allTotalCPFC.calories }} Ккал</v-col>
      <v-col cols="6"><b>Белки:</b> {{ allTotalCPFC.proteins }} г</v-col>
      <v-col cols="6"><b>Жиры:</b> {{ allTotalCPFC.fats }} г</v-col>
      <v-col cols="6"><b>Углеводы:</b> {{ allTotalCPFC.carbs }} г</v-col>
    </v-row>
    <!-- Общее кол-во кбжу за дни, недели, месяца, года -->
    <div class="total-cpfc-statistics mt-8">
      <v-row>
        <v-col v-for="name in namechartData" :key="name.en">
          <v-btn
            variant="text"
            class="name-chart"
            @click="
              cbfc = name.en;
              getChartDate();
            "
            >{{ name.ru }}
          </v-btn>
        </v-col>
      </v-row>
      <v-select
        :items="nameCriteriaChartData"
        v-model="criteriaChartData"
        item-title="title"
        item-value="value"
        @update:modelValue="getChartDate()"
        variant="underlined"
        class="mt-4"
        color="#689F38"
      ></v-select>
      <Bar :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLisfFoodsStore } from "@/store/listFoods";
import { storeToRefs } from "pinia";
import { Bar } from "vue-chartjs";
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
const { foods } = storeToRefs(listFoodStore);
const { getAllFoods, getListTotalCPFCFoodStatistics } = listFoodStore;
getAllFoods();

const openChartData = ref(false);

const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
});

const mess = ref("");

const listTotalCPFCFoodStatistics = ref();

const namechartData = ref([
  { ru: "Калории", en: "calories" },
  { ru: "Белки", en: "proteins" },
  { ru: "Жиры", en: "fats" },
  { ru: "Углеводы", en: "carbs" },
]);
const nameCriteriaChartData = ref([
  { title: "По дням", value: "day" },
  { title: "По неделям", value: "week" },
  { title: "По месяцам", value: "month" },
  { title: "По годам", value: "year" },
]);
const cbfc = ref("calories");
const criteriaChartData = ref("day");

const startSelectedDate = ref("");
const endSelectedDate = ref("");
const startDate = ref();
const endDate = ref();

const masWeek = ref([]);
const masMonth = ref([]);
const masYear = ref([]);

const allTotalCPFC = ref({
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
});

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

function getStatistics() {
  allTotalCPFC.value = {
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
  };
  if (checkDate(startSelectedDate.value) && checkDate(endSelectedDate.value)) {
    startDate.value = formatDate(startSelectedDate.value);
    endDate.value = formatDate(endSelectedDate.value);
    if (startDate.value <= endDate.value) {
      // получаем общее кол-во кбжу всех "съеденных" продуктов в определенный день, входящий в введенный диапазон дат
      listTotalCPFCFoodStatistics.value = getListTotalCPFCFoodStatistics(
        startDate.value,
        endDate.value
      );
      if (listTotalCPFCFoodStatistics.value.length !== 0) {
        // считаем общее кол-во кбжу всех "съеденных" продуктов за указанный диапазон дат
        listTotalCPFCFoodStatistics.value.forEach((element) => {
          allTotalCPFC.value.calories += element.calories;
          allTotalCPFC.value.proteins += element.proteins;
          allTotalCPFC.value.fats += element.fats;
          allTotalCPFC.value.carbs += element.carbs;
        });
        getChartDate();
        mess.value = "";
        openChartData.value = true;
      } else {
        mess.value = "Нет данных";
        openChartData.value = false;
      }
    } else {
      mess.value = "Введите корректную дату";
      openChartData.value = false;
    }
  } else openChartData.value = false;
}

function getChartDate() {
  let label = getLabelChartDate(criteriaChartData.value);
  let datasets = getDatasetsChartDate(criteriaChartData.value, cbfc.value);
  chartData.value = {
    labels: label,
    datasets: [{ label: cbfc.value, data: datasets }],
  };
}

// получаем datasets графика
function getDatasetsChartDate(criteria, cpfc) {
  if (criteria === "day")
    return listTotalCPFCFoodStatistics.value.map((item) => item[cpfc]);
  else if (criteria === "week")
    return totalCPFCWeekMonthYear(masWeek.value, cpfc);
  else if (criteria === "month")
    return totalCPFCWeekMonthYear(masMonth.value, cpfc);
  else if (criteria === "year")
    return totalCPFCWeekMonthYear(masYear.value, cpfc);
}

function totalCPFCWeekMonthYear(mas, cpfc) {
  let res = [];
  for (let i = 0; i < mas.length; i++) {
    let sum = 0;
    for (let j = 0; j < listTotalCPFCFoodStatistics.value.length; j++) {
      let d = listTotalCPFCFoodStatistics.value[j].date;
      if (d >= mas[i].start && d <= mas[i].end) {
        sum += listTotalCPFCFoodStatistics.value[j][cpfc];
      }
      res[i] = sum;
    }
  }
  return res;
}

// получаем label графика
function getLabelChartDate(criteria) {
  //  массив дней из введенного диапазона дат
  if (criteria === "day")
    return listTotalCPFCFoodStatistics.value.map((item) =>
      formatDate2(item.date)
    );
  // массив недель из введенного диапазона дат
  else if (criteria === "week") {
    masWeek.value = [];
    let endWeek = getWeekDate(startDate.value);
    while (endWeek < endDate.value) {
      endWeek = getWeekDate(
        new Date(
          endWeek.getFullYear(),
          endWeek.getMonth(),
          endWeek.getDate() + 1,
          0,
          0,
          0,
          0
        )
      );
    }
    return masWeek.value.map(
      (item) => formatDate2(item.start) + "-" + formatDate2(item.end)
    );
  }
  // массив месяцев из введенного диапазона дат
  else if (criteria === "month") {
    masMonth.value = [];
    let endMonth = getMonthDate(startDate.value);
    while (endMonth < endDate.value) {
      endMonth = getMonthDate(
        new Date(
          endMonth.getFullYear(),
          endMonth.getMonth(),
          endMonth.getDate() + 1,
          0,
          0,
          0,
          0
        )
      );
    }
    return masMonth.value.map((item) =>
      item.end.toLocaleString("default", { month: "long" })
    );
  }
  // массив годов из введенного диапазона дат
  else if (criteria === "year") {
    masYear.value = [];
    let endYear = getYearDate(startDate.value);
    while (endYear < endDate.value) {
      endYear = getYearDate(
        new Date(
          endYear.getFullYear(),
          endYear.getMonth(),
          endYear.getDate() + 1,
          0,
          0,
          0,
          0
        )
      );
    }
    return masYear.value.map((item) => item.end.getFullYear());
  }
}
// поиск начальной и конечной даты недели
function getWeekDate(startDate) {
  let startWeek = new Date(
    startDate.getTime() -
      (startDate.getDay() > 0
        ? (startDate.getDay() - 1) * 1000 * 60 * 60 * 24
        : 6 * 1000 * 60 * 60 * 24)
  );
  let endWeek = new Date(startWeek.getTime() + 1000 * 60 * 60 * 24 * 7 - 1);
  masWeek.value.push({ start: startWeek, end: endWeek });
  return endWeek;
}
// поиск начальной и конечной даты месяца
function getMonthDate(startDate) {
  let firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  let lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  masMonth.value.push({ start: firstDay, end: lastDay });
  return lastDay;
}
// поиск начальной и конечной даты года
function getYearDate(startDate) {
  let firstDay = new Date(startDate.getFullYear(), 0, 1);
  let lastDay = new Date(startDate.getFullYear(), 11, 31);
  masYear.value.push({ start: firstDay, end: lastDay });
  return lastDay;
}

function formatDate(date) {
  let day = date.split("-")[2].replace(/0+/g, "");
  let month = date.split("-")[1];
  let year = date.split("-")[0];
  return new Date(year + ", " + month + ", " + day);
}
function formatDate2(date) {
  let day = date.getDate();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return new Array(day, month, year).join(".");
}
</script>

<style scoped lang="scss">
@use "../styles/settings";

.chart-data {
  display: none;
}
.name-chart-data:focus {
  border-bottom: 3px solid #558b2f;
}
.name-chart {
  border: 1px solid #33691e85;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #0000001f;
  }
}
.block-show {
  display: block;
}
.mess {
  @include settings.mess();
}
</style>
