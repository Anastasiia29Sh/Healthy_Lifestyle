import { defineStore } from 'pinia'
import { ref } from "vue";

export const useActionsFoodStore = defineStore('actionsFood', () => {
	const infaAddedFoodSectionDate = ref({
		id: 0,
		name: "",
		weight: 0,
		section: "",
		date: "",
	});
	const infaAddedNewFood = ref({
		id: 0,
		name: "",
		calories: 0,
		proteins: 0,
		fats: 0,
		carbs: 0,
	});
	const addedFoodSectionDate = ref(JSON.parse(localStorage.getItem("addedFood") || "[]"));
	const addedNewFood = ref(JSON.parse(localStorage.getItem("addedNewFood") || "[]"));
	const idFood = ref();

	// Добавление продуктов в конкретный день и конкретный прием пищи
	function addFoodSectionDate() {
		addedFoodSectionDate.value.push(infaAddedFoodSectionDate.value);
		localStorage.setItem("addedFood", JSON.stringify(addedFoodSectionDate.value));
	}
	// Редактирование продуктов в конкретный день и конкретный прием пищи
	function editFoodSectionDate(newWeight){
		infaAddedFoodSectionDate.value.weight = newWeight;
		deleteFoodSectionDate();
		addFoodSectionDate();
	}
	// Удаление продуктов в конкретный день и конкретный прием пищи
	function deleteFoodSectionDate(){
		addedFoodSectionDate.value = addedFoodSectionDate.value.filter((f) => f.id !== idFood.value);
		localStorage.setItem("addedFood", JSON.stringify(addedFoodSectionDate.value));
	}
	// Добавление новых продуктов в базу
	function addNewFood() {
		addedNewFood.value.push(infaAddedNewFood.value);
		localStorage.setItem("addedNewFood", JSON.stringify(addedNewFood.value));
	}

  return { infaAddedFoodSectionDate, addedFoodSectionDate, addFoodSectionDate, idFood, editFoodSectionDate, deleteFoodSectionDate, infaAddedNewFood, addNewFood }
})