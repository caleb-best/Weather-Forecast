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
    })

}


