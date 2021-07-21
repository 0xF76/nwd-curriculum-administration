<template>
    <div class="classes-table">
        <ClassesCurriculumTablePage/>
    </div>
</template>
<script>
import ClassesCurriculumTablePage from '@/components/ClassesCurriculumTablePage.vue'
export default {
    name: 'ClassesCurriculumTable',
    components: {
        ClassesCurriculumTablePage
    }
}
</script>
<style scoped>
    .classes-table {
        height: 100%;
    }
</style>