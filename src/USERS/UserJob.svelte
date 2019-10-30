<script>
    export let jobImage;
    export let jobTitle;
    export let jobDesc;
    export let jobTime;
</script>
<style>
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
</style>
<section class="job">
    <img src="{jobImage}" alt ="#" />
    <div class="job-desc">
        <h4>{jobTitle}</h4>
        <p>{jobDesc}</p>
    </div>
    <div class="job-time">
        <p>{jobTime}</p>
    </div>
</section>