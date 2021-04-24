const searchList = $('#cityList');
const searchInput = $('#citySearch');
const searchBtn = $('#citySearchBtn');
const clearSearch = $('#clearHist');

const mainWeathEl = $('#mainWeath')
const cityName = $('#mainName');
const cityTemp = $('#mainTemp');
const cityHumid = $('#mainHumid');
const cityWind = $('#mainWind');
const cityUV = $('#mainUV');

const key = '4529e17e22e457ac065d45b98973fed0';

let currentDay = moment().format('L');
cityName.text('('+ currentDay +')');

$(document).on('submit', function(){
    document.preventDefault();
    let inputVal = searchInput.val().trim();
    
    //initialize functions
    getWeather(inputVal)
    searchInput.val('')
});

searchBtn.on('click', (event) => {
    event.preventDefault();
    let inputVal = searchInput.val().trim();
    getWeather(inputVal)
    searchInput.val('')

})


function getWeather(inputVal){
    
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputVal + "&units=metric&appid=" + key;

    $.ajax({
        url: apiURL,
        method: 'GET'
    }).then( (response) => {
        console.log(response)

        cityName.text(response.name);
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

                const fiveCol = $("<div class='col-12 mb-3'>");
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


