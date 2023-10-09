<template>
  <v-app-bar flat absolute class="main-header" density="prominent">
    <v-app-bar-title class="main-text">ЗОЖ-Учёт</v-app-bar-title>
  </v-app-bar>
  <v-dialog v-model="openCalendar" width="auto">
    <template v-slot:activator="{ props }">
      <v-container>
        <!-- выбранная дата -->
        <div class="date-selection" v-bind="props">
          <p class="text-date">
            <v-icon>mdi-calendar</v-icon>
            {{ formatDate() }}
          </p>
        </div>
        <!-- 3 раздела: завтрак, обед и ужин  -->
        <div class="meal-sections">
          <div class="d-flex flex-column">
            <v-sheet
              class="mb-6 pa-2 d-flex flex-row justify-space-between align-center section"
            >
              <img src="../assets/breakfast.png" alt="" class="meal-img" />
              <div
                class="w-100 pa-2 ml-2 div-section"
                @click="$router.push(`/FoodSection/${selectedDate}/breakfast`)"
              >
                <p>Завтрак</p>
              </div>
              <v-btn
                icon
                variant="tonal"
                color="#1e3e11"
                @click="
                  $router.push(`/FoodSelection/${selectedDate}/breakfast`)
                "
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-sheet>
            <v-sheet
              class="mb-6 pa-2 d-flex flex-row justify-space-between align-center section"
            >
              <img src="../assets/lunch.png" alt="" class="meal-img" />
              <div
                class="w-100 pa-2 ml-2 div-section"
                @click="$router.push(`/FoodSection/${selectedDate}/lunch`)"
              >
                <p>Обед</p>
              </div>
              <v-btn
                icon
                variant="tonal"
                color="#1e3e11"
                @click="$router.push(`/FoodSelection/${selectedDate}/lunch`)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn></v-sheet
            >
            <v-sheet
              class="pa-2 d-flex flex-row justify-space-between align-center section"
            >
              <img src="../assets/dinner.png" alt="" class="meal-img" />
              <div
                class="w-100 pa-2 ml-2 div-section"
                @click="$router.push(`/FoodSection/${selectedDate}/dinner`)"
              >
                <p>Ужин</p>
              </div>
              <v-btn
                icon
                variant="tonal"
                color="#1e3e11"
                @click="$router.push(`/FoodSelection/${selectedDate}/dinner`)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-sheet>
          </div>
        </div>
      </v-container>
    </template>

    <!-- Календарь -->
    <div>
      <v-date-picker
        v-model="date"
        title=""
        @update:modelValue="openCalendar = false"
        hide-actions="true"
        keyboard-icon=""
        color="#33691E"
        theme="dark"
        class="calendar"
        elevation="24"
      />
    </div>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
let d = new Date();
if (route.params.date !== "") {
  let mas_d = route.params.date.split(".");
  d = new Date(mas_d[2] + ", " + mas_d[1] + ", " + mas_d[0]);
}
const date = ref(d);
const openCalendar = ref(false);
const selectedDate = ref("");

let days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

function formatDate() {
  let day = date.value.getDate();
  let month = ("0" + (date.value.getMonth() + 1)).slice(-2);
  let year = date.value.getFullYear();
  selectedDate.value = new Array(day, month, year).join(".");
  let n = date.value.getDay();
  return days[n] + ", " + selectedDate.value;
}
</script>

<style lang="scss">
@use "../styles/settings";
.main-header {
  background-color: settings.$mainColorBg !important;
  background-image: url(../assets/fon1.png) !important;
  background-repeat: no-repeat !important;
  background-size: 100% !important;
  background-position-x: 50% !important;
  .main-text {
    font-size: 36px !important;
    font-weight: bold !important;
    text-align: center;
    color: settings.$mainColorText;
  }
}

.app {
  background-color: settings.$mainColorBg !important;
}

.date-selection {
  margin-top: 20px;
  text-align: center;
  padding: 10px 5px 5px 5px;
  border-top: 1px solid #00000050;
  &:hover {
    color: #ffffff77;
    cursor: pointer;
  }
}

.meal-sections {
  margin-top: 30px;
  .section {
    background-color: #0000001d;
    border-radius: 15px;
    .meal-img {
      width: 50px;
    }
    &:hover {
      background-color: #689f38;
    }
  }
}

.calendar {
  background-color: settings.$colorCalendar;
}
</style>
