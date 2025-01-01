<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import '../app.css';
	let { children } = $props();
</script>

<div class="navbar mb-8 bg-primary text-primary-content">
	<div class="flex-1">
		<btn class="btn btn-ghost text-xl">Pomodoist</btn>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="#" aria-label="Settings">Settings</a></li>
			<li><a href="#" aria-label="Login">Login</a></li>
		</ul>
	</div>
</div>

{@render children()}
