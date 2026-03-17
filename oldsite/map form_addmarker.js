

const addmarker = document.querySelector('#addmarker');
var marker_lat = document.querySelector('#lat');
var marker_long = document.querySelector('#long');
var marker_title = document.querySelector('#title');
var marker_des = document.querySelector('#description');
var markerCount = document.querySelector('.markerCount');
var errorbox = document.querySelector('.errorbox');
var stats = document.querySelector('.left ol');
var marker_lat_main = document.querySelector('#lat-main');
var marker_long_main = document.querySelector('#long-main');
var marker_zoom = document.querySelector('#zoom');
var generate = document.querySelector('#sbmt');



//holds all markers
var markers = [];
var m_count = 0;
//adds the current marker to the array 

function check_errors0(){
    let float_lat = +marker_lat_main.value;
    let float_long = +marker_long_main.value;
    let bool_lat = false;
    let bool_long = false;
    if((float_lat >= -90 && float_lat <= 90)){
        marker_lat_main.setAttribute("disabled", "true");
        bool_lat = true;
        marker_lat_main.style.border = "1px solid #c4c4c4";

    }else{
        errorbox.style.display = "block";
        errorbox.innerHTML = "Invalid Latitude Value";
        marker_lat_main.placeholder = "Add a valid latitude";
        marker_lat_main.style.border = "1px solid red";
    }
    if((float_long >= -180 && float_long <= 180)){
        marker_long_main.setAttribute("disabled", "true");
        bool_long = true;
        marker_long_main.style.border = "1px solid #c4c4c4";
    }else{
        errorbox.style.display = "block";
        errorbox.innerHTML = "Invalid Longitude Value";
        marker_long_main.placeholder = "Add a valid longitude";
        marker_long_main.style.border = "1px solid red";
    }

    marker_zoom.setAttribute("disabled", "true");
    return (bool_lat && bool_long);
    
}

function check_errors1(){
    if(marker_lat_main.value == "" || marker_long_main.value == ""
    || marker_zoom.value == ""){
        marker_lat_main.placeholder = "latitude value is required";
        marker_long_main.placeholder = "longitude value is required";
        errorbox.style.display = "block";
        errorbox.innerHTML = "Please enter values in all required fields";
        return false;
    }
    return check_errors0();
}

function check_errors2(){
    if(marker_lat.value == "" || marker_long.value == ""){
        marker_lat.placeholder = "latitude value is required";
        marker_long.placeholder = "longitude value is required";
        errorbox.style.display = "block";
        errorbox.innerHTML = "Please enter values in all required fields";
        return false;
    }
    marker_lat.placeholder = "latitude";
    marker_long.placeholder = "longitude";
    return check_errors3();
    
}
function check_errors3(){
    let float_lat = +marker_lat.value;
    let float_long = +marker_long.value;
    let bool_lat = false;
    let bool_long = false;
    if((float_lat >= -90 && float_lat <= 90)){
        marker_lat.style.border = "1px solid #c4c4c4";
        bool_lat = true;
    }else{
        errorbox.style.display = "block";
        errorbox.innerHTML = "Invalid Latitude Value";
        marker_lat.placeholder = "Add a valid latitude";
        marker_lat.style.border = "1px solid red";
    }
    if((float_long >= -180 && float_long <= 180)){
        marker_long.style.border = "1px solid #c4c4c4";
        bool_long = true;
    }else{
        errorbox.style.display = "block";
        errorbox.innerHTML = "Invalid Longitude Value";
        marker_long.placeholder = "Add a valid longitude";
        marker_long.style.border = "1px solid red";
    }
    return (bool_lat && bool_long);   
}
generate.onclick = function(evt){
    if(m_count == 0){
        errorbox.style.display = "block";
        errorbox.innerHTML = "Please add at least one marker";
    }else{
        let initialCoord = {
            lat_main: marker_lat_main.value,
            long_main: marker_long_main.value,
            zoom: marker_zoom.value
        }
        localStorage.setItem('MapInitialCoord', JSON.stringify(initialCoord));
        window.location.href = "./map.html";
    }
}
addmarker.onclick = function(evt){

    evt.preventDefault();
    var result1 = check_errors1();
    var result2 = check_errors2();
    if (result1 && result2){
        errorbox.innerHTML = "";
        let marker = {
            lat: marker_lat.value,
            long: marker_long.value,
            title: marker_title.value,
            description: marker_des.value
        }
        markers.push(marker);
        //reset all value fields
        marker_lat.value = "";
        marker_long.value= "";
        marker_title.value= "";
        marker_des.value= "";

        m_count = m_count + 1;
        generate.disabled = false;
        markerCount.style.display = "block";
        markerCount.querySelector('span').innerHTML = m_count;
        localStorage.setItem('MarkersList', JSON.stringify(markers));
        printMarkers();
    }
    
}

function printMarkers(){
    var htmlString = markers.map((one) => {
        return `
        <li>
             latitude = ${one.lat}, longitude = ${one.long}

        </li>
        `;


    }).join('');
    stats.innerHTML = htmlString;
}