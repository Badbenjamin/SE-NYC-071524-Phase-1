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
    imgElement.addEventListener('mouseover', () => {
        displayFoodDetails(food)
    })

    imgElement.addEventListener('click', () => {

        imgElement.remove()

        fetch(`http://localhost:3000/foods/${currentlyDisplayedFood.id}`, {
            method: "DELETE"
        })
    })

    restaurantMenu.appendChild(imgElement)
}

function displayFoodDetails(food){
    currentlyDisplayedFood = food
    const foodDetailImageElement = document.getElementsByClassName('detail-image')[0]
    foodDetailImageElement.src = food.image
    const foodNameElement = document.getElementsByClassName('name')[0]
    foodNameElement.textContent = food.name
    const foodDescriptionDisplayElement = document.getElementById('description-display')
    foodDescriptionDisplayElement.textContent = food.description
}

// acces ul element where crypto data ill be displayed (in li element)
const cryptocurrencyList = document.getElementById('cryptocurrency-list')
// access <select> element to determine which CCs appear on page
const cryptoCurrencyFilterElement = document.getElementById("cryptocurrency-filter")

// GET FROM API
fetch("https://api.coincap.io/v2/assets")
.then(response => {
    if (response.ok) {
        response.json().then(apiDataObject => {
            // FOR EACH EXAMPLE
            // apiDataObject.data.forEach(cryptocurrency => {
                // console.log(cryptocurrency)
                // const liElement = document.createElement("li")
                // liElement.textContent = `${cryptocurrency.name} (${cryptocurrency.symbol}): rank ${cryptocurrency.rank}`
                // cryptocurrencyList.appendChild(liElement)
            // })
            // FILTER METHOD to get top ten CCs and store in variable
            //  const topTenCryptocurrencies = apiDataObject.data.filter(cryptocurrency => {
            //    return Number(cryptocurrency.rank) <= 10;
            
            console.log(apiDataObject.data)
            displayCryptocurrencyData(apiDataObject.data)
            cryptoCurrencyFilterElement.addEventListener("change", () => {
                displayCryptocurrencyData(apiDataObject.data)
            })
        })
        // use forEach to iterate trhough top ten CCs and add them to list
        // topTenCryptocurrencies.forEach(addCryptocurrencyToList)
    // })
    } else {
        alert("error")
    }
})

// ADD crypto to list
function addCryptocurrencyToList (cryptocurrency) {
    const liElement = document.createElement("li")
    liElement.textContent = `${cryptocurrency.name} (${cryptocurrency.symbol}): rank ${cryptocurrency.rank}`
    cryptocurrencyList.appendChild(liElement)
}

function displayCryptocurrencyData (cryptocurrencies) {
    // empty list before repopulating
    cryptocurrencyList.innerHTML = ""

    if (cryptoCurrencyFilterElement.value === "all") {
        cryptocurrencies.forEach(addCryptocurrencyToList)
    } else if (cryptoCurrencyFilterElement.value === "less_than") {
        cryptocurrencies.forEach(cryptocurrency => {
            if((Number(cryptocurrency.rank)) <= 50) {
                addCryptocurrencyToList(cryptocurrency)
            }
        })
    }
    else if (cryptoCurrencyFilterElement.value === "greater_than") {
        cryptocurrencies.forEach(cryptocurrency => {
            if((Number(cryptocurrency.rank)) > 50) {
                addCryptocurrencyToList(cryptocurrency)
            }
        })
    }
    // console.log(cryptoCurrencyFilterElement.value)
    // console.log(cryptocurrencies)
}