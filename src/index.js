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
// access <select> element to determine which CCs appear on page. value from <option> tags contains our desired info
const cryptoCurrencyFilterElement = document.getElementById("cryptocurrency-filter")

// GET FROM API
fetch("https://api.coincap.io/v2/assets")
.then(response => {
    // error handling
    if (response.ok) {
        // return promise object form API and parse JSON, then use data
        response.json().then(apiDataObject => {
            
            // useful info is contained in data value of object
            console.log(apiDataObject.data)
            // invoke our function to display data on all data from object
            displayCryptocurrencyData(apiDataObject.data)
            // add an event listener that will listen for "change" event on our cryptocurrencyFilterElement
            cryptoCurrencyFilterElement.addEventListener("change", () => {
                // Event listener invokes displayCrypto... funciton, passes data array to function
                displayCryptocurrencyData(apiDataObject.data)
            })
        })
    } else {
        alert("error")
    }
})

// This function will add the cryptocurrency to the list
function addCryptocurrencyToList (cryptocurrency) {
    const liElement = document.createElement("li")
    liElement.textContent = `${cryptocurrency.name} (${cryptocurrency.symbol}): rank ${cryptocurrency.rank}`
    cryptocurrencyList.appendChild(liElement)
}

// cryptocurrencies argument is apiDataObject.data from GET request to API, also passed throug event listener
function displayCryptocurrencyData (cryptocurrencies) {
    // empty list before repopulating so that list is new each time
    cryptocurrencyList.innerHTML = ""
    // this is the value returned by our event listener on the <select> element, <option> elements 
    // are the dropdown options, and cryptoCurrencyFilterElement.value returns the selected value
    console.log(cryptoCurrencyFilterElement.value)
    // assign if statements to each returned value of our <select> dropdown
    if (cryptoCurrencyFilterElement.value === "all") {
        // if value === all, simply add each CC to the list
        cryptocurrencies.forEach(addCryptocurrencyToList)
    } else if (cryptoCurrencyFilterElement.value === "less_than") {
        // if value === "less_than", if cryptocurrency.rank (converted to num)
        // is less <= 50, send our passing cryptocurrencies to function to add to list
        cryptocurrencies.forEach(cryptocurrency => {
            if((Number(cryptocurrency.rank)) <= 50) {
                addCryptocurrencyToList(cryptocurrency)
            }
        })
    }
    else if (cryptoCurrencyFilterElement.value === "greater_than") {
        // if value === "greater_than", if cryptocurrency.rank (converted to num) > 50,
        // send to passing cryptocurrencies to our add to list function 
        cryptocurrencies.forEach(cryptocurrency => {
            if((Number(cryptocurrency.rank)) > 50) {
                addCryptocurrencyToList(cryptocurrency)
            }
        })
    }
    // console.log(cryptoCurrencyFilterElement.value)
    // console.log(cryptocurrencies)
}