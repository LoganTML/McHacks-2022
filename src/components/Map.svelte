<script>
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";

    import MarkerPopup from './MarkerPopup.svelte';
    import * as markerIcons from './markers.js';
	  import MapToolbar from './MapToolbar.svelte';

    // export let currentPos;
    export let joinFct;
    export let userProfile;
    let map;
    let eye = true;

    // const initialView = [currentlat, currentlong];

    /*
        Create circle around user of radius
        Populate map with markers
        Markers are clickable, pop up with join button
        Calculates whether button is within radius or not (math)
        Button is grayed out if outside radius, normal if within
        Clicking button joins room
    */

    const Url = `https://aroom-api-by2blb6v2q-ue.a.run.app/api/rooms/test`;

    const otherPram = {
        headers: {
            "content-type": "application/json;"
        },
        method: "POST"
    };

    // async function getData(){
    //   let rooms = await fetch(Url, otherPram){

      
    
    // }

    // markerLocations: array of all marker coordinates

	// console.log(userProfile);

    const userPosition = [userProfile.lat, userProfile.long];
	
	function createMap(container) {
	  let m = L.map(container, {preferCanvas: true }).setView(userPosition, 14);
      L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ", {
      maxZoom: 18
    }).addTo(m);

    return m;
  }
    
    

    //Coordinates, number of rooms, ids
    
     
    
    // console.log(rooms);
    //Copies the lat and long of each room to markerLocations
    /*rooms.forEach(room => {
        markerLocations.push([room.lat, room.long]);
        console.log(`id: ${room.id}, lat: ${room.lat}, long: ${room.long}`);  
      });*/

      //iterates through markerLocations,
    /*for(let location of markerLocations) {
        let m = createMarker(location);
        markerLayers.addLayer(m);


        //i++;  
    }*/

    let toolbar = L.control({ position: 'topright' });
	let toolbarComponent;
	toolbar.onAdd = (map) => {
		let div = L.DomUtil.create('div');
		toolbarComponent = new MapToolbar({
			target: div,
			props: {}
		});

		toolbarComponent.$on('click-eye', ({ detail }) => eye = detail);
		toolbarComponent.$on('click-lines', ({ detail }) => lines = detail);
		toolbarComponent.$on('click-reset', () => {
			map.setView(initialView, 5, { animate: true })
		})

		return div;
	}

	toolbar.onRemove = () => {
		if(toolbarComponent) {
			toolbarComponent.$destroy();
			toolbarComponent = null;
		}
	};

    function bindPopup(marker, createFn) {
		let popupComponent;
		marker.bindPopup(() => {
			let container = L.DomUtil.create('div');
			popupComponent = createFn(container);
			return container;
		});

		marker.on('popupclose', () => {
			if(popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				// Wait to destroy until after the fadeout completes.
				setTimeout(() => {
					old.$destroy();
				}, 500);

			}
		});
	}

    let markers = new Map();
	
	function markerIcon(count) {
		let html = `<div class="map-marker"><div>${markerIcons.library}</div><div class="marker-text">${count}</div></div>`;
		return L.divIcon({
			html,
			className: 'map-marker'
		});
	}
    
    let i = 0;
    function createMarker(loc, roomid) {
		  let count = ++i;
		  let icon = markerIcon(count);
		  let marker = L.marker(loc, {icon});
		  bindPopup(marker, (m) => {
			  let c = new MarkerPopup({
				  target: m,
				  props: {
					  count,
            joinFct,
					  roomid
				  }
			  });
			
			c.$on('change', ({detail}) => {
				count = detail;
				marker.setIcon(markerIcon(count));
			});
			
			return c;
		});
		
		return marker;
	}	

	let markerLayers;
    function mapAction(container) {
        map = createMap(container); 
		toolbar.addTo(map);
		
		markerLayers = L.layerGroup()
      
    fetch(Url, otherPram)
      .then(rooms => rooms.json())
      .then(rooms => {
       
        for(const room of rooms.rooms ){
          let m = createMarker([room.lat, room.long], room.id);

          markerLayers.addLayer(m);
        }
      });
		  
      /*
 		for(let location of markerLocations) {
 			let m = createMarker(location);
			markerLayers.addLayer(m);
 		}*/
		
		markerLayers.addTo(map);
		
    return {
       destroy: () => {
                toolbar.remove();
				map.remove();
				map = null;
			 }
    };
	}
    

    $: if(markerLayers && map) {
		if(eye) {
			markerLayers.addTo(map);
		} else {
			markerLayers.remove();
		}
	}
	
	// $: if(lineLayers && map) {
	// 	if(lines) {
	// 		lineLayers.addTo(map);
	// 	} else {
	// 		lineLayers.remove();
	// 	}
	// }

	function resizeMap() {
	  if(map) { map.invalidateSize(); }
  }





  // L.marker([50.5, 30.5]).addTo(map);

</script>

<!-- 
<Map lat={35} lon={-84} zoom={3.5}>
    <MapMarker lat={37.8225} lon={-122.0024} label="Svelte Body Shaping"/>
    <MapMarker lat={33.8981} lon={-118.4169} label="Svelte Barbershop & Essentials"/>
    <MapMarker lat={29.7230} lon={-95.4189} label="Svelte Waxing Studio"/>
    <MapMarker lat={28.3378} lon={-81.3966} label="Svelte 30 Nutritional Consultants"/>
    <MapMarker lat={40.6483} lon={-74.0237} label="Svelte Brands LLC"/>
    <MapMarker lat={40.6986} lon={-74.4100} label="Svelte Medical Systems"/>
</Map>


-->

<div id="map" style="height:100%;width:100%" use:mapAction />

<svelte:window on:resize={resizeMap} />

<style>
	#map :global(.marker-text) {
		width:100%;
		text-align:center;
		font-weight:600;
		background-color:#444;
		color:#EEE;
		border-radius:0.5rem;
	}
	
	#map :global(.map-marker) {
		width:30px;
		transform:translateX(-50%) translateY(-25%);
	}
</style>

<!-- <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
-->