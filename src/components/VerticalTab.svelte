<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
export let items = [];
export let selectedItem = null;

const tabChanged = (item) => {
    selectedItem = item;
    dispatch('tabChange', item);
};

</script>

<div class="container">  
    <div class="wrapper">
        {#each items as item}
            {#if item === selectedItem}
                <button class="wrapper-btn" style="background-color: lightblue;" on:click={() => tabChanged(item)}><img src={item} alt=''></button> 
            {:else}
                <button class="wrapper-btn" on:click={() => tabChanged(item)}><img src={item} alt=''></button> 
            {/if}
            
        {/each}
    </div>
    <slot></slot>
</div>

<style>
    .wrapper {
        height: 100%;
        width: 100px;
        background: #060606;
        display: flex;
        flex-direction: column;
        margin: 0;
        
    }
    .container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        margin: 0;
    }
    .wrapper-btn {
        width: 80px;
        height: 80px;
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
        transition: background-color 0.2s ease-in-out;
    }
    .wrapper-btn:hover {
        background-color: grey;
    }

    .wrapper-btn img {
        width: 80%;
        height: 80%;
        border: none;
        outline: none;
        margin: auto;
    }
</style>