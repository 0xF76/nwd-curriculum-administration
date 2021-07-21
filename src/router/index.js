import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Classes from '../views/Classes.vue'
import ClassesCurriculumTable from '../views/ClassesCurriculumTable.vue';
import LanguageGroups from '../views/LanguageGroups.vue'
import LanguageGroupsCurriculumTable from '../views/LanguageGroupsCurriculumTable.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes
  },
  {
    path: "/curriculum-table-classes",
    name: "ClassesCurriculumTable",
    component: ClassesCurriculumTable
  },
  {
    path: "/language-groups",
    name: "LanguageGroups",
    component: LanguageGroups
  },
  {
    path: "/curriculum-table-language-groups",
    name: "LanguageGroupsCurriculumTable",
    component: LanguageGroupsCurriculumTable

  }
]

const router = new VueRouter({
  routes
})

export default router
