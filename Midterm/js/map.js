// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/laborinthdata.csv";
let markers = L.featureGroup();
let povertyMarkers = L.featureGroup(); 
let csvdata;

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			// put the data in a global variable
			csvdata = data;

			// map the data for the given date
			mapCSV();
		}
	});
}


function mapCSV(){

	// clear layers in case you are calling this function more than once
	markers.clearLayers();

	// loop through each entry
	csvdata.data.forEach(function(item,index){
		if(item.OverallFairLabor != undefined){
			// circle options
			 let circleOptions = {
				radius: item.OverallFairLabor*2,　// call a function to determine radius size
				weight: 1,
				color: 'white',
				fillColor: 'navy',
				fillOpacity: 0.5
			}
			let marker = L.circleMarker([item.Latitude,item.Longitude], circleOptions)
			.on('mouseover',function(){
				this.bindPopup(`${item['Country']} <br> Labor Indicators Score: ${item['OverallFairLabor']}`).openPopup()
			}) // show data on hover
			markers.addLayer(marker)	
		}
        
        if(item.ExtremePoor != undefined){
            let Pmarker = L.marker([item.Latitude, item.Longitude])
            .on('click', function(){
                this.bindPopup(`${item['Country']} <br> Extreme Poverty Rate: ${item['ExtremePoor']} <br> Moderate Poverty Rate: ${item['ModeratePoor']} <br> Near Poverty Rate: ${item['NearPoor']}`).openPopup()
            })
            povertyMarkers.addLayer(Pmarker)
        } 
	});

	markers.addTo(map)
    povertyMarkers.addTo(map)

    let layers = {
        "Working Poverty": povertyMarkers,
        "Fair Labor": markers
    }

    L.control.layers(null,layers).addTo(map)

	map.fitBounds(markers.getBounds())
}

