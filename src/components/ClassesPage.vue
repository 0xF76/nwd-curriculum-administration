<template>
  <v-container fluid style="height: 100%">
    <v-row class="text-center" style="height: 100%">
      <v-col cols="5">
        <v-card height="100%">
          <v-tabs
            background-color="blue darken-1"
            dark
            v-model="tab"
            show-arrows
          >
            <v-tab v-for="klasa in classes" :key="klasa.id">
              {{ klasa.id }}
            </v-tab>
            <v-tab-item v-for="item in classes" :key="item.id">
              <v-toolbar flat class="align-center">
                <v-toolbar-title
                  >Programy Nauczania Klasy {{ item.id }}</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  color="red"
                  @click="downloadData(Object.values(item).filter(Boolean), item.id)"
                  >Pobierz</v-btn
                >
              </v-toolbar>
              <v-data-table
                :headers="headers"
                :items="Object.values(item).filter(Boolean)"
                no-data-text="Nie znaleziono programów nauczania"
                class="elevation-1"
                :footer-props="{
                  'items-per-page-options': [12],
                }"
              >
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
                      deleteCurriculum(item.przedmiot, item.nauczyciel, tab)
                    "
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
              <v-dialog v-model="deleteCurriculumDialog" max-width="650px">
                <v-card>
                  <v-card-title>
                    Czy na pewno chcesz usunąc ten program z tej klasy?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteCurriculumConfirm()"
                      >Usuń</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeDeleteCurriculum()"
                      >Anuluj</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title class="text-h5"
            >Dostosuj program nauczania klasy</v-card-title
          >
          <v-card-text>
            <v-form ref="formEdit" v-model="formEditValid">
              <v-row>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Klasa jest wymagana']"
                    @focus="getClassesNames()"
                    :items="classesNames"
                    v-model="selectedClass"
                    label="Klasa"
                    no-data-text="Nie znaleziono klasy"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Nauczyciel jest wymagany']"
                    @focus="getTeachers()"
                    :items="teachers"
                    label="Nauczyciel"
                    v-model="selectedTeacher"
                    no-data-text="Nie znaleziono nauczyciela"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Przedmiot jest wymagany']"
                    @focus="getTeacherSubjects()"
                    :items="teacherSubjects"
                    v-model="selectedSubject"
                    label="Przedmiot"
                    no-data-text="Nie znaleziono przedmiotu"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Program jest wymagany']"
                    @focus="getTeacherCurriculums()"
                    :items="teacherCurriculums"
                    v-model="selectedCurriculum"
                    label="Program"
                    no-data-text="Nie znaleziono programu"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Podręcznik jest wymagany']"
                    @focus="getSubjectBooks()"
                    :items="subjectBooks"
                    v-model="selectedBook"
                    label="Podręcznik"
                    no-data-text="Nie znaleziono podręcznika"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
            <v-btn
              :disabled="!formEditValid"
              @click="addCurriculumToClass()"
              style="color: white"
              color="indigo"
              >Wyślij</v-btn
            >
          </v-card-text>
        </v-card>
        <v-container style="padding-top: 20px">
          <v-row>
            <v-col style="padding-left: 0px">
              <v-card>
                <v-card-title class="text-h5">Dodaj klasę</v-card-title>
                <v-card-text>
                  <v-form v-model="addValid" ref="addClassForm">
                    <v-text-field
                      style="padding-left: 15px; padding-right: 15px"
                      filled
                      required
                      :rules="[(v) => !!v || 'Klasa jest wymagana']"
                      label="Wpisz klasę"
                      v-model="classToAdd"
                    ></v-text-field>
                  </v-form>
                  <v-btn
                    @click="addClass()"
                    :disabled="!addValid"
                    style="color: white"
                    color="indigo"
                    >Dodaj</v-btn
                  >
                </v-card-text>
              </v-card>
              <v-snackbar
                v-model="addSnackbar"
                :timeout="2500"
                color="warning"
                absolute
                class="ma-2"
              >
                <v-layout align-center pr-4>
                  <v-icon class="pr-3" dark large>mdi-alert</v-icon>
                  <v-layout column>
                    <div>
                      <strong>Ostrzeżenie</strong>
                    </div>
                    <div>Istnieje już taka klasa</div>
                  </v-layout>
                </v-layout>
              </v-snackbar>
            </v-col>
            <v-col style="padding-right: 0px">
              <v-card>
                <v-card-title class="text-h5">Usuń klasę</v-card-title>
                <v-card-text>
                  <v-form v-model="deleteValid" ref="deleteClassForm">
                    <v-autocomplete
                      style="padding-left: 15px; padding-right: 15px"
                      filled
                      required
                      :rules="[(v) => !!v || 'Klasa jest wymagana']"
                      @focus="getClassesNames()"
                      :items="classesNames"
                      v-model="classToDelete"
                      label="Wybierz klasę"
                      no-data-text="Nie znaleziono klasy"
                    ></v-autocomplete>
                  </v-form>
                  <v-btn
                    @click="deleteClass()"
                    :disabled="!deleteValid"
                    style="color: white"
                    color="indigo"
                    >Usuń</v-btn
                  >
                  <v-dialog v-model="dialogDelete" max-width="650px">
                    <v-card>
                      <v-card-title
                        >Czy na pewno chcesz usunąc klasę
                        {{ classToDelete }}?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteClassConfirm()"
                          >Usuń</v-btn
                        >
                        <v-btn color="blue darken-1" text @click="closeDelete()"
                          >Anuluj</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { db, FieldValue } from "@/firebase";
const { Parser } = require("json2csv");
const download = require("downloadjs");

export default {
  firestore() {
    return {
      classes: db.collection("klasy"),
      curriculums: db.collection("programyNauczania"),
    };
  },
  data() {
    return {
      classes: null,
      curriculums: null,
      tab: null,
      headers: [
        { text: "Przedmiot", align: "start", value: "przedmiot" },
        { text: "Numer", align: "start", value: "numer" },
        { text: "Program", align: "start", value: "program" },
        { text: "Nauczyciel", align: "start", value: "nauczyciel" },
        { text: "Podręcznik", align: "start", value: "podrecznik" },
        { value: "actions", sortable: false },
      ],
      curriculumSubjectToDelete: "",
      curriculumClassToDelete: "",
      deleteCurriculumDialog: false,
      formEditValid: false,
      classesNames: [],
      selectedClass: "",
      teacherSubjects: [],
      teacherCurriculums: [],
      selectedSubject: "",
      selectedCurriculum: "",
      teachers: [],
      selectedTeacher: "",
      addValid: false,
      deleteValid: false,
      classToAdd: "",
      classToDelete: "",
      dialogDelete: false,
      addSnackbar: false,
      subjectBooks: [],
      selectedBook: "",
    };
  },
  methods: {
    deleteCurriculum(przedmiot, nauczyciel, klasa) {
      this.curriculumSubjectToDelete = `${przedmiot.replace(
        ".",
        "_"
      )} ${nauczyciel}`;
      this.curriculumClassToDelete = this.classes[klasa].id;
      this.deleteCurriculumDialog = true;
    },
    async deleteCurriculumConfirm() {
      await db
        .collection("klasy")
        .doc(this.curriculumClassToDelete)
        .update({ [this.curriculumSubjectToDelete]: FieldValue.delete() });
      this.closeDeleteCurriculum();
    },
    closeDeleteCurriculum() {
      this.deleteCurriculumDialog = false;
    },
    getClassesNames() {
      this.classesNames = [];
      this.classes.forEach((doc) => {
        this.classesNames.push(doc.id);
      });
    },
    async getTeacherSubjects() {
      this.teacherSubjects = [];
      const snapshot = await db
        .collection("programyNauczania")
        .where("nauczyciel", "==", this.selectedTeacher)
        .get();
      snapshot.forEach((doc) => {
        this.teacherSubjects.push(doc.data().przedmiot);
      });
      this.teacherSubjects = Array.from(new Set(this.teacherSubjects));
    },
    getTeachers() {
      this.teachers = [];
      this.curriculums.map((doc) => {
        this.teachers.push(doc.nauczyciel);
      });
      this.teachers = Array.from(new Set(this.teachers));
    },
    async getTeacherCurriculums() {
      this.teacherCurriculums = [];
      const snapshot = await db
        .collection("programyNauczania")
        .where("nauczyciel", "==", this.selectedTeacher)
        .where("przedmiot", "==", this.selectedSubject)
        .get();
      snapshot.forEach((doc) => {
        this.teacherCurriculums.push(doc.data().program);
      });
      this.teacherCurriculums = Array.from(new Set(this.teacherCurriculums));
    },
    async getSubjectBooks() {
      this.subjectBooks = [];
      const snapshot = await db
        .collection("programyNauczania")
        .where("nauczyciel", "==", this.selectedTeacher)
        .where("przedmiot", "==", this.selectedSubject)
        .get();
      snapshot.forEach((doc) => {
        this.subjectBooks.push(doc.data().podrecznik);
      });
      this.subjectBooks = Array.from(new Set(this.subjectBooks));
    },
    async addCurriculumToClass() {
      const curr = await db
        .collection("programyNauczania")
        .where("nauczyciel", "==", this.selectedTeacher)
        .where("przedmiot", "==", this.selectedSubject)
        .where("program", "==", this.selectedCurriculum)
        .where("podrecznik", "==", this.selectedBook)
        .get();
      db.collection("klasy")
        .doc(this.selectedClass)
        .set(
          {
            [`${this.selectedSubject.replace(".", "_")} ${
              this.selectedTeacher
            }`]: db.doc(`programyNauczania/${curr.docs[0].id}`),
          },
          { merge: true }
        );
      this.$refs.formEdit.reset();
    },
    addClass() {
      let docRef = db.collection("klasy").doc(this.classToAdd.toUpperCase());
      docRef.get().then((doc) => {
        if (doc.exists) {
          this.addSnackbar = true;
        } else {
          db.collection("klasy").doc(this.classToAdd.toUpperCase()).set({});
        }
        this.$refs.addClassForm.reset();
      });
    },
    deleteClass() {
      this.dialogDelete = true;
    },
    async deleteClassConfirm() {
      db.collection("klasy").doc(this.classToDelete).delete();

      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$refs.deleteClassForm.reset();
    },
    downloadData(data, id) {
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
        const csv = parser.parse(data);
        download(csv, `programyNauczaniaKlasa${id}.txt`, "text/plain");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>