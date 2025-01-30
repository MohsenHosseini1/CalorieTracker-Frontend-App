class CalorieTracker {
    constructor() {

        this._calorieLimit = storage.getCalorieLimit();
        this._totalCalories = storage.getTotalCalories();
        this._meals = storage.getMeals();
        this._workouts = storage.getWorkouts();

        this._displayCalorieLimit()
        this._renderStats()
    }

//      ***** Public methods *****

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        storage.updateTotalCalories(this._totalCalories);
        storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._renderStats();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        storage.updateTotalCalories(this._totalCalories);
        storage.saveWorkout(workout);
        this._renderStats()
        this._displayNewWorkout(workout)
    }

    removeWorkout(id) {
        const indexOfWorkout = this._workouts.findIndex(workout => workout.id === id);
        if (indexOfWorkout !== -1) {
            const workout = this._workouts[indexOfWorkout];
            this._totalCalories += workout.calories;
            storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(indexOfWorkout, 1);
            this._renderStats()
        }
    }

    removeMeal(id) {
        const indexOfMeal = this._meals.findIndex(meal => meal.id === id);
        if (indexOfMeal !== -1) {
            const meal = this._meals[indexOfMeal];
            this._totalCalories -= meal.calories;
            storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(indexOfMeal, 1);
            this._renderStats()
        }
    }

    reset(){
        this._meals = [];
        this._totalCalories = 0;
        this._workouts = [];
        storage.updateTotalCalories(this._totalCalories);
        this._displayCalorieLimit()
    }
    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        storage.setCalorieLimit(calorieLimit);
        this._displayCalorieLimit()
        this._renderStats()
    }
    loadMeals() {
        const meals = storage.getMeals()
        meals.forEach(meal => this._displayNewMeal(meal));
    }
    loadWorkouts() {
        const workouts = storage.getWorkouts()
        workouts.forEach(workout => this._displayNewWorkout(workout));
    }

//      ***** Private methods *****

    _displayCaloriesTotal() {
        const caloriesTotalEle = document.getElementById("calories-total");

        caloriesTotalEle.innerHTML = this._totalCalories;
    }

    _displayCalorieLimit() {
        const calorieLimitEle = document.getElementById("calories-limit");

        calorieLimitEle.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEle = document.getElementById("calories-consumed");

        const consumed = this._meals.reduce((total, currentValue) =>{
            return total + currentValue.calories;
        }, 0);

        caloriesConsumedEle.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEle = document.getElementById("calories-burned");

        const burned = this._workouts.reduce((total, currentValue) =>{
            return total + currentValue.calories;
        }, 0);

        caloriesBurnedEle.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEle = document.getElementById("calories-remaining");
        const caloriesProgressEle = document.getElementById("calorie-progress");
        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEle.innerHTML = remaining;

        if (remaining <= 0){
            caloriesRemainingEle.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEle.parentElement.parentElement.classList.add('bg-danger');

            caloriesProgressEle.classList.remove('bg-success');
            caloriesProgressEle.classList.add('bg-danger');
        }else{
            caloriesRemainingEle.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEle.parentElement.parentElement.classList.add('bg-light');

            caloriesProgressEle.classList.remove('bg-danger');
            caloriesProgressEle.classList.add('bg-success');

        }
    }

    _displayCaloriesProgress(){
        const caloriesProgressEle = document.getElementById("calorie-progress");

        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);

        caloriesProgressEle.style.width = `${width}%`;
    }

    _displayNewMeal(meal){
        const mealsEle = document.getElementById("meal-items");
        const mealEle = document.createElement('div');
        mealEle.classList.add('card','my-2');
        mealEle.innerHTML =
            `
              <div class="card-body" data-id = "${meal.id}">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            `
        mealsEle.appendChild(mealEle);
    }
    _displayNewWorkout(workout){
        const workoutsEle = document.getElementById("workout-items");
        const workoutEle = document.createElement('div');
        workoutEle.classList.add('card','my-2');
        workoutEle.innerHTML =`
        <div class="card-body" data-id = ${workout.id}>
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
        `
        workoutsEle.appendChild(workoutEle);
    }

    _renderStats(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress()
    }
}

class Meal {
    constructor(name,calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;

    }
}
class Workout {
    constructor(name,calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;

    }
}

class storage {
    static getCalorieLimit(defaultLimit = 2000){
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        }else{
            calorieLimit = parseInt(localStorage.getItem('calorieLimit'));
        }
        return calorieLimit;
    }
    static setCalorieLimit(caloriesLimit) {
        localStorage.setItem('calorieLimit', caloriesLimit);
    }
    static getTotalCalories(defaultTotalCalories = 0) {
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultTotalCalories;
        }else{
            totalCalories = parseInt(localStorage.getItem('totalCalories'));
        }
        return totalCalories;
    }
    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories',calories);
    }
    static getMeals() {
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals = [] ;
        }else{
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }
    static saveMeal(meal) {
        const meals = storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [] ;
        }else{
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }
    static saveWorkout(workout) {
        const workouts = storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}


class App {
    constructor() {
        this._tracker = new CalorieTracker()

        document.getElementById("meal-form").addEventListener('submit', this._newItems.bind(this,'meal'));
        document.getElementById("workout-form").addEventListener('submit', this._newItems.bind(this,'workout'));

        document.getElementById("meal-items").addEventListener('click', this._removeItems.bind(this,'meal'));
        document.getElementById("workout-items").addEventListener('click', this._removeItems.bind(this,'workout'));

        document.getElementById('filter-meals').addEventListener('input',this._filterItems.bind(this,"meal"));
        document.getElementById('filter-workouts').addEventListener('input',this._filterItems.bind(this,"workout"));

        document.getElementById('reset').addEventListener('click',this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit',this._setLimit.bind(this));

        this._tracker.loadMeals()
        this._tracker.loadWorkouts()

    }
//      ***** Private methods *****
    _newItems(type,evt){
        evt.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);
        //    validation
        if(name.value === "" || calories.value === ""){
            alert("All input must be filled");
            return 0 ;
        }
        if(type === "meal"){
            const meal = new Meal(name.value, calories.value*1);
            this._tracker.addMeal(meal);
        }else if(type === "workout"){
            const workout = new Workout(name.value, calories.value*1);
            this._tracker.addWorkout(workout);
        }else{
            console.log("error");
        }


        name.value = "";
        calories.value = "";
    }
    _removeItems(type,evt) {
        if(evt.target.classList.contains('delete') || evt.target.classList.contains('fa-solid')){
            if (confirm("Are you sure you want to delete ?")){
                const id = evt.target.closest('.card-body').getAttribute('data-id');

                if (type === 'meal'){
                    this._tracker.removeMeal(id);
                }else if (type === 'workout') {
                    this._tracker.removeWorkout(id);
                }else{
                    console.log("E")
                }

                evt.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type,evt) {
        const searchValue = (evt.target.value).toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent.toLowerCase();
            if (name.indexOf(searchValue) !== -1) {
                item.style.display = 'block';
            }else{
                item.style.display = 'none';
            }
        })
    }
    _reset(){
        if(confirm("Are you sure you want to reset?")){
            this._tracker.reset()
            document.getElementById("workout-items").innerHTML = "";
            document.getElementById("meal-items").innerHTML = "";
            document.getElementById("filter-meals").value = "";
            document.getElementById("filter-workouts").value = "";
        }

    }
    _setLimit(evt){
        evt.preventDefault();
        const limit = document.getElementById("limit");
        if(limit.value === ""){
            alert("Please enter a number");
            return 0;
        }
        this._tracker.setLimit(limit.value*1);
        limit.value = "";

        const limitModal = bootstrap.Modal.getInstance(document.getElementById("limit-modal"));
        limitModal.hide();
    }
}

const app = new App();
