const restaurantMenu = document.getElementById('restaurant-menu')

// use let because the value will change
let currentlyDisplayedFoodId;

fetch('http://localhost:3000/foods')
.then(response => response.json())
.then(foods => {
    displayFoodDetails(foods[0])
    // console.log(foods)
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
                imgElement.remove()
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
                addFoodImageToRestaurantMenu(newFoodData)
            })
        }
        else{
            alert("Error: Unable to add new food!")
        }
    })

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
        response.json().then(updatedFood => numberInCartCountElement.textContent = updatedFood.number_in_cart);
        } else {
            alert(`Error: unable to update ${currentlyDisplayedFoodId}`)
        }
    })
    


    addToCartForm.reset()
})