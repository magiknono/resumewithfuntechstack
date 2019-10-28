<script>
</script>

<style>
	/* reset is in /public/global.css */

	/* typo */
	h1,h2,h3, p {
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
		font-size:1.2em;
		font-weight:normal;
	}

	/* layout */
	.wrapper {
		 display:grid; /* use firefox dev to see grid  */
		 /* grid-template-columns: repeat(auto-fill,minmax(461px,1px,1fr)); */
		 grid-row-gap:2em;
		 grid-column-gap:0em;
		 grid-template-areas: 
		 "hero-logo hero-title hero-title"
		 "main main main"
		 "footer footer footer";
		 padding-left:0.1em;
		 padding-top:0.01em;
	}
	.hero-logo , .hero-title{
		margin-top:0.5em;
		padding:0.5em; 	
	}
	.hero-logo {
		grid-area:hero-logo;
		width:10em;
		height:10em;
		padding:0.5em;
		
	}
	.hero-title {
		grid-area:hero-title;
		box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, .2);
		border: 0.15em solid rgba(0,0,0,0.5);
		margin-left:0.1em;
		padding-right:0.1em;
	}
	main {
		grid-area:main;
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
	}
	main {
		display: grid;
		grid-row-gap:1em;
		grid-template-areas:
		"jobs jobs jobs jobs jobs jobs jobs jobs jobs"
		"skills skills skills skills skills skills skills aside aside";
	}
	.jobs {
		grid-area:jobs;
		display: grid;
  		grid-column: 1 / 10;
		grid-template-columns: subgrid;
		
	}
	.skills {
		grid-area:skills;
	}
	.aside {
		grid-area:aside;
	}
	.job {
		grid-column: 1/2;
	}
	.job-desc {
		grid-column:2/9;
	}
	.job-time {
		grid-columns:9/10;
	}




</style>

<div class="wrapper">
		<article class="hero-logo">
		
		<img src="https://via.placeholder.com/200" alt ="#" />
		</article>
		<article class="hero-title">
		<h1>Freelance</h1>
		<h2>Full stack dev & linux sysadmin</h2>
		</article>

	<main>
		<article class="jobs">
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
			</section>
			<section class="job-desc">
				<h3>job title</h3>
				<p>description</p>
			</section>
			<section class="job-time">
				<p>2y</p>
			</section>
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
			</section>
			<section class="job-desc">
				<h3>job title</h3>
				<p>description</p>
			</section>
			<section class="job-time">
				<p>2y</p>
			</section>
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
			</section>
			<section class="job-desc">
				<h3>job title</h3>
				<p>description</p>
			</section>
			<section class="job-time">
				<p>2y</p>
			</section>
		</article>

		<article class="skills">
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>skill title</h3>
				<p>description</p>
				<p>High</p>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>skill title</h3>
				<p>description</p>
				<p>High</p>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>skill title</h3>
				<p>description</p>
				<p>High</p>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>skill title</h3>
				<p>description</p>
				<p>High</p>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>skill title</h3>
				<p>description</p>
				<p>High</p>
			</section>
			<section class="skill">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>skill title</h3>
				<p>description</p>
				<p>High</p>
			</section>
			
		</article>
		<aside class="extra-skills">
				<img src="https://via.placeholder.com/60" alt ="#" />
				<img src="https://via.placeholder.com/60" alt ="#" />
			</aside>
	</main>
		<footer>
			<nav class="socials">
				<img src="https://via.placeholder.com/32" alt ="#" />
				<img src="https://via.placeholder.com/32" alt ="#" />
				<img src="https://via.placeholder.com/32" alt ="#" />
			</nav>
		</footer>
</div>