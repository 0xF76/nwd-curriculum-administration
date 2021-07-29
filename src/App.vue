<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        >Nowodworek - Administracja Programami Nauczania</v-toolbar-title
      >
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Nowodworek </v-list-item-title>
          <v-list-item-subtitle> Programy Nauczania </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item link to="/">Klasy</v-list-item>
        <v-list-item link to="/curriculum-table-classes"
          >Programy Nauczania (Klasy)</v-list-item
        >
      </v-list>
      <v-list dense nav>
        <v-list-item link to="/language-groups">Grupy Językowe</v-list-item>
        <v-list-item link to="/curriculum-table-language-groups"
          >Programy Nauczania (Języki)</v-list-item
        >
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer>
      <v-col class="text-center"> Made with <v-icon dense small>mdi-heart</v-icon> by Jakub Bubak </v-col>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  name: "App",

  data: () => ({
    drawer: false,
  }),
};
</script>
