<template>
  <div class="classes">
    <ClassesPage />
  </div>
</template>
<script>
import ClassesPage from "@/components/ClassesPage.vue";
export default {
  name: "Classes",
  components: {
    ClassesPage,
  },
};
</script>
<style scoped>
.classes {
  height: 100%;
}
</style>