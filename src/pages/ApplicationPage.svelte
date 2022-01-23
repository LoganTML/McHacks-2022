<script>
    import { onMount } from "svelte";
    let mounted;
    let aframe;
    let ar;
    let initiated;
    $: ready = aframe && ar && mounted;

    const aframeLoaded = () => {
        aframe = true;
        init();
    };

    const arLoaded = () => {
        ar = true;
    };

    onMount(() => { 
        mounted = true;
    });


    function init() {
        initiated = true;
    }

    export let file;
    
</script>

<svelte:head>
  {#if mounted}
    <script
      src="https://aframe.io/releases/1.2.0/aframe.min.js"
      on:load={aframeLoaded}></script>
    <script
      src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.2/aframe/build/aframe-ar.js"
      on:load={arLoaded}></script>
  {/if}
</svelte:head>

{#if ready && initiated}
<body style='margin : 0px; overflow: hidden;'>
    <a-scene embedded arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;">
        <!-- <a-entity gltf-model={file} rotation="-90 0 0" scale="0.01 0.01 0.01"></a-entity>
        <a-marker-camera preset='hiro'></a-marker-camera>
    </a-scene> -->
    <!-- <script src="ar.js"></script> -->
    <a-scene embedded arjs>
        <a-entity
                id='left'
                rotation="-90 0 0"
                position="0 0.5 0"
                geometry="primitive: plane; width: 2; height: auto"
                material="color: blue"
                text="value: Room 1\n People: 1">
        </a-entity>
        <a-plane rotation="-90 0 0" position="0 0 0" src="https://media.giphy.com/media/oYtVHSxngR3lC/giphy.gif"></a-plane>
        <a-entity id='right' scale='2 2 2' heigh=auto width=3 rotation="-90 0 0" position="0 0.5 0" text="value: Position\n Montreal; align: right"></a-entity>
        <a-marker-camera preset='hiro'></a-marker-camera>
    </a-scene>
</body>
{/if}

<style>
    :global(a-scene video) {
    /* display: block; */
    /* width: auto !important;
    height: auto !important; */
    /* margin: 0 !important;
    object-fit: contain !important; */
    object-fit: contain;
  }
</style>