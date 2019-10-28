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
	}
</style>

<div class="wrapper" style="--areas:{customAreas};">
    <slot></slot>
</div>