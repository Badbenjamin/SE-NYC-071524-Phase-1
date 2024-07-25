const restaurantMenu = document.getElementById('restaurant-menu')

fetch('http://localhost:3000/foods')
.then(response => response.json())
.then(foods => {
    displayFoodDetails(foods[0])
   
    foods.forEach(food => {
        addFoodImageToRestaurantMenu(food)
    })
})

function addFoodImageToRestaurantMenu(food){
    const imgElement = document.createElement('img')
    imgElement.src = food.image
    imgElement.addEventListener('click', () => {
        displayFoodDetails(food)
    })
    restaurantMenu.appendChild(imgElement)
}

function displayFoodDetails(food){
    const foodDetailImageElement = document.getElementsByClassName('detail-image')[0]
    foodDetailImageElement.src = food.image
    const foodNameElement = document.getElementsByClassName('name')[0]
    foodNameElement.textContent = food.name
    const foodDescriptionDisplayElement = document.getElementById('description-display')
    foodDescriptionDisplayElement.textContent = food.description
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
    // Optimistic Rendering Approach, render first, then make post request
    // addFoodImageToRestaurantMenu(newFood)

    // Optimistic
    // fetch("http://localhost:3000/foods", {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application.json"
    //     },
    //     body: JSON.stringify(newFood)
    // }) 
    // .then(response => response.json())
    // .then(newFood => console.log(newFood))

    // Pessimistic
    // fetch("http://localhost:3000/foods", {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application.json"
    //     },
    //     body: JSON.stringify(newFood)
    // }) 
    // .then(response => response.json())
    // .then(newFood => addFoodImageToRestaurantMenu(newFood))
    // .catch(error => console.log(error))

    // error handling
    fetch("http://localhost:3000/foods", {
        method: 'POST',
        headers: {
            "Content-Type": "application.json"
        },
        body: JSON.stringify(newFood)
    }) 
    .then(response => {
        if (response.ok) {
            response.json().then(newFood => addFoodImageToRestaurantMenu(newFood))
        } else {
            alert(`Error: ${response.status}: ${response.statusText}`)
        } 
    })
    
    
    

    

    newFoodForm.reset()
})