<template>
  <v-card>
    <v-container>
      <span>Добавление нового продукта</span>
      <v-row class="pt-4">
        <v-col cols="12">
          <v-text-field
            label="Продукт/Блюдо"
            v-model="infaAddedNewFood.name"
            type="text"
            suffix="Ккал"
            variant="underlined"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Калории"
            v-model="infaAddedNewFood.calories"
            type="number"
            suffix="Ккал"
            variant="underlined"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Белки"
            v-model="infaAddedNewFood.proteins"
            type="number"
            suffix="г"
            variant="underlined"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Жиры"
            v-model="infaAddedNewFood.fats"
            type="number"
            suffix="г"
            variant="underlined"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Углеводы"
            v-model="infaAddedNewFood.carbs"
            type="number"
            suffix="г"
            variant="underlined"
          />
        </v-col>
      </v-row>
      <div class="actions">
        <v-btn @click="ok()" class="btn-ok"> Ок </v-btn>
        <v-btn variant="text" @click="close()" class="ml-2"> Отмена </v-btn>
      </div>
      <p class="mess mt-2">{{ mess }}</p>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useActionsFoodStore } from "@/store/actionsFood";
import { storeToRefs } from "pinia";

const actionsFoodStore = useActionsFoodStore();

const { infaAddedNewFood } = storeToRefs(actionsFoodStore);
const { addNewFood } = actionsFoodStore;

let mess = ref("");

const emit = defineEmits(["openPalenAdd", "rewriteListFood"]);

function ok() {
  if (infaAddedNewFood.value.name !== "") {
    addNewFood();
    infaAddedNewFood.value = {
      id: 0,
      name: "",
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
    };
    mess.value = "";
    emit("rewriteListFood");
    close();
  } else {
    mess.value = "Введите все данные";
  }
}
function close() {
  emit("openPalenAdd", false);
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