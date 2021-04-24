//Global Elements to DOM
const searchList = $('#cityList');
const searchInput = $('#citySearch');
const searchBtn = $('#citySearchBtn');
const clearSearch = $('#clearHist');

const mainWeathEl = $('#mainWeath')
const cityName = $('#mainName');
const cityDate = $('#cityDate')
const cityTemp = $('#mainTemp');
const cityHumid = $('#mainHumid');
const cityWind = $('#mainWind');
const cityUV = $('#mainUV');
//API key
const key = '4529e17e22e457ac065d45b98973fed0';

//momentJS format
let currentDay = moment().format('L');
cityDate.text('('+ currentDay +')');

//on submit call these functions
$(document).on('submit', function(){
    document.preventDefault();
    const inputVal = searchInput.val().trim();
    getWeather(inputVal)
    searchHistory(inputVal)
    searchInput.val('')

});
//on click call these functions
searchBtn.on('click', (event) => {
    event.preventDefault();
    let inputVal = searchInput.val().trim();
    getWeather(inputVal);
    searchHistory(inputVal);
    searchInput.val('')
    const parentRow = $('#fiveParent');
    parentRow.removeClass('hide')

})

//function to get weather API's
function getWeather(inputVal){
    //Current day API link
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputVal + "&units=metric&appid=" + key;

    $.ajax({
        url: apiURL,
        method: 'GET'
    }).then( (response) => {
        console.log(response)
        //Connected data from API to DOM
        cityName.text(response.name);
        $('#cityDate').text('('+ currentDay +')');
        cityName.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        cityTemp.text(response.main.temp + '°C');
        cityHumid.text(response.main.humidity + '%');
        cityWind.text(response.wind.speed + 'Km/h')
        

        const lat = response.coord.lat
        const lon = response.coord.lon
        
        //UV Index API
        const uvLink = 'https://api.openweathermap.org/data/2.5/uvi?&lat=' + lat + "&lon=" + lon + "&appid=" + key;
        console.log(uvLink);
        $.ajax({
            url: uvLink,
            method: 'GET'
        }).then( (response) => {
            cityUV.text(response.value);
            //Change bgc of UV Index based off severity
            if (response.value >= 5){
                cityUV.addClass('medUV');
            }
            if (response.value >= 7) {
                cityUV.addClass('highUV');
            }
            if (response.value >= 10) {
                cityUV.addClass('veryhiUV');
            }
            if (response.value >= 11) {
                cityUV.addClass('extremeUV');
            }
            else {
                cityUV.addClass('lowUV');
            }
        });
        //Five Day API
        const fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=" + key + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: fiveDayURL,
            method: 'GET'
        }).then((response) => {
            console.log(response);
            //Empty the container
            $('#fiveDay').empty();
            //loop through api to get 5 day and data
            for (var i = 1; i < response.list.length; i += 8) {
                //date
                let fiveDate = moment(response.list[i].dt_txt).format('L')
                console.log(fiveDate);
                //html structure
                const fiveCol = $("<div class='col-2 justify-content-center '>");
                const fiveCard = $("<div class='card'>");
                const fiveCardBody = $("<div class='card-body'>")
                const fiveDay = $("<h5 class='card-title'>");
                const fiveIcon = $("<img>");
                const fiveTemp = $("<p class='card-text'>");
                const fiveHumid = $("<p class='card-text'>")
                //append data to DOM
                $('#fiveDay').append(fiveCol);
                fiveCol.append(fiveCard);
                fiveCard.append(fiveCardBody);

                fiveCardBody.append(fiveDay);
                fiveCardBody.append(fiveIcon);
                fiveCardBody.append(fiveTemp);
                fiveCardBody.append(fiveHumid);

                fiveIcon.attr('src', 'https://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png');
                fiveIcon.attr('alt', response.list[i].weather[0].main);
                fiveDay.text(fiveDate);
                fiveTemp.text(response.list[i].main.temp + '°C');
                fiveTemp.prepend('Temp: ')
                fiveHumid.text(response.list[i].main.humidity + '%');
                fiveHumid.prepend('Humidity: ');

            }

        })


        })

}

//Local Storage array
let cityResult = [];
//Clear search results and Local Storage
clearSearch.on('click', () => {
    cityResult = [];
    prevSearch();
    $(this).addClass("hide");
});

//on click go to this city
searchList.on('click', "li.hist-btn", (event) => {
    event.preventDefault();
    let value = $(this).data("data-value");
    getWeather(value);
    searchHistory(value)
})

function searchHistory(inputVal) {
    if (inputVal) {
        if (cityResult.indexOf(inputVal) === -1) {
            cityResult.push(inputVal);
            prevSearch();
            clearSearch.removeClass("hide")

        }
        else {
            let removeIndex = cityResult.indexOf(inputVal);
            cityResult.splice(removeIndex, 1)
            cityResult.push(inputVal)

            prevSearch();
            
            clearSearch.removeClass("hide")
        }
    }
}

//create html structure and store search to Local Storage
function prevSearch() {
    searchList.empty();
    cityResult.forEach(function (city) {
        let histBtn = $('<li class="list-group-item hist-btn border">');
        histBtn.attr("data-value", city); 
        histBtn.text(city);
        searchList.append(histBtn);
    });
    localStorage.setItem("history", JSON.stringify(cityResult))
 
}

//Get array from local storage
function loadHist() {
    if (localStorage.getItem("history")) {
        cityResult = JSON.parse(localStorage.getItem("history"));
        let lastIndex = cityResult.length - 1;
       
        prevSearch();
        if (cityResult.length !== 0) {
            getWeather(cityResult[lastIndex]);  
        }
    }
}

