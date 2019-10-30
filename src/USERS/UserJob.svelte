<script>
    export let jobCompany;
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
        border: 1px solid #eee;
        width:96px;
        height:96px;
	}
</style>
<section class="job">
    <img src="{jobImage}" alt ="#" />
    <div class="job-desc">
        <h4>{jobCompany}</h4>
        <h5>{jobTitle}</h5>
        <p>{jobDesc}</p>
    </div>
    <div class="job-time">
        <p>{jobTime}</p>
    </div>
</section>