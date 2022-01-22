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
        AFRAME.registerComponent('stuff', {
            tick : function(time, timeDelta) {
                this.el.object3D.position.y = Math.sin(time / 1000) * 2;
            }
        })
        initiated = true;
    }


    
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
  <a-scene
    embedded
    vr-mode-ui="enabled: false"
    arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;">

    <a-marker type="pattern" preset="hiro">
        <!-- <a-box position='0 {10 * Math.sin()} 0' material='color: red; opacity: 0.5;'></a-box> -->
        <a-entity stuff geometry="primitive: box; width: 1; height: 1; depth: 1"></a-entity>
    </a-marker>
    
    <a-entity camera></a-entity>
  </a-scene>
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