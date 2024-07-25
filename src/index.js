// GLOBAL VARIABLES
const restaurantMenu = document.getElementById('restaurant-menu')

// use let because the value will change
let currentlyDisplayedFoodId;

// Items in Cart variable, use let because the variable will not have an initial value at start 
let foodsArray;

fetch('http://localhost:3000/foods')
.then(response => response.json())
.then(foods => {
    // grab first food of foods and send to displayFoodDetails to update detail image
    displayFoodDetails(foods[0])
    
    foodsArray = foods;
    // console.log(foodsArray)

    foods.forEach(food => {
        addFoodImageToRestaurantMenu(food)
        
    })
})

function addFoodImageToRestaurantMenu(food){
    const imgElement = document.createElement('img')
    imgElement.src = food.image
    imgElement.addEventListener('mouseover', () => {
        displayFoodDetails(food)
        
    })
    // REMOVE the img element in response to click event
    imgElement.addEventListener("click", () =>{
        // optimistic remove element approach
        // imgElement.remove();
        // // how do we get info for delete request?
        // fetch(`http://localhost:3000/${food.id}`, {
        //     method: "DELETE"
        // })

        // PESSIMISTIC APPROACH
        // imgElement.remove();
        // how do we get info for delete request?
        fetch(`http://localhost:3000/foods/${food.id}`, {
            method: "DELETE"
        })
        .then(response => {
            if(response.ok) {
                // update array
                foodsArray = foodsArray.filter(f => {
                    // we only want the array to include food that exits
                    return food.id !== f.id
                })

                console.log(foodsArray)
                // imgElement.remove()
                renderRestarauntMenuImages()
            } else {
                alert(`ERROR: unable to delete food ${food.id}`)
            }
        })

    })
    restaurantMenu.appendChild(imgElement)
}

function displayFoodDetails(food){
    // update ID here
    currentlyDisplayedFoodId = food.id
    console.log(currentlyDisplayedFoodId)
    const foodDetailImageElement = document.getElementsByClassName('detail-image')[0]
    foodDetailImageElement.src = food.image
    const foodNameElement = document.getElementsByClassName('name')[0]
    foodNameElement.textContent = food.name
    const foodDescriptionDisplayElement = document.getElementById('description-display')
    foodDescriptionDisplayElement.textContent = food.description
    const numberInCartCountElement = document.getElementById('number-in-cart-count')
    numberInCartCountElement.textContent = food.number_in_cart
}

// rerender menu. modular and can be applied to patch and delete 
function renderRestarauntMenuImages() {
    // Clear menu after post is successful
        restaurantMenu.innerHTML = ""
    foodsArray.forEach(food => {
        

        addFoodImageToRestaurantMenu(food)
        
    })
}

const newFoodForm = document.getElementById('new-food')
newFoodForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const newNameInputElement = document.getElementById('new-name')
    const newImageInputElement = document.getElementById('new-image')
    const newDescriptionInputElement = document.getElementById('new-description')

    const newFood = {
        name: newNameInputElement.value,
        image: newImageInputElement.value,
        description: newDescriptionInputElement.value
    }

    fetch('http://localhost:3000/foods', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        // non destructive update, update number in cart key and value. Makes a copy, doesn't change originial object.
        body: JSON.stringify({...newFood, number_in_cart: 0})
    })
    .then(response => {
        // check for good response
        if(response.ok){
            response.json().then(newFoodData => {
                // push new food object to foodsArray
                foodsArray.push(newFoodData)
                
                // addFoodImageToRestaurantMenu(newFoodData)

                renderRestarauntMenuImages()

                

                // re render menu from updated foodsArray 
                // foodsArray.forEach(food => {
                //     addFoodImageToRestaurantMenu(food)
                    
                // })


            })
        }
        else{
            alert("Error: Unable to add new food!")
        }
    })

    // console.log(foodsArray)

    newFoodForm.reset()
})

const addToCartForm = document.getElementById('add-to-cart-form')
addToCartForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const numberToAddInputElement = document.getElementById('number-to-add')
    const numberInCartCountElement = document.getElementById('number-in-cart-count')
    const sum = Number(numberInCartCountElement.textContent) + Number(numberToAddInputElement.value)
    numberInCartCountElement.textContent = sum
    
    // OPTIMISTIC RENDERING APPROACH
    // we want to send sum to server, since it will be updated with form submission
    // console.log(sum)
     // how do we identify the correct food? Get the id from displayFoodDetails
    // fetch(`http://localhost:3000/foods/${currentlyDisplayedFoodId}`, {
    //     method: "PATCH",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     // specify number in cart is being updated, and the value of sum from above 
    //     body: JSON.stringify({number_in_cart: sum})
    // })
    
    // PESSIMISTIC APPROACH TO RENDERING AFTER SUCCESFULL PATCH REQUEST
    fetch(`http://localhost:3000/foods/${currentlyDisplayedFoodId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        // specify number in cart is being updated, and the value of sum from above 
        body: JSON.stringify({number_in_cart: sum})
    })
    .then(response =>{ 
        if (response.ok) {
        response.json().then(updatedFood => {
            numberInCartCountElement.textContent = updatedFood.number_in_cart

            // update array
            foodsArray = foodsArray.map(food => {
                // if food array id matches updated food id, then return updated food
                if (food.id === updatedFood.id) {
                    return updatedFood
                } else {
                    return food
                }
                
                
            })
            // invoke resetRestarauntMenuImages to add new menu with updated count
            renderRestarauntMenuImages()
            console.log(foodsArray)
        });
        } else {
            alert(`Error: unable to update ${currentlyDisplayedFoodId}`)
        }
    })
    


    addToCartForm.reset()
})