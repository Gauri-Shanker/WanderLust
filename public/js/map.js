mapboxgl.accessToken = MAP_PUBLIC_TOKEN;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listingvalues.geometry.coordinates, 
    style: 'mapbox://styles/mapbox/dark-v11',
    // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

console.log(listingvalues);
const marker1 = new mapboxgl.Marker({ color: "#fe424d" })
    .setLngLat(listingvalues.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listingvalues.title}</h4><p>This is a Nice Place</p>`
    ))
    .addTo(map);