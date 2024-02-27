
mapboxgl.accessToken = mapToken;

let coordinates = listing.geometry.coordinates;

if (coordinates && coordinates.length <= 0) {
  coordinates = [78.9629, 20.5937];
}


const map = new mapboxgl.Map({
container: "map", // container ID
style: "mapbox://styles/mapbox/streets-v12",
center: coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
});

console.log(coordinates);

 const marker = new mapboxgl.Marker({color: "red"})
 .setLngLat(coordinates) //listing.geometry.coordinates
 .setPopup(
   new mapboxgl.Popup({offset: 25 }).setHTML (
    `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`
   )
 )
 .addTo(map);

