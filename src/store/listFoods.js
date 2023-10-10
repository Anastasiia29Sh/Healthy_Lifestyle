import { defineStore } from 'pinia'
import axios from "axios"
import { ref } from "vue";

export const useLisfFoodsStore = defineStore('listFoods', () => {
	// весь список продуктов из бд
	const foods = ref([]);
	const foodsBD = ref([]);
	const infaAddedFoodSpecificSectionDate = ref({
		id: 0,
		name: "",
		weight: 0,
		calories: 0,
	});
	// кбжу "съеденных "продуктов, в определенный день (для статистики)
	const cpfcFoodDate = ref({
		calories: 0,
		proteins: 0,
		fats: 0,
		carbs: 0,
		date: ""
	});
	// список продуктов конкретного дня и конкретного приема пищи
	const listFoodSpecificSectionDate = ref([]);
	// http://localhost:3000/foods
	// Получить весь список продуктов из бд
	async function fetchFoods() {
		axios.get("https://anastasiia29sh.github.io/api_food/food.json").then((res) => {
			// console.log(res.data.foods);
			let i = 0;
			foodsBD.value = res.data.foods.map((item) => {
				item.calories = parseFloat(item.calories.replace(' кКал', ''));
				item.proteins = parseFloat(item.proteins.replace(' г', ''));
				item.fats = parseFloat(item.fats.replace(' г', ''));
				item.carbs = parseFloat(item.carbs.replace(' г', ''));
				return { ...item, id: i++ };
			});
		});
	}
	function getAllFoods(){
		foods.value = foodsBD.value.concat(JSON.parse(localStorage.getItem("addedNewFood") || "[]"));
	}

	// Получить список продуктов конкретного дня и конкретного приема пищи
	function getListFoodSpecificSectionDate(addedFoodSpecificSectionDate){
		listFoodSpecificSectionDate.value = [];
		for (let i = 0; i < addedFoodSpecificSectionDate.value.length; i++) {
			let infa = foods.value.filter(
				(f) => f.id === addedFoodSpecificSectionDate.value[i].id
			)[0];
			infaAddedFoodSpecificSectionDate.value = {
				id: infa.id,
				name: infa.name,
				weight: addedFoodSpecificSectionDate.value[i].weight,
				calories: (addedFoodSpecificSectionDate.value[i].weight * infa.calories) / 100,
			};
			listFoodSpecificSectionDate.value.push(infaAddedFoodSpecificSectionDate.value);
		}
	}

	// получить общее кол-во кбжу всех "съеденных" продуктов в определенный день, входящий в введенный диапазон дат (для статистики)
	function getListTotalCPFCFoodStatistics(startD, endD){
		let addedFoodSectionDate = JSON.parse(localStorage.getItem("addedFood") || "[]");
		let masFoodDate = addedFoodSectionDate.filter((f) => {
			let d = formatDate(f.date);
			return d >= startD && d <= endD;
		});
		let listCPFCFoodStatistics = [];
		for(let i = 0; i < masFoodDate.length; i++){
			let item = foods.value.filter((f) => f.id === masFoodDate[i].id)[0];
			cpfcFoodDate.value = {
				calories: (masFoodDate[i].weight * item.calories) / 100,
				proteins: (masFoodDate[i].weight * item.proteins) / 100,
				fats: (masFoodDate[i].weight * item.fats) / 100,
				carbs: (masFoodDate[i].weight * item.carbs) / 100,
				date: formatDate(masFoodDate[i].date)
			};
			listCPFCFoodStatistics.push(cpfcFoodDate.value);
		}
		// Общее кол-во кбжу всех "съеденных" продуктов в определенный день 
		const totalCPFCFoodStatistics = listCPFCFoodStatistics.reduce((totalCPFCFoodStatistics, currentValue) => {
			if (totalCPFCFoodStatistics[currentValue.date]) {
				totalCPFCFoodStatistics[currentValue.date].calories += currentValue.calories;
				totalCPFCFoodStatistics[currentValue.date].proteins += currentValue.proteins;
				totalCPFCFoodStatistics[currentValue.date].fats += currentValue.fats;
				totalCPFCFoodStatistics[currentValue.date].carbs += currentValue.carbs;
			} else totalCPFCFoodStatistics[currentValue.date] = {...currentValue};
			return totalCPFCFoodStatistics;
		}, {});
		return Object.values(totalCPFCFoodStatistics);
	}

	function formatDate(date){
		let mas_d = date.split(".");
		return new Date(mas_d[2] + ", " + mas_d[1] + ", " + mas_d[0]);
	}

  return { foods, fetchFoods, getAllFoods, listFoodSpecificSectionDate, getListFoodSpecificSectionDate, getListTotalCPFCFoodStatistics }
})