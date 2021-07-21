module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        icon: "./src/assets/logo.png",
        productName: "Nowodworek - Administracja Programami Nauczania"
      }
    }
  }
}
