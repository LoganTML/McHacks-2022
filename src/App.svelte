<script>
	import Sidebar from './components/Sidebar.svelte'
	import Navbar from './components/Navbar.svelte'
	import ApplicationPage from './pages/ApplicationPage.svelte'
	let sidebarOpen = false;

	let roomId = "test";

</script>
<ApplicationPage />
<Sidebar bind:open={sidebarOpen}>
	
</Sidebar>
<Navbar bind:sidebar={sidebarOpen} roomId={roomId}/>

<style>
	:global(body) {
		padding: 0;
		overflow: hidden;
	}
</style>