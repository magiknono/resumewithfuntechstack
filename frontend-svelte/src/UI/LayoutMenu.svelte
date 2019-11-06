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
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
	position: sticky;
	top:0px;
  display:grid;
  background: #EEEE;
  background-image: linear-gradient(rgba(0, 0, 0, .1) .1em, transparent .1em), linear-gradient(90deg, rgba(0, 0, 0, .1) .1em, transparent .1em);
  background-size: 3em 3em;
  border : 1px solid rgba(0,0,0,.1);

}

</style>

<div class="layout-menu" transition:slide="{{delay: 100, duration: 1500, easing: quintOut }}">
    <slot></slot>
    <button class="nes-btn" on:click={layoutMenuClose}>Close</button>
</div>