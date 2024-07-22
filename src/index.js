// write your code here


// ASYNC AWAIT
// async function fetchTheData () {
//    const responseObject = await fetch("http://localhost:3000/foods");
//    console.log(await responseObject.json());
// } 
// fetchTheData();

const restaurantMenu = document.getElementById("restaurant-menu")

function addFoodImageToRestaurantMenu(food){
    // takes argument from foreach (food) from foods array returned from server, populates restarauntMenu with food pics
    const imgElement = document.createElement('img');
    imgElement.src = food.image;
    restaurantMenu.appendChild(imgElement)
    
    // event listener returns info on each different food image
    imgElement.addEventListener("click", () => {
        displayFoodDetails(food)
        console.log(food);
    })
}

// Display food details, activated by click event listener on restarauntMenu.
// recieves information from click event(which is applied to images), and maps returned data into description of food, and changes image.
function displayFoodDetails(food){
    const detailImageElement = document.querySelector(".detail-image");
    detailImageElement.src = food.image;

    const nameElement = document.querySelector('.name');
    nameElement.textContent = food.name;

    const descriptionDisplayElement = document.getElementById('description-display');
    descriptionDisplayElement.textContent = food.description;


}

// USING .THEN
const promiseObject = fetch("http://localhost:3000/foods")
.then((response) => response.json())
.then((foods) => {
    displayFoodDetails(foods[0]);
    // take data returned from p obj and iterate through,then pass as arg to function
    foods.forEach(addFoodImageToRestaurantMenu)
})



