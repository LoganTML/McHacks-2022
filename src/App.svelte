<script>
	import Sidebar from './components/Sidebar.svelte'
	import Navbar from './components/Navbar.svelte'
	let sidebarOpen = false;

	let roomId = "test";


</script>

<Sidebar bind:open={sidebarOpen}>
	<a href="/">Test</a>
</Sidebar>
<Navbar bind:sidebar={sidebarOpen} roomId={roomId}/>

<style>
	:global(body) {
		padding: 0;
	}
</style>