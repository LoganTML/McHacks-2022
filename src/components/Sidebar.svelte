<script>
	export let open = false
</script>

<aside class:open>
	<nav>
		<slot></slot>
	</nav>
</aside>

<style>
	aside {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #1d1e22;
        border-radius: 10px;
		left: -100%;
		transition: left 0.3s ease-in-out;
	}

    nav {
        display: flex;
        flex-direction: column;
        margin-top: 60px;
        padding: 5px;
        font-size: larger;
    }
	
	.open {
		left: 0
	}
</style>