<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import '../app.css';
	import Theme from './theme.svelte';
	import { theme } from '$lib/stores';
	let { children } = $props();

	import { auth, user } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const user = await signInWithPopup(auth, provider);
		console.log(user);
	}

	onMount(() => {});
</script>

<svelte:head>
	<html lang="en" data-theme={$theme}></html></svelte:head
>

<nav class="navbar mb-8 bg-primary text-primary-content">
	<div class="flex-1">
		<btn class="btn btn-ghost text-xl"><a href="/">🍅 Pomodoist</a></btn>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#if $user}
				<li><button onclick={() => signOut(auth)}>Logout</button></li>
			{:else}
				<li><button onclick={signInWithGoogle}>Sign In with Google</button></li>
			{/if}
		</ul>
		<Theme />
	</div>
</nav>

{@render children()}
