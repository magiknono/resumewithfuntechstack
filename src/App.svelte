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
		 grid-template-columns: 1fr;
	}
	.hero {
		margin:2em;
		padding:1.5em;
	}
	article {
	}
	section, footer, aside {
		box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, .2);
		border: 0.15em solid rgba(0,0,0,0.5);
		margin:2em;
		padding:1.5em;
	}
	


</style>

<div class="wrapper">
	<header class="hero">
		<img src="https://via.placeholder.com/200" alt ="#" />
		<h1>magiknono - Freelance</h1>
		<h2>Full stack dev & linux sysadmin</h2>
	</header>

	<main>
		<article class="jobs">
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>job title</h3>
				<p>description</p>
				<p>2y</p>
			</section>
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>job title</h3>
				<p>description</p>
				<p>2y</p>
			</section>
			<section class="job">
				<img src="https://via.placeholder.com/96" alt ="#" />
				<h3>job title</h3>
				<p>description</p>
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
			<aside class="extra-skills">
				<img src="https://via.placeholder.com/60" alt ="#" />
				<img src="https://via.placeholder.com/60" alt ="#" />
			</aside>
		</article>

		<footer>
			<nav class="socials">
				<img src="https://via.placeholder.com/32" alt ="#" />
				<img src="https://via.placeholder.com/32" alt ="#" />
				<img src="https://via.placeholder.com/32" alt ="#" />
			</nav>
		</footer>

	</main>
</div>