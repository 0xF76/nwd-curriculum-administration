<template>
  <div class="language-groups">
    <LanguageGroupsPage />
  </div>
</template>
<script>
import LanguageGroupsPage from "@/components/LanguageGroupsPage.vue";

export default {
  name: "LanguageGroups",
  components: {
    LanguageGroupsPage,
  },
};
</script>
<style scoped>
.language-groups {
  height: 100%;
}
</style>