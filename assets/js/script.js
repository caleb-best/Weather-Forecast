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

const key = '4529e17e22e457ac065d45b98973fed0';

let currentDay = moment().format('L');
cityDate.text('('+ currentDay +')');

$(document).on('submit', function(){
    document.preventDefault();
    const inputVal = searchInput.val().trim();
    getWeather(inputVal)
    searchHistory(inputVal)
    searchInput.val('')

});

searchBtn.on('click', (event) => {
    event.preventDefault();
    let inputVal = searchInput.val().trim();
    getWeather(inputVal);
    searchHistory(inputVal);
    searchInput.val('')
    const parentRow = $('#fiveParent');
    parentRow.removeClass('hide')

})


function getWeather(inputVal){
    
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputVal + "&units=metric&appid=" + key;

    $.ajax({
        url: apiURL,
        method: 'GET'
    }).then( (response) => {
        console.log(response)

        cityName.text(response.name);
        $('#cityDate').text('('+ currentDay +')');
        cityName.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        cityTemp.text(response.main.temp + '°C');
        cityHumid.text(response.main.humidity + '%');
        cityWind.text(response.wind.speed + 'Km/h')
        

        const lat = response.coord.lat
        const lon = response.coord.lon

        const uvLink = 'https://api.openweathermap.org/data/2.5/uvi?&lat=' + lat + "&lon=" + lon + "&appid=" + key;
        console.log(uvLink);
        $.ajax({
            url: uvLink,
            method: 'GET'
        }).then( (response) => {
            cityUV.text(response.value);

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

        const fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=" + key + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: fiveDayURL,
            method: 'GET'
        }).then((response) => {
            console.log(response);

            $('#fiveDay').empty();

            for (var i = 1; i < response.list.length; i += 8) {

                let fiveDate = moment(response.list[i].dt_txt).format('L')
                console.log(fiveDate);

                const fiveCol = $("<div class='col-2 justify-content-center '>");
                const fiveCard = $("<div class='card'>");
                const fiveCardBody = $("<div class='card-body'>")
                const fiveDay = $("<h5 class='card-title'>");
                const fiveIcon = $("<img>");
                const fiveTemp = $("<p class='card-text'>");
                const fiveHumid = $("<p class='card-text'>")

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

let cityResult = [];

clearSearch.on('click', () => {
    cityResult = [];
    prevSearch();
    $(this).addClass("hide");
});

searchList.on('click', "li.hist-btn", (event) => {
    event.preventDefault();
    let value = $(this).data("value");
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

