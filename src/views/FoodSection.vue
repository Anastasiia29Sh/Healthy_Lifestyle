<template>
  <v-container class="this-page h-screen overflow-y-auto">
    <router-link :to="{ name: 'Home', params: { date: route.params.date } }">
      <v-icon color="#33691E">mdi-arrow-left</v-icon>
    </router-link>
    <p class="ps-6">
      <b>{{ SectionDate }}</b> Съеденные продукты
    </p>
    <!-- Таблица данных -->
    <v-data-table
      :headers="headers"
      :items="listFoodSpecificSectionDate"
      :class="['foods-table', 'mt-8', showTable ? '' : 'block-none']"
    >
      <template v-slot:item.name="{ item }">
        <p class="name-food" @click="getDescriptionFood(item.raw.id)">
          {{ item.columns.name }}
        </p>
      </template>
      <template v-slot:top>
        <!-- Панель редактирования -->
        <v-dialog v-model="openPalenEdit" max-width="500px">
          <AddEditFoodSectionPanel
            :titlePanel="titlePanel"
            :action="action"
            @openPalenAddEdit="
              (res) => {
                openPalenEdit = res;
              }
            "
            @rewriteListFood="getListFood()"
          />
        </v-dialog>
        <!-- Панель удаления -->
        <v-dialog v-model="openPalenDelete" max-width="500px">
          <v-card>
            <v-container>
              <span>Вы уверены, что хотите удалить этот продукт?</span>
              <div class="actions pt-4">
                <v-btn @click="okDelete()" class="btn-delete">Удалить</v-btn>
                <v-btn
                  variant="text"
                  class="ml-2"
                  @click="openPalenDelete = false"
                >
                  Отмена
                </v-btn>
              </div>
            </v-container>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="text"
          @click="editFood(item.raw)"
          prepend-icon="mdi-pencil-outline"
          size="40px"
          color="#33691E"
          stacked
        />
        <v-btn
          variant="text"
          @click="deleteFood(item.raw)"
          prepend-icon="mdi-delete-outline"
          size="40px"
          color="red"
          stacked
        />
      </template>
    </v-data-table>
    <!-- Описание продуктов -->
    <v-dialog v-model="openDescription" max-width="300px">
      <v-card>
        <v-container>
          <p>Калории - {{ descriptionFood.calories }} Ккал</p>
          <p>Белки - {{ descriptionFood.proteins }} г</p>
          <p>Жиры - {{ descriptionFood.fats }} г</p>
          <p>Углеводы - {{ descriptionFood.carbs }} г</p>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- Если нет съеденных продуктов -->
    <v-container
      :class="['mt-16', 'text-center', showTable ? 'block-none' : '']"
    >
      <p>Вы еще не внесли ни одного блюда</p>
      <v-btn
        variant="tonal"
        class="btn-add-food mt-4"
        @click="
          $router.push(
            `/healthy_lifestyle/FoodSelection/${route.params.date}/${route.params.section}`
          )
        "
      >
        Добавить
      </v-btn>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useLisfFoodsStore } from "@/store/listFoods";
import { useActionsFoodStore } from "@/store/actionsFood";
import { storeToRefs } from "pinia";
// Компоненты
import AddEditFoodSectionPanel from "@/components/AddEditFoodSectionPanel.vue";

const route = useRoute();
const listFoodStore = useLisfFoodsStore();
const actionsFoodStore = useActionsFoodStore();

const { foods, listFoodSpecificSectionDate } = storeToRefs(listFoodStore);
const { getAllFoods, getListFoodSpecificSectionDate } = listFoodStore;
getAllFoods();
const { addedFoodSectionDate, infaAddedFoodSectionDate, idFood } =
  storeToRefs(actionsFoodStore);
const { deleteFoodSectionDate } = actionsFoodStore;
// Поиск продуктов конкретного дня и конкретного приема пищи
const addedFoodSpecificSectionDate = ref([]);
function getListFood() {
  addedFoodSpecificSectionDate.value = addedFoodSectionDate.value.filter(
    (f) => f.section === route.params.section && f.date === route.params.date
  );
  getListFoodSpecificSectionDate(addedFoodSpecificSectionDate);
}
getListFood();

const showTable = ref(
  listFoodSpecificSectionDate.value.length > 0 ? true : false
);

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
  { key: "weight", title: "Масса (г)" },
  { key: "calories", title: "Калории (Ккал)" },
  { key: "actions", title: "" },
];

// Описание продуктов
const openDescription = ref(false);
const descriptionFood = ref({
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
});
function getDescriptionFood(id) {
  let food = foods.value.filter((f) => f.id === id)[0];
  descriptionFood.value = {
    calories: food.calories,
    proteins: food.proteins,
    fats: food.fats,
    carbs: food.carbs,
  };
  openDescription.value = !openDescription.value;
}

// Редактирование
const openPalenEdit = ref(false);
let action = "edit";
let titlePanel = "Редактировать";
function editFood(item) {
  idFood.value = item.id;
  infaAddedFoodSectionDate.value = {
    id: item.id,
    name: item.name,
    weight: item.weight,
    section: route.params.section,
    date: route.params.date,
  };
  openPalenEdit.value = true;
}

// Удаление
const openPalenDelete = ref(false);
function deleteFood(item) {
  idFood.value = item.id;
  openPalenDelete.value = true;
}
function okDelete() {
  deleteFoodSectionDate();
  getListFood();
  openPalenDelete.value = false;
}

watch(listFoodSpecificSectionDate, () => {
  showTable.value = listFoodSpecificSectionDate.value.length > 0 ? true : false;
});
</script>

<style scoped lang="scss">
@use "../styles/settings";

.this-page {
  background-color: #fff;
  border-top: 20px solid settings.$mainColorBg;
}
.foods-table {
  font-size: 12px;
  .name-food {
    text-decoration: underline;
    color: #33691e;
    &:hover {
      cursor: pointer;
      color: #76ff03;
    }
  }
}
.btn-add-food,
.btn-delete {
  @include settings.btnStyle();
}

.block-none {
  display: none;
}
</style>