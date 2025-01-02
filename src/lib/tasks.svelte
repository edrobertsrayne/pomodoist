<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchTasks, type Task } from './todoist';

	let tasks = $state<Task[]>([]);

	let tasksPerPage = $state(5);
	let currentPage = $state(1);
	let totalPages = $derived(Math.ceil(tasks.length / tasksPerPage));

	let paginatedTasks = $derived.by(() => {
		let filtered = [...tasks];
		// apply filters
		filtered = filtered.filter((task) => !task.isCompleted);

		// sort
		let sorted = filtered.sort((a, b) => b.urgency - a.urgency);

		// apply pagination
		const start = (currentPage - 1) * tasksPerPage;
		const end = start + tasksPerPage;
		return sorted.slice(start, end);
	});

	let projectDialog;

	onMount(async () => {
		tasks = await fetchTasks();
	});
</script>

<section class="mx-auto w-120 py-4">
	<div class="navbar">
		<div class="flex-1 text-xl font-bold text-primary">Tasks</div>
		<div class="flex-none">
			<div onclick={() => projectDialog.showModal()} class="btn btn-ghost m-1">Projects</div>
		</div>
	</div>
	{#each paginatedTasks as task}
		<div id={task.id} class="alert my-4">
			<input class="checkbox-primary checkbox" type="checkbox" />
			<span>{task.content}</span>
		</div>
	{/each}
	<div class="flex">
		<div class="join flex-none">
			<button disabled={currentPage <= 1} class="btn join-item" onclick={() => currentPage--}
				>«</button
			>
			<button class="btn join-item">Page {currentPage}</button>
			<button
				disabled={currentPage >= totalPages}
				class="btn join-item"
				onclick={() => currentPage++}>»</button
			>
		</div>
		<div class="flex-1"></div>
		<select bind:value={tasksPerPage} class="select flex-none">
			{#each [5, 10, 15, 20, 25] as option}
				<option value={option} selected={option === tasksPerPage}>{option} per page</option>
			{/each}
		</select>
	</div>
</section>

<dialog bind:this={projectDialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Select Projects</h3>
		<div class="modal-action"><form method="dialog"><button class="btn">Close</button></form></div>
	</div>
</dialog>
