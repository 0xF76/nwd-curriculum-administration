<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="curriculums"
      :search="search"
      no-data-text="Nie znaleziono programów nauczania"
      hide-default-footer
      :items-per-page="-1"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat class="align-center">
          <v-toolbar-title>Programy Nauczania Klas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Wyszukaj"
            single-line
            hide-details
          ></v-text-field>
          <v-dialog v-model="dialogEdit" max-width="1000px">
            <v-card>
              <v-card-title class="text-h5">
                Edytowanie programu nauczania
              </v-card-title>
              <v-card-text>
                <v-form ref="editForm">
                  <v-row>
                    <v-col>
                      <v-combobox
                        v-model="editedItem.przedmiot"
                        required
                        :rules="[(v) => !!v || 'Przedmiot jest wymagany']"
                        label="Przedmiot"
                        :items="subjects"
                      >
                      </v-combobox>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Numer programu"
                        v-model="editedItem.numer"
                        required
                        :rules="[(v) => !!v || 'Numer jest wymagany']"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        required
                        :rules="[(v) => !!v || 'Program jest wymagany']"
                        label="Nazwa programu"
                        v-model="editedItem.program"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-combobox
                        required
                        :rules="[(v) => !!v || 'Nauczyciel jest wymagany']"
                        label="Nauczyciel"
                        v-model="editedItem.nauczyciel"
                        :items="teachers"
                      ></v-combobox>
                    </v-col>
                    <v-col>
                      <v-combobox
                        required
                        :rules="[(v) => !!v || 'Podręcznik jest wymagany']"
                        label="Podręcznik"
                        v-model="editedItem.podrecznik"
                        :items="books"
                      ></v-combobox>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="editItemConfirm()">Potwierdź</v-btn>
                <v-btn color="blue darken-1" text @click="closeEdit()">Anuluj</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="650px">
            <v-card>
              <v-card-title class="text-h5 justify-center">
                Czy na pewno chcesz usunąć ten program nauczania?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm()">
                  Usuń
                </v-btn>
                <v-btn color="blue darken-1" text @click="closeDelete()">
                  Anuluj
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            style="margin-left: 50px; margin-right: 50px"
            dark
            color="indigo"
            @click="
              addItem();
              getTeachersAndSubjectsAndBooks();
            "
          >
            Dodaj
          </v-btn>
          <v-btn @click="downloadData()" dark color="red">Pobierz</v-btn>
          <v-dialog v-model="dialogAdd" max-width="1000px">
            <v-card>
              <v-card-title class="text-h5 justify-center"
                >Dodaj nowy program nauczania
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="addValid">
                  <v-row>
                    <v-col>
                      <v-combobox
                        required
                        :rules="[(v) => !!v || 'Przedmiot jest wymagany']"
                        label="Przedmiot"
                        v-model="addSubject"
                        :items="subjects"
                      ></v-combobox>
                    </v-col>
                    <v-col>
                      <v-text-field
                        required
                        :rules="[(v) => !!v || 'Numer jest wymagany']"
                        label="Numer programu"
                        v-model="addNumber"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        required
                        :rules="[(v) => !!v || 'Program jest wymagany']"
                        label="Nazwa programu"
                        v-model="addCurriculum"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-combobox
                        required
                        :rules="[(v) => !!v || 'Nauczyciel jest wymagany']"
                        label="Nauczyciel"
                        v-model="addTeacher"
                        :items="teachers"
                      ></v-combobox>
                    </v-col>
                    <v-col>
                      <v-combobox
                        required
                        :rules="[(v) => !!v || 'Podręcznik jest wymagany']"
                        label="Podręcznik"
                        v-model="addBook"
                        :items="books"
                      ></v-combobox>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!addValid"
                  @click="addItemConfirm()"
                >
                  Dodaj
                </v-btn>
                <v-btn color="blue darken-1" text @click="closeAdd()">
                  Anuluj
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.przedmiot`]="{ item }">
        <v-chip color="indigo" text-color="white">
          {{ item.przedmiot }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="
            editItem(item);
            getTeachersAndSubjectsAndBooks();
          "
          >mdi-pencil</v-icon
        >
        <v-icon
          small
          class="mr-2"
          @click="deleteItem(item.id, item.nauczyciel, item.przedmiot)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { db, FieldValue } from "@/firebase";
const { Parser } = require("json2csv");
const download = require("downloadjs");
export default {
  firestore() {
    return {
      curriculums: db.collection("programyNauczania"),
      classes: db.collection("klasy"),
    };
  },

  data() {
    return {
      //headers for data-table
      headers: [
        { text: "Przedmiot", align: "start", value: "przedmiot" },
        { text: "Numer", align: "start", value: "numer" },
        { text: "Program", align: "start", value: "program" },
        { text: "Nauczyciel", align: "start", value: "nauczyciel" },
        { text: "Podręcznik", align: "start", value: "podrecznik" },
        { value: "actions", sortable: false },
      ],
      curriculums: null,
      classes: null,
      search: "",
      //delete item variables
      editedId: "",
      editedTeacher: "",
      editedSubject: "",
      dialogDelete: false,
      //add item variables
      dialogAdd: false,
      teachers: null,
      subjects: null,
      addTeacher: "",
      addNumber: "",
      addCurriculum: "",
      addSubject: "",
      addValid: false,
      books: null,
      addBook: "",
      dialogEdit: false,
      editedItem: {
        przedmiot: "",
        numer: "",
        program: "",
        nauczyciel: "",
        podrecznik: "",
      },
    };
  },

  methods: {
    //delete item functions
    deleteItem(id, nauczyciel, przedmiot) {
      this.editedId = id;
      this.editedTeacher = nauczyciel;
      this.editedSubject = przedmiot;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      const key = `${this.editedSubject} ${this.editedTeacher}`;
      db.collection("programyNauczania")
        .doc(this.editedId)
        .delete()
        .then(async () => {
          this.classes.forEach(async (doc) => {
            if (!doc[key]) {
              await db
                .collection("klasy")
                .doc(doc.id)
                .update({ [key]: FieldValue.delete() });
            }
          });
        });

      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.editedId = "";
      this.editedTeacher = "";
      this.editedSubject = "";
    },
    // add item functions
    addItem() {
      this.dialogAdd = true;
    },
    getTeachersAndSubjectsAndBooks() {
      this.teachers = [];
      this.subjects = [];
      this.books = [];
      this.curriculums.map((doc) => {
        this.teachers.push(doc.nauczyciel);
        this.subjects.push(doc.przedmiot);
        this.books.push(doc.podrecznik);
      });
      this.teachers = Array.from(new Set(this.teachers));
      this.subjects = Array.from(new Set(this.subjects));
      this.books = Array.from(new Set(this.books));
    },
    async addItemConfirm() {
      await db.collection("programyNauczania").add({
        nauczyciel: this.addTeacher,
        numer: this.addNumber,
        program: this.addCurriculum,
        przedmiot: this.addSubject,
        podrecznik: this.addBook,
      });
      this.closeAdd();
    },
    closeAdd() {
      this.dialogAdd = false;
      this.$refs.form.reset();
    },
    async editItem(item) {
      this.editedId = item.id;

      const snapshot = await db
        .collection("programyNauczania")
        .doc(this.editedId)
        .get();
      this.editedItem = snapshot.data();
      this.dialogEdit = true;
    },
    async editItemConfirm() {
      await db.collection('programyNauczania').doc(this.editedId).set({
        nauczyciel: this.editedItem.nauczyciel,
        numer: this.editedItem.numer,
        program: this.editedItem.program,
        przedmiot: this.editedItem.przedmiot,
        podrecznik: this.editedItem.podrecznik
      });
      this.closeEdit();
    },
    closeEdit() {
      this.dialogEdit = false;
      this.editedId = "";
      this.$refs.editForm.reset();
    },
    //download data function
    downloadData() {
      const fields = [
        "przedmiot",
        "numer",
        "program",
        "nauczyciel",
        "podrecznik",
      ];
      const opts = { fields };
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(this.curriculums);
        download(csv, "programyNauczaniaJęzyki.txt", "text/plain");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>