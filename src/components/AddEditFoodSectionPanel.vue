<template>
  <v-card>
    <v-container>
      <span>{{ titlePanel }} - {{ infaAddedFoodSectionDate.name }}</span>
      <v-text-field
        v-model="weightFood"
        label="Масса"
        suffix="г"
        type="number"
        class="pt-4"
        variant="underlined"
      />
      <div class="actions">
        <v-btn @click="ok()" class="btn-ok">Ок</v-btn>
        <v-btn variant="text" @click="close()" class="ml-2">Отмена</v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useActionsFoodStore } from "@/store/actionsFood";
import { storeToRefs } from "pinia";

const actionsFoodStore = useActionsFoodStore();

const { infaAddedFoodSectionDate } = storeToRefs(actionsFoodStore);
const { addFoodSectionDate, editFoodSectionDate } = actionsFoodStore;

const weightFood = ref(infaAddedFoodSectionDate.value.weight);

const props = defineProps({
  titlePanel: String,
  action: String,
});
const emit = defineEmits(["openPalenAddEdit", "rewriteListFood"]);

function ok() {
  if (props.action === "add") {
    infaAddedFoodSectionDate.value.weight = parseFloat(weightFood.value);
    addFoodSectionDate();
  } else if (props.action === "edit") {
    editFoodSectionDate(weightFood.value);
    emit("rewriteListFood");
  }
  weightFood.value = 0;
  close();
}
function close() {
  emit("openPalenAddEdit", false);
}
</script>

<style scoped lang="scss">
@use "../styles/settings";

.btn-ok {
  @include settings.btnStyle();
}
</style>