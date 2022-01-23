<script>

    import { createEventDispatcher, onMount } from 'svelte'
    const dispatch = createEventDispatcher()
    
    export let muted;
    export let roomId;
    export let users;
    export let socket;
    export let theme;
    export let userProfile;

    const API_URL = 'aroom-api-by2blb6v2q-ue.a.run.app';
    const TIMEOUT = 1000;

    async function getGeolocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    onMount(async () => {

        // Get the user's location
        try {
            if (navigator.geolocation) {
                const position = await getGeolocation();
                userProfile.lat = position.coords.latitude;
                userProfile.long = position.coords.longitude;
                // navigator.geolocation.getCurrentPosition((position) => {
                //     userProfile.lat = position.coords.latitude;
                //     userProfile.long = position.coords.longitude;
                //     console.log(userProfile);
                // });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        } catch (error) {
            console.log(error)
        }

        // Setup the room id
        const Url = `https://${API_URL}/api/room/get?lat=${userProfile.lat}&long=${userProfile.long}`;

        // const Data = {
        //     lat: 45.5269654,
        //     long: -73.7119713
        // };

        const otherPram = {
            headers: {
                "content-type": "application/json;"
            },
            // body: Data,
            method: "POST"
        };

        if (roomId == null) {
            try {
                roomId = await fetch(Url, otherPram);
                roomId = await roomId.json();
                theme = roomId.theme;
                roomId = roomId.id;
            } catch (error) {
                console.log(error)
            }
        }

        // Handles the connection to the socket
        try {
            socket = new WebSocket(`ws://${API_URL}/room/${roomId}?nickname=${userProfile.nickname}&lat=${userProfile.lat}&long=${userProfile.long}`, "protocolOne");

            socket.onopen = function () {
                console.log("Connected to server");
            };
            

            // Handle audio
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            var madiaRecorder = new MediaRecorder(stream);
            madiaRecorder.start();

            var audioChunks = [];

            madiaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });

            madiaRecorder.addEventListener("stop", function () {
                var audioBlob = new Blob(audioChunks);

                audioChunks = [];

                var fileReader = new FileReader();
                fileReader.readAsDataURL(audioBlob);

                fileReader.onloadend = function () {
                    if (muted) return;

                    var base64String = fileReader.result;
                    socket.send(JSON.stringify({type: "voice", data: base64String}));

                };

                madiaRecorder.start();


                setTimeout(function () {
                    madiaRecorder.stop();
                }, TIMEOUT);
            });

            setTimeout(function () {
                madiaRecorder.stop();
            }, TIMEOUT);
        });

        // Handle communications
        socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        let data = msg.data;

        switch (msg.type) {

            case "receiveVoice":
                var audio = new Audio(data);
                audio.play();
                break;

            case "receiveUsers":
                users = data;
                dispatch("newUsers", users);
                break;

            case "receiveSubtitle":
                console.log(data);
                dispatch("newSubtitle", data);
                break

            default:
                break;
        }
    }

        } catch (e) {
            roomId = null;
            console.log(e)
        }
});

</script>