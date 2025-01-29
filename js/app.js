class CalorieTracker {
    constructor() {

        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCalorieLimit()
        this._renderStats()
    }

//      ***** Public methods *****

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._renderStats()
        this._displayNewMeal(meal)
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._renderStats()
        this._displayNewWorkout(workout)
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
        mealsEle.classList.add('card','my-2');
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
        <div class="card-body">
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

class App {
    constructor() {
        this._tracker = new CalorieTracker()

        document.getElementById("meal-form").addEventListener('submit', this._newMeal.bind(this));
        document.getElementById("workout-form").addEventListener('submit', this._newWorkout.bind(this));

    }
//      ***** Private methods *****
    _newMeal(evt){
        evt.preventDefault();
        const name = document.getElementById("meal-name");
        const calories = document.getElementById("meal-calories");

    //    validation
        if(name.value === "" || calories.value === ""){
            alert("All input must be filled");
            return 0 ;
        }

        const meal = new Meal(name.value, calories.value*1);
        this._tracker.addMeal(meal);

        name.value = "";
        calories.value = "";
    }

    _newWorkout(evt){
        evt.preventDefault();
        const name = document.getElementById("workout-name");
        const calories = document.getElementById("workout-calories");

        //    validation
        if(name.value === "" || calories.value === ""){
            alert("All input must be filled");
            return 0 ;
        }

        const workout = new Workout(name.value, calories.value*1);
        this._tracker.addWorkout(workout);

        name.value = "";
        calories.value = "";
    }
}

const app = new App();
