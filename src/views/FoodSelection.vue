<template>
  <v-container class="this-page h-screen overflow-y-auto">
    <router-link :to="{ name: 'Home', params: { date: route.params.date } }">
      <v-icon color="#33691E">mdi-arrow-left</v-icon>
    </router-link>
    <p class="ps-6">
      Добавить продукты в <b>{{ SectionDate }}</b>
    </p>
    <!-- Фильтрация -->
    <v-btn
      variant="text"
      color="#1e3e11"
      @click="openFilter()"
      class="mt-2 float-right"
    >
      <v-icon color="#33691E">mdi-filter</v-icon>
      Фильтрация
    </v-btn>
    <FilterFood
      @foodFilter="(res) => resFilter(res)"
      :class="['filter', 'mt-12', showFilter ? 'block-show' : '']"
    />
    <!-- Таблица данных -->
    <v-data-table
      :headers="headers"
      :items="allFoods"
      :class="['foods-table', 'mt-16', showFilter ? '' : 'block-show']"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
    >
      <!-- Панель добавления -->
      <template v-slot:top>
        <v-dialog v-model="openPalenAdd" max-width="500px">
          <AddEditFoodSectionPanel
            :titlePanel="titlePanel"
            :action="action"
            @openPalenAddEdit="
              (res) => {
                openPalenAdd = res;
              }
            "
          />
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="text"
          @click="addFood(item.raw)"
          :disabled="getDisabled(item.raw.id)"
          prepend-icon="mdi-plus-circle-outline"
          size="40px"
          color="#33691E"
          stacked
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useActionsFoodStore } from "@/store/actionsFood";
import { storeToRefs } from "pinia";
// Компоненты
import FilterFood from "@/components/FilterFood2.vue";
import AddEditFoodSectionPanel from "@/components/AddEditFoodSectionPanel.vue";

const route = useRoute();
const actionsFoodStore = useActionsFoodStore();

const allFoods = ref([]);
const mess = ref("");

let SectionDate =
  (route.params.section === "breakfast"
    ? "Завтрак"
    : route.params.section === "lunch"
    ? "Обед"
    : route.params.section === "dinner"
    ? "Ужин"
    : "") +
  ", " +
  route.params.date;
let headers = [
  {
    align: "start",
    key: "name",
    sortable: false,
    title: "Продукты/Блюда",
  },
  { key: "calories", title: "Калории (Ккал)" },
  { key: "proteins", title: "Белки (г)" },
  { key: "fats", title: "Жиры (г)" },
  { key: "carbs", title: "Углеводы (г)" },
  { key: "actions", title: "" },
];

// Добавление
const openPalenAdd = ref(false);
let action = "add";
const titlePanel = ref(SectionDate + " Добавить ");
const { infaAddedFoodSectionDate, addedFoodSectionDate } =
  storeToRefs(actionsFoodStore);
function addFood(item) {
  infaAddedFoodSectionDate.value = {
    id: item.id,
    name: item.name,
    section: route.params.section,
    date: route.params.date,
  };
  openPalenAdd.value = true;
}
function getDisabled(id) {
  return addedFoodSectionDate.value.some(
    (item) =>
      item.id === id &&
      item.section === route.params.section &&
      item.date === route.params.date
  );
}

// фильтрация
const showFilter = ref(true);
function openFilter() {
  if (allFoods.value.length === 0) showFilter.value = true;
  else showFilter.value = !showFilter.value;
}
function resFilter(res) {
  allFoods.value = res;
  if (allFoods.value.length === 0) {
    showFilter.value = true;
    mess.value = "По Вашему запросу данных не найдено";
  } else {
    showFilter.value = false;
    mess.value = "";
  }
}
</script>


<style scoped lang="scss">
@use "../styles/settings";

.this-page {
  background-color: #fff;
  border-top: 20px solid settings.$mainColorBg;
}

.filter {
  display: none;
}

.foods-table {
  display: none;
  margin-top: 20px;
  font-size: 12px;
}
.block-show {
  display: block;
}
</style>