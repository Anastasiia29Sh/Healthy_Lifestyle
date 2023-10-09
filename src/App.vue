<template>
  <v-app class="app h-screen w-100">
    <v-main class="main-content h-screen overflow-y-auto">
      <router-view />
    </v-main>

    <v-bottom-navigation grow absolute="true" class="main-nav-footer">
      <v-btn to="/">
        <v-icon>mdi-notebook</v-icon>
        Дневник
      </v-btn>
      <v-btn to="/statistics">
        <v-icon>mdi-heart</v-icon>
        Статистика
      </v-btn>
      <v-btn to="/foodDirectory">
        <v-icon>mdi-basket</v-icon>
        Справочник
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { useLisfFoodsStore } from "@/store/listFoods";

const listFoodStore = useLisfFoodsStore();
const { fetchFoods } = listFoodStore;
fetchFoods();
</script>

<style scoped lang="scss">
@use "./styles/settings";
.app {
  background-color: settings.$mainColorBg;
  margin: 0 auto;
  .main-nav-footer {
    background-color: settings.$mainColorBg;
    color: #fff;
  }
  .main-content::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 600px) {
    width: 600px !important;
  }
}
</style>
