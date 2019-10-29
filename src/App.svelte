<script>
  import WrapperGrid from "../src/UI/WrapperGrid.svelte";
  import LayoutMenu from "../src/UI/LayoutMenu.svelte";

	let layouts = ["\
		'. hero-logo hero-title hero-title .' \
		'. main main main .' \
		'. footer footer footer .'",
			 "\
		'. hero-title hero-title hero-logo .' \
		'. main main main .' \
		'. footer footer footer .'",
		 "\
		'. hero-logo hero-title hero-title .' \
		'. footer footer footer .' \
		'. main main main .'",
		 "\
		'. hero-title hero-title hero-logo .' \
		'. footer footer footer .' \
		'. main main main .'",
		"\
		'. footer footer footer .' \
		'. hero-logo hero-title hero-title .' \
		'. main main main .'",
		"\
		'. footer footer footer .' \
		'. hero-title hero-title hero-logo .' \
		'. main main main .'",
		"\
		'. main main main .' \
		'. hero-title hero-title hero-logo .' \
		'. footer footer footer .'",
		"\
		'. main main main .' \
		'. hero-logo hero-title hero-title .' \
		'. footer footer footer .'",
		"\
		'. main main main .' \
		'. footer footer footer .' \
		'. hero-logo hero-title hero-title .'",
		"\
		'. main main main .' \
		'. footer footer footer .' \
		'. hero-title hero-title hero-logo .'"];

		let selectedLayout = layouts[0];

		let layoutMenuVisible = false;

		function layoutMenuOpen() {
			layoutMenuVisible = true;
		};
		function layoutMenuClose() {
			layoutMenuVisible = false;
		};
		

</script>

<style>
	/* reset is in /public/global.css */

	/* typo */
	h1,h2,h3,p {
		font-family: 'Nunito Sans', sans-serif;
	}
	h1 {
		font-size:2em;
		font-weight:bold;
		text-transform:uppercase;
		letter-spacing: 0.1em;
		
	}
	h2 {
		font-size:1.6em;
		font-weight:lighter;
		letter-spacing: 0.1em;
		}
	h3 {
		font-size:1.4em;
		text-transform:uppercase;
		font-weight:bolder;
		background-color:rgba(0,0,0,0.1);
		padding-left:1em;
		margin-bottom:1em;
	}
	h4 {
		font-size:1.2em;
		font-weight:normal;
		text-transform: capitalize;
	}
	/* exception for mobile */
	@media only screen and (max-width:800px) {
	aside {
		display:none;	
		}
	section.skill {
		margin-right:0em;
	}
	}

	/* layout (wrapper is a svelte component) */
	
	.hero-logo , .hero-title{
		margin-top:0.5em;
		padding:0.5em; 	
	}
	.hero-logo {
		grid-area:hero-logo;
		width:10em;
		height:10em;
		padding:0.5em;
		margin-left:1em;
		
	}
	.hero-title {
		grid-area:hero-title;
		box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, .2);
		border: 0.15em solid rgba(0,0,0,0.5);
		margin-left:0.1em;
		padding-right:0.1em;
		margin-right:1em;
	}
	main {
		grid-area:main;
		justify-self:auto;
	}
	
	footer {
		grid-area:footer;
	}
	section, footer, aside {
		box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, .2);
		border: 0.15em solid rgba(0,0,0,0.5);
		margin-bottom:1.5em;
		padding:1em;
	}
	article {
		border: 0.15em solid rgba(0,0,0,0.2);
		padding:1em;
		margin-bottom:1em;
	}
	article.skills {
		display:grid;
		grid-template-columns: 4;
	}
	.skill {
		grid-column:1/3;
		margin-right:1em;
	}
	aside {
		grid-column:3/4;
		grid-row: 2/8;
	}
	.job {
		display:flex;
		align-items:center;
	}
	.job-desc {
		flex:1;
		padding:2em;
	}
	.job > img {
		border-radius:50%;
	}

	.skill {
		display:flex;
		align-items:flex-start;
	}
	.skill-desc {
		flex:1;
		padding:2em;
	}
	.skill > img {
		border-radius: 50%;
	}
	aside > img {
		border-radius:5px;
	}
	.layout-menu-choices {
		display:flex;
		height:20vh;
		width:100%;
		align-items:center;
		justify-content:space-between;
	}
	.layout-menu-choices > li {
		border-color:transparent;
	}
	.btn-l {
		height:150px;
		width:180px;
		background-repeat:no-repeat;
		background-color:transparent;
		border-color:transparent;
		opacity: 0.8;
  		transition: 0.4s;
	}
	.btn-l:hover {
		height:150px;
		width:180px;
		background-repeat:no-repeat;
		background-color:rgba(255,255,255, .5);
		border-style:solid;
		border-color:transparent;
		border-radius:25px;
		opacity: 1;
	}
	.btn-l:focus {
		height:150px;
		width:180px;
		background-repeat:no-repeat;
		background-color:rgba(255,255,255, .5);
		border-style:solid;
		border-color:transparent;
		border-radius:25px;
		opacity: 1;
	}
	.btn-bg--l0 {
		background-image:url("../public/l0.png");
	}
	.btn-bg--l1 {
		background-image:url("../public/l1.png");
	}
</style>

{#if layoutMenuVisible}
	<LayoutMenu on:close={(layoutMenuClose)}>
		<ul class="layout-menu-choices">
			{#each layouts as l, i}
				<li><button class="btn-l btn-bg--l{i}" on:click={() => selectedLayout = l}>{i}<img src="layouts/l{i}.png" alt="layout{i}" /></button></li>
			{/each}
			
		</ul>
	</LayoutMenu>
{/if}
<WrapperGrid customAreas={selectedLayout} >
		<article class="hero-logo">
		
		<img src="https://via.placeholder.com/200" alt ="#" />
		</article>
		<article class="hero-title">
		<h1>Freelance</h1>
		<h2>Full stack dev & linux sysadmin</h2>
		<button on:click={layoutMenuOpen}>Choose Layout</button>
		
		</article>

	<main>
		<article class="jobs">
			<h3>JOBS</h3>
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
			
			<div class="job-desc">
				<h4>job title</h4>
				<p>description</p>
			</div>
			<div class="job-time">
				<p>2y</p>
			</div>
			</section>
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
			
			<div class="job-desc">
				<h4>job title</h4>
				<p>description</p>
			</div>
			<div class="job-time">
				<p>2y</p>
			</div>
			</section>
		</article>

		<article class="skills">
			<h3>SKILLS</h3>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<div class="skill-desc">
				<h4>skill title</h4>
				<p>description</p>
				</div>
				<div class="skill-level">
				<p>High</p>
				</div>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<div class="skill-desc">
				<h4>skill title</h4>
				<p>description</p>
				</div>
				<div class="skill-level">
				<p>High</p>
				</div>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<div class="skill-desc">
				<h4>skill title</h4>
				<p>description</p>
				</div>
				<div class="skill-level">
				<p>High</p>
				</div>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<div class="skill-desc">
				<h4>skill title</h4>
				<p>description</p>
				</div>
				<div class="skill-level">
				<p>High</p>
				</div>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<div class="skill-desc">
				<h4>skill title</h4>
				<p>description</p>
				</div>
				<div class="skill-level">
				<p>High</p>
				</div>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<div class="skill-desc">
				<h4>skill title</h4>
				<p>description</p>
				</div>
				<div class="skill-level">
				<p>High</p>
				</div>
			</section>
			
			
			<aside class="extra-skills">
				<h3>extra</h3>
				<img src="https://via.placeholder.com/60" alt ="#" />
				<img src="https://via.placeholder.com/60" alt ="#" />
			</aside>
			
		</article>
		
	</main>
		<footer>
			<nav class="socials">
				<img src="https://via.placeholder.com/32" alt ="#" />
				<img src="https://via.placeholder.com/32" alt ="#" />
				<img src="https://via.placeholder.com/32" alt ="#" />
			</nav>
		</footer>
</WrapperGrid>