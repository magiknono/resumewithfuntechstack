<script>
  import WrapperGrid from "./UI/WrapperGrid.svelte";
  import LayoutMenu from "./UI/LayoutMenu.svelte";
  import UserHero1 from "./USERS/UserHero1.svelte";
  import UserHero2 from "./USERS/UserHero2.svelte";
  import UserJob from "./USERS/UserJob.svelte";
  import BullshitGrid from "./UI/BullshitGrid.svelte";

  import { onMount } from "svelte";

  import WireframeTheme from "./THEMES/WireframeTheme.svelte";
  import NesTheme from "./THEMES/NesTheme.svelte";
  import CulrsTheme from "./THEMES/CulrsTheme.svelte";

	const themes = [
			{ name: 'theme wireframe', bg: "", hero1:"hero-logo", hero2: "hero-title", button: 'wireframe-btn', section1: "jobs", section2: "skills", footer: 'footer', footerContent: "<img src='https://via.placeholder.com/32' alt ='#' /><img src='https://via.placeholder.com/32' alt ='#' /><img src='https://via.placeholder.com/32' alt ='#' />", component: WireframeTheme },
			{ name: 'theme nes', bg: "",hero1: "nes-container is-rounded is-centered hero-logo", hero2: "nes-container is-rounded hero-title", button: 'nes-btn', section1: "nes-container is-rounded", section2: "nes-container is-rounded", footer: 'nes-container is-rounded', footerContent: "<i class='nes-icon linkedin is-large'></i><i class='nes-icon gmail is-large'></i><i class='nes-icon github is-large'></i><i class='nes-icon twitter is-large'></i>", component: NesTheme   },
			{ name: 'theme nes dark',bg: "", hero1: "nes-container is-dark is-rounded is-centered hero-logo", hero2: "nes-container is-dark is-rounded hero-title", button: 'nes-btn is-primary', section1: "nes-container is-dark is-rounded", section2: "nes-container is-dark is-rounded", footer: 'nes-container is-dark is-rounded', footerContent: "<i class='nes-icon linkedin is-large'></i><i class='nes-icon gmail is-large'></i><i class='nes-icon github is-large'></i><i class='nes-icon twitter is-large'></i>", component: NesTheme   },
			{ name: 'theme culrs',bg: "ouf", hero1: "hero-logo culrs-logo", hero2: "hero-title culrs-title", button:"culrs-btn",section1: "jobs jobs-culrs",section2:"skills skills-culrs",footer:"footer footer-culrs",footerContent:"", component: CulrsTheme },
	];
 	let selectedTheme = themes[0];

	const layouts = ["\
			'. . hero-logo hero-title hero-title . .' \
			'. . main main main . .' \
			'. . footer footer footer . .'",
				"\
			'. . hero-title hero-title hero-logo . .' \
			'. . main main main . .' \
			'. . footer footer footer . .'",
			"\
			'. . hero-logo hero-title hero-title . .' \
			'. . footer footer footer . .' \
			'. . main main main . .'",
			"\
			'. . hero-title hero-title hero-logo . .' \
			'. . footer footer footer . .' \
			'. . main main main . .'",
			"\
			'. . footer footer footer . .' \
			'. . hero-logo hero-title hero-title . .' \
			'. . main main main . .'",
			"\
			'. . footer footer footer . .' \
			'. . hero-title hero-title hero-logo . .' \
			'. . main main main . .'",
			"\
			'. . main main main . .' \
			'. . hero-title hero-title hero-logo . .' \
			'. . footer footer footer . .'",
			"\
			'. . main main main . .' \
			'. . hero-logo hero-title hero-title . .' \
			'. . footer footer footer . .'",
			"\
			'. . main main main . .' \
			'. . footer footer footer . .' \
			'. . hero-logo hero-title hero-title . .'",
			"\
			'. . main main main . .' \
			'. . footer footer footer . .' \
			'. . hero-title hero-title hero-logo . .'"];

	let selectedLayout = layouts[0];

	

	let layoutMenuVisible = false;

	function layoutMenuOpen() {
		layoutMenuVisible = true;
	};
	function layoutMenuClose() {
		layoutMenuVisible = false;
	};

	let visible = true;

	// fetch fast_jsonapi
	const endpoint = "http://localhost:3000/api/v1";
	let uri = "/users/1";
	 let headers = new Headers({
    "Accept"       : "application/vnd.api+json",
    "User-Agent"   : "OhOhOh"
});

	let datas = [];

	 onMount(async () => {
		const response = await fetch(endpoint + uri, {
			method: 'GET',
			headers: headers
		});
		const json = await response.json();
		datas = [...datas,json.data.attributes];
	});


	const users = [
		{
			id: 1,
			firstName: 'first name',
			lastName: 'last name',
			headline: 'job headline',
			avatarUrl: 'https://via.placeholder.com/200'
		},
		{
			id: 2,
			firstName: 'arnaud',
			lastName: 'cormier',
			headline: 'Freelance',
			avatarUrl: '/images/avatar.jpg'

		}
	];

	const jobs = [
		{
			id: 1,
			jobCompany: 'company',
			jobTitle: 'job title',
			jobDesc: 'job description',
			jobTime: '2y',
			jobImage: 'https://via.placeholder.com/96',
			userId: 1
		},
		{
			id: 2,
			jobCompany: 'company',
			jobTitle: 'job title',
			jobDesc: 'job description',
			jobTime: '2y',
			jobImage: 'https://via.placeholder.com/96',
			userId: 1
		},
		{
			id: 3,
			jobCompany: 'upyourbizz',
			jobTitle: 'administrateur systèmes et réseaux',
			jobDesc: 'sécurisation et mise en place infrastructure serveurs web linux',
			jobTime: '2y',
			jobImage: '/images/uyb.png',
			userId: 2
		},
		{
			id: 4,
			jobCompany: 'geodis',
			jobTitle: 'technicien informatique support et déploiement',
			jobDesc: 'Support informatique région ouest',
			jobTime: '2y',
			jobImage: '/images/geodis.png',
			userId: 2
		},
		{
			id: 5,
			jobCompany: 'mma',
			jobTitle: 'technicien de supervision systèmes et réseaux',
			jobDesc: 'Gestion des incidents, mise en prod et monitoring',
			jobTime: '4y',
			jobImage: '/images/mma.png',
			userId: 2
		},

	];
	let seedId = 1;
	function getRealDataWay1() {
		seedId =2;
		selectedUser = users.filter(user => user.id == seedId);
		selectedJobs = jobs.filter(jobs => jobs.userId == seedId);
	}
	let selectedUser = users.filter(user => user.id == seedId);
	let selectedJobs = jobs.filter(jobs => jobs.userId == seedId);

	let getLucky = false;
	$: console.log(getLucky);
</script>

<style>
	/* reset is in /public/global.css */
	
	
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
	:global(section, footer, aside) {
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
		background-repeat:no-repeat;
		background-color:transparent;
		border-color:transparent;
		opacity: 0.8;
  		transition: 0.4s;
	}
	.btn-l:hover {
		padding:1em;
		background-repeat:no-repeat;
		background-color:rgba(255,255,255, .5);
		border-style:solid;
		border-color:transparent;
		border-radius:25px;
		opacity: 1;
	}
	.btn-l:focus {
		padding:1em;
		background-repeat:no-repeat;
		background-color:rgba(255,255,255, .5);
		border-style:solid;
		border-color:transparent;
		border-radius:25px;
		opacity: 1;
	}
</style>


{#if layoutMenuVisible}
	<LayoutMenu on:close={(layoutMenuClose)}>
		<ul class="layout-menu-choices">
			{#each layouts as l, i}
				<li><button class="btn-l" on:click={() => selectedLayout = l}><img src="layouts/l{i}.png" alt="layout"></button></li>
			{/each}
			
		</ul>
	</LayoutMenu>
{/if}
{#if getLucky}
<BullshitGrid />
{:else}
<div class="{selectedTheme.bg}">
<WrapperGrid customAreas={selectedLayout} >
{#each datas as d}

{d.email}
{d.first_name}
{/each}

	{#each selectedUser as user}
		<article class="{selectedTheme.hero1}">
			<UserHero1 avatarUrl={user.avatarUrl} />
		</article>

		<article class="{selectedTheme.hero2}">
				<UserHero2 firstName={user.firstName}
							lastName={user.lastName}
							headline={user.headline} />
		
			<button class="{selectedTheme.button}" on:click={layoutMenuOpen}>Choose Layout</button>
			<select bind:value={selectedTheme}>
				{#each themes as theme}
					<option value={theme}> {theme.name}</option>
				{/each}
			</select>
			<svelte:component this={selectedTheme.component}/>
			<button on:click={getRealDataWay1}>getRealData</button>
			<label>PAUSE ? >
				<input type="checkbox" bind:checked={getLucky}>
			</label>
			

		</article>
	{/each}

	<main>
		<article class="{selectedTheme.section1}">
			<h3>JOBS</h3>
			
			{#each selectedJobs as job}
				<UserJob jobCompany={job.jobCompany}
						 jobTitle={job.jobTitle}
						 jobImage={job.jobImage}
						 jobDesc={job.jobDesc}
						 jobTime={job.jobTime} />
			{/each}
			
		</article>

		<article class="{selectedTheme.section2}">
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
	<footer class="{selectedTheme.footer}">
		<nav class="socials">
			{@html selectedTheme.footerContent}
		</nav>
	</footer>
		
</WrapperGrid>
</div>
{/if}