<script>
export let customAreas;
</script>

<style>
	.wrapper {
		 display:grid; /* use firefox dev to see grid  */
		 /* grid-template-columns: repeat(auto-fill,minmax(461px,1px,1fr)); */
		 grid-row-gap:2em;
		 grid-column-gap:0em;
		 grid-template-areas: 
		 var(--areas); /* css var */
		 padding-left:0.1em;
		 padding-top:0.01em;
		 background-color:transparent;
		 animation: 7s wrapper cubic-bezier(.86,0,.07,1) 0.3s both;
		 
		 
	}
	
	@keyframes wrapper {
		0% {  transform:    scale(0.1, 0.1) ; }
		25% { transform: rotate(0.5turn);}
		75% { transform: rotateY(-70deg) ;}
		100% { transform: 0; }
}
</style>
<div class="wrapper" style="--areas:{customAreas};">
    <slot></slot>
</div>