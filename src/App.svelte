<script>
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
		background-color:rgba(0,0,0,0.1);;
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
	}

	/* layout */
	.wrapper {
		 display:grid; /* use firefox dev to see grid  */
		 /* grid-template-columns: repeat(auto-fill,minmax(461px,1px,1fr)); */
		 grid-row-gap:2em;
		 grid-column-gap:0em;
		 grid-template-areas: 
		 ". hero-logo hero-title hero-title ."
		 ". footer footer footer ."
		 ". main main main .";
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
	.jobs {
		
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
</div>