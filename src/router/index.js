import Vue 			from 'vue';
import VueRouter 	from 'vue-router';
import Home 		from '../views/Home.vue';
import NoteEditor 	from '../views/NoteEditor.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/note/:id',
		name: 'NoteEditor',
		component: NoteEditor
	}
];

const router = new VueRouter({
	routes,
	mode: 'history'
});

export default router;
