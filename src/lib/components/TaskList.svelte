<script lang="ts">
	import { page } from '$app/state';
	import ProjectFilter from './ProjectFilter.svelte';

	let tasksPerPage = $state(5);
	let currentPage = $state(1);
	let totalPages = $derived(Math.ceil(page.data.tasks.length / tasksPerPage));
	let sortOption = $state('urgency-desc');
	let sortOptions = [
		{ value: 'urgency-desc', label: 'Urgency' },
		{ value: 'manual-asc', label: 'Manual' },
		{ value: 'content-asc', label: 'Name' },
		{ value: 'due-asc', label: 'Due date' },
		{ value: 'date-asc', label: 'Date added' },
		{ value: 'prioriy-desc', label: 'Priority' }
	];
	let projects = page.data.projects;
	let projectFilter = $state(projects.map((project) => project.id));

	let tasks = $derived.by(() => {
		let filtered = [...page.data.tasks];
		// apply filters
		filtered = filtered.filter((task) => !task.isCompleted);
		filtered = filtered.filter((task) => projectFilter.includes(task.projectId));

		// sort
		let sorted = [...filtered].sort((a, b) => {
			const [field, direction] = sortOption.split('-');
			let comparison;
			switch (field) {
				case 'content':
					comparison = a.content.localeCompare(b.content);
					break;
				case 'manual':
					comparison = a.order - b.order;
					break;
				case 'prioriy':
					comparison = a.priority - b.priority;
					break;
				case 'date':
					comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					break;
				case 'due':
					if (!a.due?.date && !b.due?.date) {
						comparison = 0;
					} else if (!a.due?.date) {
						comparison = 1;
					} else if (!b.due?.date) {
						comparison = -1;
					} else {
						comparison = new Date(a.due.date).getTime() - new Date(b.due.date).getTime();
					}
					break;
				default:
					comparison = a.urgency - b.urgency;
			}
			return direction === 'desc' ? -comparison : comparison;
		});

		// apply pagination
		const start = (currentPage - 1) * tasksPerPage;
		const end = start + tasksPerPage;
		return sorted.slice(start, end);
	});
</script>

<section class="mx-auto w-120 py-4">
	<div class="navbar">
		<div class="flex-1 text-xl font-bold text-primary">Tasks</div>
		<div class="flex-none">
			<ProjectFilter bind:selection={projectFilter} />
		</div>
		<select bind:value={sortOption} class="select max-w-xs flex-none">
			{#each sortOptions as option}
				<option value={option.value} selected={option.value === sortOption}>{option.label}</option>
			{/each}
		</select>
	</div>
	{#each tasks as task}
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
