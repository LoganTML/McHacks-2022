<script>
	import Hamburger from './Hamburger.svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
	
	export let sidebar = false;
    export let roomId;
    export let muted;
    export let users = [];

    const logout = () => {
        roomId = null;
        dispatch('logout');
    }
</script>

<header>
	<nav>
		<Hamburger bind:open={sidebar}/>
        <span id="roomid">Room ID: {roomId != null ? `${roomId} (${users.length} user(s))` : "None"}</span>
        <div style="border-left-style: solid; margin-left: 10px;">
            <button id="mute-btn" class="btn"><img alt="Mute/Unmute" src={muted ? "assets/mic-off.png" : "assets/mic-on.png"} on:click={() => muted = !muted}></button>
            {#if roomId != null}
                <button id="logout-btn" class="btn"><img alt="Logout" src="assets/logout.png" on:click={logout}></button>
            {/if}
        </div>
	</nav>
</header>

<style>
    header {
        z-index: 100;
        position: fixed;
        display: flex;
        flex-direction: row;
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
        flex-direction: row;
    }
    #roomid {
        color: #fff;
        font-size: 1.2rem;
        margin-left: 20px;
        margin-top: auto;
		margin-bottom: auto;
    }

    .btn {
        background-color: transparent;
        border: none;
        outline: none;
        width: 60px;
        height: 60px;
        margin-top: auto;
        margin-bottom: auto;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;

        float: right;
        align-self: flex-end;
        right: 0;
    }

    .btn:hover {
        background-color: gray;

    }

    .btn > img {
        width: 80%;
        height: 80%;
        margin: auto;
    }

</style>