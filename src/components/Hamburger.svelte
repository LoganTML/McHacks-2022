<script>
	export let open = false
</script>

<button class:open on:click={() => open = !open}>
	<svg width=32 height=24>
		<line id="top" x1=0 y1=2  x2=32 y2=2/>
		<line id="middle" x1=0 y1=12 x2=24 y2=12/>
		<line id="bottom" x1=0 y1=22 x2=32 y2=22/>
	</svg>
</button>

<style>
	svg {
		min-height: 24px;
		transition: transform 0.3s ease-in-out;
	}
	
	svg line {
		stroke: currentColor;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out
	}
	
	button {
		z-index: 20;
		background-color: transparent;
		cursor: pointer;
		border: none;
		transition: color 0.3s;
		margin-top: auto;
		margin-bottom: auto;
		transform: scale(1.1);
		margin-left: 10px;
		color: grey;
		outline: none;
	}

	button:focus {
		outline: none;
	}

	button:hover {
		color: white;
	}
	
	.open svg {
		transform: scale(0.7)
	}
	
	.open #top {
		transform: translate(6px, 0px) rotate(45deg)
	}
	
	.open #middle {
		opacity: 0;
	}
	
  .open #bottom {
		transform: translate(-12px, 9px) rotate(-45deg)
	}
</style>