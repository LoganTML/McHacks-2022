<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	export let count;
	export let roomid;
	export let joinFct;

	console.log(roomid);

	// function joinRoom() {
		
	// }

</script>

<style>
	button {
		width: 2rem
	}
</style>

<div style="width:100%;text-align:center;font-weight:600">
	Room #{count}
</div>


<div>
	<button on:click={() => joinFct(roomid)}>
		Join
	</button>
</div>


