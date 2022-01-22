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
        display: flex;
        justify-content: space-between;
        background-color: #060606;
        align-items: center;
        height: 70px;
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