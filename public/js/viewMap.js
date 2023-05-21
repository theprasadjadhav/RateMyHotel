mapboxgl.accessToken = mapbox_token;

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: hotel.geometry.coordinates, 
    zoom: 13, 
});


const hotelMarker = new mapboxgl.Marker()
    .setLngLat(hotel.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup()
        .setHTML(hotel.properties.popUpMarkUp)
    )
    .addTo(map);