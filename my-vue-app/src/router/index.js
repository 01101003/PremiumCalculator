import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/views/MainPage.vue';
import statistics from '@/views/statistics.vue';
import Algebra from '@/views/Algebra.vue';
import geometryoptions from '@/views/geometryoptions.vue';
import Geo2D from '@/views/geo2D.vue';
import geo3D from '@/views/geo3D.vue';
import combinatorics from '@/views/combinatorics.vue';
import dismath from '@/views/dismath.vue';
import numbers from '@/views/numbers.vue';
import cheatsheet from '@/views/cheatsheet.vue';
import AIs from '@/views/AI.vue';



const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  }
  ,
  {
    path: '/algebra',
    name: 'algebra',
    component: Algebra
  }
,
  {
    path: '/geometryoptions',
    name: 'geometryoptions',
    component: geometryoptions
  }
,
{
  path: '/geo2d',
  name: 'geo2D',
  component: Geo2D
}

,
{
  path: '/statistics',
  name: 'statistics',
  component: statistics
}
,
{
  path: '/geo3d',
  name: 'geo3D',
  component: geo3D
}
,
{
  path: '/combinatorics',
  name: 'combinatorics',
  component: combinatorics
}
,
{
  path: '/dismath',
  name: 'dismath',
  component: dismath
}
,
{
  path:'/numbers',
  name: 'numbers',
  component: numbers
}
,
{
  path: '/cheatsheet',
  name: 'cheatsheet',
  component: cheatsheet

}
,
{
  path: '/AI',
  name: 'AI',
  component: AIs
}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
