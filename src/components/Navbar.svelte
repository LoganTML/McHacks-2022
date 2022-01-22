<script>
	import Hamburger from './Hamburger.svelte'
	
	export let sidebar = false;
    export let roomId;
</script>

<header>
	<nav>
		<Hamburger bind:open={sidebar}/>
        <span id="roomid">Room ID: {roomId}</span>
	</nav>
</header>

<style>
    header {
        z-index: 100;
        position: fixed;
        display: flex;
        justify-content: space-between;
        background-color: #060606;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 70px;
        width: auto;
    }
    nav {
        display: flex;
    }
    #roomid {
        color: #fff;
        font-size: 1.2rem;
        margin-left: 20px;
        margin-top: auto;
		margin-bottom: auto;
    }
</style>