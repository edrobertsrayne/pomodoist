import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable, type Readable, derived } from 'svelte/store';

const firebaseConfig = {
	apiKey: 'AIzaSyAUigON8hR6jxmKhbMDs-6bp0uHrFXGAVI',
	authDomain: 'pomodoist-ea445.firebaseapp.com',
	projectId: 'pomodoist-ea445',
	storageBucket: 'pomodoist-ea445.firebasestorage.app',
	messagingSenderId: '34106630034',
	appId: '1:34106630034:web:1b2a15c488c28fe21e2b4b'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
}
export const user = userStore();
