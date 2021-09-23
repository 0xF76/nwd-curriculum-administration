<template>
  <v-container fluid style="height: 100%">
    <v-row class="text-center" style="height: 100%">
      <v-col cols="5">
        <v-card height="100%">
          <v-tabs
            background-color="blue darken-1"
            center-active
            dark
            v-model="tab"
          >
            <v-tab v-for="grupa in languageGroups" :key="grupa.id">
              {{ grupa.id }}
            </v-tab>
            <v-tab-item v-for="item in languageGroups" :key="item.id">
              <v-toolbar flat class="align-center">
                <v-toolbar-title
                  >Programy Nauczania Grupy {{ item.id }}</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  color="red"
                  @click="
                    downloadData(Object.values(item).filter(Boolean), item.id)
                  "
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
                    Czy na pewno chcesz usunąć ten program z tej grupy
                    językowej?
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
            >Dostosuj program nauczania grupy językowej
          </v-card-title>
          <v-card-text>
            <v-form ref="formEdit" v-model="formEditValid">
              <v-row>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Grupa językowa jest wymagana']"
                    @focus="getGroupsNames()"
                    :items="groupsNames"
                    v-model="selectedGroup"
                    label="Wybierz grupę"
                    no-data-text="Nie znaleziono grupy"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Nauczyciel jest wymagany']"
                    @focus="getTeachers()"
                    :items="teachers"
                    v-model="selectedTeacher"
                    label="Wybierz nauczyciela"
                    no-data-text="Nie znaleziono nauczyciela"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    filled
                    required
                    :rules="[(v) => !!v || 'Język jest wymagany']"
                    @focus="getTeacherLanguages()"
                    :items="teacherLanguages"
                    v-model="selectedLanguage"
                    label="Wybierz język"
                    no-data-text="Nie znaleziono języka"
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
                    label="Wybierz program"
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
              @click="addCurriculumToGroup()"
              style="color: white"
              color="indigo"
            >
              Wyślij
            </v-btn>
          </v-card-text>
        </v-card>
        <v-container style="padding-top: 20px">
          <v-row>
            <v-col style="padding-left: 0px">
              <v-card>
                <v-card-title class="text-h5">
                  Dodaj grupę językową
                </v-card-title>
                <v-card-text>
                  <v-form v-model="addValid" ref="addGroupForm">
                    <v-text-field
                      style="padding-left: 15px; padding-right: 15px"
                      filled
                      required
                      :rules="[(v) => !!v || 'Grupa językowa jest wymagana']"
                      label="Wpisz grupę"
                      v-model="groupToAdd"
                    ></v-text-field>
                  </v-form>
                  <v-btn
                    @click="addGroup()"
                    :disabled="!addValid"
                    style="color: white"
                    color="indigo"
                  >
                    Dodaj
                  </v-btn>
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
                    <div>Istnieje już taka grupa językowa</div>
                  </v-layout>
                </v-layout>
              </v-snackbar>
            </v-col>
            <v-col style="padding-right: 0px">
              <v-card>
                <v-card-title class="text-h5">Usuń grupę językową</v-card-title>
                <v-card-text>
                  <v-form v-model="deleteValid" ref="deleteGroupForm">
                    <v-autocomplete
                      style="padding-left: 15px; padding-right: 15px"
                      filled
                      required
                      :rules="[(v) => !!v || 'Grupa językowa jest wymagana']"
                      @focus="getGroupsNames()"
                      :items="groupsNames"
                      v-model="groupToDelete"
                      label="Wybierz grupę"
                      no-data-text="Nie znaleziono grupy"
                    ></v-autocomplete>
                  </v-form>
                  <v-btn
                    @click="deleteGroup()"
                    :disabled="!deleteValid"
                    style="color: white"
                    color="indigo"
                    >Usuń</v-btn
                  >
                  <v-dialog v-model="dialogDelete" max-width="650px">
                    <v-card>
                      <v-card-title>
                        Czy na pewno chcesz usunąć grupę {{ groupToDelete }}
                      </v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteGroupConfirm()"
                          >Usuń</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="closeDelete()"
                        >
                          Anuluj
                        </v-btn>
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
      languageGroups: db.collection("grupyJęzykowe"),
      curriculums: db.collection("programyNauczaniaJęzyki"),
    };
  },
  data() {
    return {
      languageGroups: null,
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
      curriculumGroupToDelete: "",
      deleteCurriculumDialog: false,
      formEditValid: false,
      groupsNames: [],
      selectedGroup: "",
      teachers: [],
      selectedTeacher: "",
      teacherLanguages: [],
      selectedLanguage: "",
      teacherCurriculums: [],
      selectedCurriculum: "",
      addValid: false,
      groupToAdd: "",
      dialogDelete: false,
      groupToDelete: "",
      deleteValid: false,
      addSnackbar: false,
      subjectBooks: [],
      selectedBook: "",
    };
  },
  methods: {
    deleteCurriculum(przedmiot, nauczyciel, idx) {
      this.curriculumSubjectToDelete = `${przedmiot.replace(
        ".",
        "_"
      )} ${nauczyciel}`;
      this.curriculumGroupToDelete = this.languageGroups[idx].id;
      this.deleteCurriculumDialog = true;
    },
    async deleteCurriculumConfirm() {
      await db
        .collection("grupyJęzykowe")
        .doc(this.curriculumGroupToDelete)
        .update({ [this.curriculumSubjectToDelete]: FieldValue.delete() });
      this.closeDeleteCurriculum();
    },
    closeDeleteCurriculum() {
      this.deleteCurriculumDialog = false;
    },
    getGroupsNames() {
      this.groupsNames = [];
      this.languageGroups.map((doc) => {
        this.groupsNames.push(doc.id);
      });
    },
    getTeachers() {
      this.teachers = [];
      this.curriculums.map((doc) => {
        this.teachers.push(doc.nauczyciel);
      });
      this.teachers = Array.from(new Set(this.teachers));
    },
    async getTeacherLanguages() {
      this.teacherLanguages = [];
      const snapshot = await db
        .collection("programyNauczaniaJęzyki")
        .where("nauczyciel", "==", this.selectedTeacher)
        .get();
      snapshot.forEach((doc) => {
        this.teacherLanguages.push(doc.data().przedmiot);
      });
      this.teacherLanguages = Array.from(new Set(this.teacherLanguages));
    },
    async getTeacherCurriculums() {
      this.teacherCurriculums = [];
      const snapshot = await db
        .collection("programyNauczaniaJęzyki")
        .where("nauczyciel", "==", this.selectedTeacher)
        .where("przedmiot", "==", this.selectedLanguage)
        .get();
      snapshot.forEach((doc) => {
        this.teacherCurriculums.push(doc.data().program);
      });
      this.teacherCurriculums = Array.from(new Set(this.teacherCurriculums));
    },
    async getSubjectBooks() {
      this.subjectBooks = [];
      const snapshot = await db
        .collection("programyNauczaniaJęzyki")
        .where("nauczyciel", "==", this.selectedTeacher)
        .where("przedmiot", "==", this.selectedLanguage)
        .get();
      snapshot.forEach((doc) => {
        this.subjectBooks.push(doc.data().podrecznik);
      });
      this.subjectBooks = Array.from(new Set(this.subjectBooks));
    },
    async addCurriculumToGroup() {
      const curr = await db
        .collection("programyNauczaniaJęzyki")
        .where("nauczyciel", "==", this.selectedTeacher)
        .where("przedmiot", "==", this.selectedLanguage)
        .where("program", "==", this.selectedCurriculum)
        .where("podrecznik", "==", this.selectedBook)
        .get();
      db.collection("grupyJęzykowe")
        .doc(this.selectedGroup)
        .set(
          {
            [`${this.selectedLanguage.replace(".", "_")} ${
              this.selectedTeacher
            }`]: db.doc(`programyNauczaniaJęzyki/${curr.docs[0].id}`),
          },
          { merge: true }
        );
      this.$refs.formEdit.reset();
    },
    addGroup() {
      let docRef = db
        .collection("grupyJęzykowe")
        .doc(this.groupToAdd.toUpperCase());
      docRef.get().then((doc) => {
        if (doc.exists) {
          this.addSnackbar = true;
        } else {
          db.collection("grupyJęzykowe")
            .doc(this.groupToAdd.toUpperCase())
            .set({});
        }
        this.$refs.addGroupForm.reset();
      });
    },
    deleteGroup() {
      this.dialogDelete = true;
    },
    async deleteGroupConfirm() {
      db.collection("grupyJęzykowe").doc(this.groupToDelete).delete();
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$refs.deleteGroupForm.reset();
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
        download(csv, `programyNauczaniaGrupaJezykowa${id}.txt`, "text/plain");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>