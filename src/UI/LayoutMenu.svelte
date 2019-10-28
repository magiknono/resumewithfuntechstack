<script>
import { createEventDispatcher } from 'svelte';
import { slide } from 'svelte/transition';
import { quintOut } from 'svelte/easing';


const dispatch = createEventDispatcher();

function layoutMenuClose() {
    dispatch('close');
}

</script>
<style>
.layout-menu {
  
  display:flex;
 
  
 
  background: #EEEE;
  background-image: linear-gradient(rgba(0, 0, 0, .1) .1em, transparent .1em), linear-gradient(90deg, rgba(0, 0, 0, .1) .1em, transparent .1em);
  background-size: 3em 3em;
  border : 1px solid rgba(0,0,0,.1);
}
.layout-menu-close {
    
}
</style>

<div class="layout-menu" transition:slide="{{delay: 100, duration: 1500, easing: quintOut }}">
    <slot></slot>
    <button class="layout-menu-close" on:click={layoutMenuClose}>Close</button>
</div>