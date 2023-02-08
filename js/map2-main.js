// Map 2 main.js

mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/dark-v10',
            projection:'albers',
            zoom: 3, // starting zoom
            minZoom: 1, // minimum zoom level of the map
            center: [-103, 40] // starting center 40.06429548551, -103.93031631416527
        });
        const grades = [8000, 16000, 24000, 32000, 40000],
        //const cases = [2, 4, 6, 8, 10],
            colors = ['rgb(255, 249, 207)','rgb(184, 242, 212)','rgb(117, 219, 219)', 'rgb(86, 147, 246)', 'rgb(35, 12, 99)'],
            radii = [4, 10, 16, 22, 28];
        //load data to the map as new layers.
        //map.on('load', function loadingData() {
        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
            // when loading a geojson, there are two steps
            // add a source of the data and then add the layer out of the source
            map.addSource('us-covid-2020-counts', {
                type: 'geojson',
                data: 'asset/us-covid-2020-counts.json'
            });
            map.addLayer({
                'id': 'covid-counts',
                'type': 'circle',
                'source': 'us-covid-2020-counts',
                'minzoom': 2,
                'paint': {
                    // increase the radii of the circle as counts value increases
                    'circle-radius': {
                        //'property': 'mag',
                        'property': 'cases',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]],
                            [grades[3], radii[3]],
                            [grades[4], radii[4]],
                        ]
                    },
                    // change the color of the circle as counts value increases
                    'circle-color': {
                        //'property': 'mag',
                        'property': 'cases',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]],
                            [grades[3], colors[3]],
                            [grades[4], colors[4]],
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            });
            // click on tree to view magnitude in a popup
            map.on('click', 'covid-counts', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>COVID-19 Counts:</strong> ${event.features[0].properties.cases}`)
                    .addTo(map);
            });
        });
        // create legend
        const legend = document.getElementById('legend');
        //set up legend grades and labels
        var labels = ['<strong>Number of Covid-19 Cases in 2020</strong>'],
            vbreak;
        //iterate through grades and create a scaled circle and label for each
        for (var i = 0; i < grades.length; i++) {
            vbreak = grades[i];
            // you need to manually adjust the radius of each dot on the legend 
            // in order to make sure the legend can be properly referred to the dot on the map.
            dot_radii = 2 * radii[i];
            labels.push(
                '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
                'px; height: ' +
                dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
                '</span></p>');
        }
        // add the data source
        const source =
            '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';
        // combine all the html codes.
        legend.innerHTML = labels.join('') + source;