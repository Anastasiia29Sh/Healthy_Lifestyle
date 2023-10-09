<template>
  <v-container class="this-page h-screen overflow-y-auto">
    <h2 class="ps-6">Справочник</h2>
    <v-btn
      variant="outlined"
      @click="addNewFood()"
      class="mt-2 float-right"
      color="#33691E"
    >
      Новый продукт
    </v-btn>
    <!-- Поиск -->
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Поиск"
      single-line
      hide-details
      variant="underlined"
      class="mt-14"
    />
    <!-- Фильтрация -->
    <v-btn
      variant="text"
      color="#1e3e11"
      @click="showFilter = !showFilter"
      class="mt-4 float-right"
    >
      <v-icon color="#33691E">mdi-filter</v-icon>
      Фильтрация
    </v-btn>
    <FilterFood
      @foodFilter="(res) => resFilter(res)"
      :class="['filter', 'mt-16', showFilter ? 'block-show' : '']"
    />
    <!-- Таблица данных -->
    <v-data-table
      :headers="headers"
      :items="allFoods"
      :search="search"
      class="foods-table mt-16"
    />
    <!-- Панель добавления нового продукта -->
    <v-dialog v-model="openPalenAdd" max-width="500px">
      <AddNewFoodPanel
        @openPalenAdd="
          (res) => {
            openPalenAdd = res;
          }
        "
        @rewriteListFood="getListFood()"
      />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useLisfFoodsStore } from "@/store/listFoods";
import { useActionsFoodStore } from "@/store/actionsFood";
import { storeToRefs } from "pinia";
// Компоненты
import FilterFood from "@/components/FilterFood.vue";
import AddNewFoodPanel from "@/components/AddNewFoodPanel.vue";

const listFoodStore = useLisfFoodsStore();
const actionsFoodStore = useActionsFoodStore();

const { foods } = storeToRefs(listFoodStore);
const { getAllFoods } = listFoodStore;
const allFoods = ref();
const search = ref("");

function getListFood() {
  getAllFoods();
  allFoods.value = foods.value;
}
getListFood();

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
];

// Добавление нового продукта
const openPalenAdd = ref(false);
const { infaAddedNewFood } = storeToRefs(actionsFoodStore);
function addNewFood() {
  infaAddedNewFood.value.id = allFoods.value.length;
  openPalenAdd.value = true;
}

// фильтрация
const showFilter = ref(false);
function resFilter(res) {
  allFoods.value = res;
  showFilter.value = false;
}
</script>


<style scoped lang="scss">
@use "../styles/settings";

.filter {
  display: none;
}
.this-page {
  background-color: #fff;
  border-top: 20px solid settings.$mainColorBg;
}

.foods-table {
  margin-top: 20px;
  font-size: 12px;
}
.block-show {
  display: block;
}
</style>