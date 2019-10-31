
 <svelte:head>
 <link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet"> 
</svelte:head>
<style>
    body, h1 {
        font-family: 'Roboto Mono', monospace;
        text-align:center;
        color:white;
        font-weight:bold;
        font-size:5em;
        justify-content:center;
    }
	.wrapper {
		 display:grid; /* use firefox dev to see grid  */
		 /* grid-template-columns: repeat(auto-fill,minmax(461px,1px,1fr)); */
		 grid-row-gap:2em;
		 grid-column-gap:0em;
		 grid-template-columns: repeat(5,200px);
         grid-template-rows: 50px, 150px, 1fr, 150px;
		 grid-column-gap:2em;
		 padding-top:2em;
		 
         justify-content:center;
        
         
         background-color: #1b8442;
         height:100vh;
         
         
	}
    .tools {
        grid-column: 1 / 6;
        grid-row: 1 / 2;

    }
    .tapis-title1 {
        grid-column: 1 / 6;
        grid-row: 2 / 3;
        
        
    }
    .tapis-title2 {
        grid-column: 1 / 6;
        grid-row: 4 / 5;
        
       
    }
    .beer {
        background-color: #a03e39;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23ffffff' fill-opacity='0.41' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E");
        border-radius:5px;
        border:9px solid white;
        height:240px;
        width: 189px;
    }
	.active {
        background-color: white;
        border-radius:5px;
        border:9px solid black;
        height:240px;
        width: 189px;
    }

</style>

<script>
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

let time = new Date();

	$: hours = time.getHours();
	$: minutes = time.getMinutes();
	$: seconds = time.getSeconds();
onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
let cards = [
    { id: 1, imageUrl: 'images/1.jpeg', selected: false },
    { id: 2, imageUrl: 'images/2.jpeg', selected: false },
    { id: 3, imageUrl: 'images/3.jpeg', selected: false },
    { id: 4, imageUrl: 'images/4.jpeg', selected: false },
    { id: 5, imageUrl: 'images/5.jpeg', selected: false }

 
];
function mark(card, selected) {
    cards = [card, ...cards];
    card.selected = true;
    cards = cards.filter(c => c !== selected)
     
     
}
function shuffle() {
    cards = cards.sort(() => Math.random() - 0.5);
    
}

let visible = false;
let status = 'pret à mélanger...';
</script>


<div class="wrapper">
    <div class="tools">
        <label>pause: il est {hours}:{minutes} et {seconds}s - Afficher toutes les cartes 
            <input type="checkbox" bind:checked={visible}>
        </label>
        <button on:click={shuffle}>{status}</button>
    </div>
    <div class="tapis-title1"><h1>RANDOM POKER PAUSE</h1></div>
    {#each cards.filter(c=> !c.selected) as card (card.id)}
        <div class="beer" id="{card.id}" transition:fly="{{ y: 400, duration: 2000 }}"
		on:introstart="{() => status = 'prêt à mélanger'}"
		on:outrostart="{() => status = 'ca mélange'}"
		on:introend="{() => status = 'mélanger encore'}"
		on:outroend="{() => status = 'c est melangé'}" on:click={() => mark(card, false)}>
            {#if visible}
            <img src="{card.imageUrl}" alt="{console.log(card.id, card)}" />
            {/if}
        </div>
    {/each}
    <div class="tapis-title2"><h1>RANDOM POKER PAUSE</h1></div>
    
</div>