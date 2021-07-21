<template>
  <div class="language-groups-table">
    <LanguageGroupsCurriculumTablePage />
  </div>
</template>
<script>
import LanguageGroupsCurriculumTablePage from "@/components/LanguageGroupsCurriculumTablePage.vue";
export default {
  name: "LanguageGroupsTable",
  components: {
    LanguageGroupsCurriculumTablePage,
  },
};
</script>
<style scoped>
.language-groups-table {
  height: 100%;
}
</style>