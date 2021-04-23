const searchList = $('#cityList');
const searchInput = $('#citySearch');
const searchBtn = $('#citySearchBtn');
const clearSearch = $('#clearHist');

const mainWeathEl = $('#mainWeath')
const cityName = $('#mainName');
const cityTemp = $('#mainTemp');
const cityHumid = $('#mainHumid');
const cityUV = $('#mainUV');

const key = '4529e17e22e457ac065d45b98973fed0';

let currentDay = moment().format('L');
cityName.text('('+ currentDay +')');

$(document).on('submit', function(){
    event.preventDefault();
    let inputVal = searchInput.val().trim();
    
    //initialize functions
    getWeather(inputVal)
    //clear input value
    searchInput.val('')
})



function getWeather(inputVal){

}


