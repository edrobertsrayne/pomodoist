<script lang="ts">
	import { page } from '$app/state';

	let { selection = $bindable([]), ...props } = $props();

	function toggleSelection() {
		if (selection.length === page.data.projects.length) {
			selection = [];
		} else {
			selection = page.data.projects.map((project) => project.id);
		}
	}
</script>

<div class="dropdown dropdown-hover">
	<div tabindex="0" class="btn btn-ghost btn-sm m-1" role="button">Projects</div>
	<div class="dropdown-content join join-vertical z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
		<div class="form-control">
			{#each page.data.projects as project}
				<label class="label cursor-pointer">
					<span class="label-text">{project.name}</span>
					<input type="checkbox" class="checkbox" bind:group={selection} value={project.id} />
				</label>
			{/each}
			<button class="btn btn-ghost btn-sm" onclick={toggleSelection}
				>{selection.length === page.data.projects.length ? 'Clear' : 'Select all'}</button
			>
		</div>
	</div>
</div>
