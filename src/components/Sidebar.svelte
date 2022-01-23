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
        position: fixed;
        z-index: 99;
        width: 100%;
        height: 100%;
        background-color: #1d1e22;
        border-radius: 10px;
		left: -100%;
        top: 0;
		transition: left 0.3s ease-in-out;
	}

    nav {
        display: flex;
        flex-direction: column;
        margin-top: 60px;
        padding-top: 10px;
        font-size: larger;
        height: 100%;
    }
	
	.open {
		left: 0
	}
</style>