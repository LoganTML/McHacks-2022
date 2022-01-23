<script>
	import Sidebar from './components/Sidebar.svelte'
	import Navbar from './components/Navbar.svelte'
	import ApplicationPage from './pages/ApplicationPage.svelte'
	import VerticalTab from './components/VerticalTab.svelte'
	import VoiceRoom from './components/VoiceRoom.svelte';
	import Map from './components/Map.svelte';
	let sidebarOpen = false;

	let roomId = null;

	let tabItems = ["assets/room.png", "assets/pin.png", "assets/settings.png"];
	let selectedItem = "assets/room.png";
	let muted = true;
	let users = [];
	let socket = null;
	let theme = null;
	let unique = {}

	let userProfile = {
        nickname: "user" + String(Math.floor(Math.random() * 9999)),
        lat: "null",
        long: "null"
    }

	function joinNewRoom(id) {
		if (socket != null) {
			socket.close();
			socket = null;
		}
		roomId = id;
		unique = {};
	}

</script>

{#key unique}
<VoiceRoom muted={muted} bind:roomId={roomId} bind:users={users} bind:socket={socket} bind:theme={theme} bind:userProfile={userProfile}/>
{/key}
<ApplicationPage file={theme}/>
<Sidebar bind:open={sidebarOpen}>
	<VerticalTab items={tabItems} bind:selectedItem={selectedItem}>
		{#if selectedItem === "assets/room.png"}
			<div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
				{#if roomId != null}
					<h1 class="center" style="color: white;">Current Room ({roomId})</h1>
					<ul class="center">
						{#each users as user}
							<li style="list-style-type: none; color: white; font-size: x-large; border: white 2px solid; padding: 15px; border-radius: 10px; margin-bottom: 15px;"><img style="width: 30px; height: 30px; margin-right: 10px; margin-bottom: -7px;" alt='' src='assets/user.png'>{user}</li>
						{/each}
					</ul>
				{:else}
					<h1 style="margin: auto; color: white;">Not currently in a room.</h1>
				{/if}
			</div>
		{/if}
		{#if selectedItem === "assets/pin.png"}
			<div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
				<Map joinFct={joinNewRoom} userProfile={userProfile}/>
			</div>
		{/if}
		{#if selectedItem === "assets/settings.png"}
			<div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
				<p style="margin-left: auto; margin-right: auto;">helllo</p>
			</div>
		{/if}
	</VerticalTab>
</Sidebar>
<Navbar bind:sidebar={sidebarOpen} bind:roomId={roomId} users={users} bind:muted={muted} on:logout={() => socket.close()}/>

<style>
	:global(body) {
		padding: 0;
		overflow: hidden;
	}

	.center {
		margin-left: auto;
		margin-right: auto;
	}

</style>