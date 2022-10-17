async function fetchData() {
    return (await fetch('./coordinatesData.json')).json();
}
document.addEventListener("DOMContentLoaded", async ()=>{
    const content = document.querySelector('.popup-content');
    const container = document.querySelector('#popup');
    
    var loadJsonFile = [];
    
    try {
        loadJsonFile = await fetchData();
    } catch (err) {
        console.log('Error!');
        console.log(err);
    }

    var getJsonMarkers = loadJsonFile.markers;
    var getJsonInitCoord = loadJsonFile.viewport;
    
    const mapViewLat = +getJsonInitCoord.lat_main;
    const mapViewLong = +getJsonInitCoord.long_main;
    const mapViewZoom = +getJsonInitCoord.zoom;
    
    
    var allLongLat = [...getJsonMarkers].map((one)=>{
        return [
            +one.long,
            +one.lat
        ]
    });
    
    var contentData = [...getJsonMarkers].map((one)=>{
        if (one.title == ""){
            one.title = "No Title Added";
        }
        if(one.description == ""){
            one.description = "No Description Added";
        }
        return [
            one.title,
            one.description
        ]
    })
    
    var precisionArray = [...allLongLat].map(function (item){
        return [
            Number(item[0].toFixed(5)),
            Number(item[1].toFixed(5))
        ]
    });
    
    //map begins
    const overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
                duration: 250,
            },
    });
    
    
    
    
    //create map
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        overlays: [overlay],
        view: new ol.View({
            center: ol.proj.fromLonLat([mapViewLong, mapViewLat]),
            zoom: mapViewZoom
        })
    })
    //add zoom slider
    const zoomslider = new ol.control.ZoomSlider();
    map.addControl(zoomslider);
    
    // hover action on map
    map.on('pointermove', function(evt){
        var feature = map.getFeaturesAtPixel(evt.pixel)[0];
        
        if (feature){
            this.getTargetElement().style.cursor = 'pointer';
            const coordinate = feature.getGeometry().getCoordinates();
                var plotat = coordinate;
                coord = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
                getContents(coord);           
                var long = coord[0];
                var lat = coord[1];          
                overlay.setPosition(plotat);           
            }
            else{
                this.getTargetElement().style.cursor = '';
            }
    });
    
    map.on('click', function(evt){
        overlay.setPosition(undefined);
        content.innerHTML = '';
    })
    
    //search for the coordinate and extract marker's information on that coordinate
    function getContents(coord){
        var long = Number(coord[0].toFixed(5))
        var lat = Number(coord[1].toFixed(5))
        var found = false
        var getIndex = -1;
        for(var y=0; y<precisionArray.length; y++){   
            if(long == precisionArray[y][0] && lat == precisionArray[y][1]){
            getIndex = y
            found = true
        }
    }
        if(found){
        content.innerHTML = `
        <h3> ${contentData[getIndex][0]} </h3>
        ${contentData[getIndex][1]}
        `
        }else{
            content.innerHTML = `Failed to load data`
        }
    };
    
    // add all markers
    var markers = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'marker.png'
        })
        })
    });
    
    map.addLayer(markers);
    
    function createAllMarkers(allLongLat){
        for(var i=0; i<allLongLat.length; i++){
            // create marker
            let currentMarker = new ol.Feature(
                new ol.geom.Point(
                    ol.proj.fromLonLat(allLongLat[i])
                )
            );
            markers.getSource().addFeature(currentMarker);
        }
    };
    
    createAllMarkers(allLongLat);
   
})



 
    


