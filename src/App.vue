<template>
  <div id="app">
    <Modal
      v-bind:config="modalConfig"
      v-if="modalConfig.show"
      @modal-callback="modalCallback"
    />
    <transition name="fade" mode="out-in">
      <router-view
        :notes="notes"
        @remove-note="removeNote"
        @create-note="createNote"
        @save-note="saveNote"
      />
    </transition>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
export default {
  name: "app",

  // Если локальное хранилище пусто, то использовать демонстрационные данные
  data() {
    return {
      modalConfig: {},
      notes: localStorage.notes
        ? JSON.parse(localStorage.notes)
        : [
            {
              id: 1,
              title: "Список дел на вчера",
              tasks: [
                { id: 1, title: "Дело №1", isComplete: false },
                { id: 2, title: "Дело №2", isComplete: false },
                { id: 3, title: "Дело №3", isComplete: false },
                { id: 4, title: "Дело №4", isComplete: true },
                { id: 5, title: "Дело №5", isComplete: false },
                { id: 6, title: "Дело №6", isComplete: false },
                { id: 7, title: "Дело №7", isComplete: false }
              ]
            },
            {
              id: 2,
              title: "Список дел на сегодня",
              tasks: [
                { id: 1, title: "Дело №1", isComplete: true },
                { id: 2, title: "Дело №2", isComplete: true },
                { id: 3, title: "Дело №3", isComplete: true },
                { id: 4, title: "Дело №4", isComplete: true },
                { id: 5, title: "Дело №5", isComplete: false }
              ]
            },
            {
              id: 3,
              title: "Список дел на завтра",
              tasks: [
                { id: 1, title: "Дело №1", isComplete: true },
                { id: 2, title: "Дело №2", isComplete: false },
                { id: 3, title: "Дело №3", isComplete: false }
              ]
            },
            {
              id: 4,
              title: "Список дел на следующую неделю",
              tasks: [
                { id: 1, title: "Дело №1", isComplete: true },
                { id: 2, title: "Дело №2", isComplete: false },
                { id: 3, title: "Дело №3", isComplete: false },
                { id: 4, title: "Дело №4", isComplete: true },
                { id: 5, title: "Дело №5", isComplete: false }
              ]
            },
            {
              id: 5,
              title: "Список дел на ближайшие пять лет",
              tasks: [
                { id: 1, title: "Дело №1", isComplete: true },
                { id: 2, title: "Дело №2", isComplete: false },
                { id: 3, title: "Дело №3", isComplete: false },
                { id: 4, title: "Дело №4", isComplete: false },
                { id: 5, title: "Дело №5", isComplete: false }
              ]
            }
          ]
    };
  },
  components: { Modal },
  methods: {
    // Функция, выполняемая после подтверждения действия в модальном окне
    modalCallback() {},

    // Добавление заметки
    createNote() {
      let id =
        this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1;
      this.notes.push({ id, title: "Новая заметка #" + id, tasks: [] });
      this.$router.push({ name: "NoteEditor", params: { id } });
    },

    // Удаление заметки
    removeNote(id, confirmed = false) {

      // Если действие было подтверждено
      if (confirmed) {
        // Если мы не находимся на домашней странице, то вернуться на домашнюю
        if (this.$route.name !== "Home") {
          this.$router.push({ name: "Home" });
        }

        // Применить изменения к списку заметок
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotesToStorage();
      }

      // Если требуется запрос на подтверждение, вызываем модальное окно
      else {
        this.modalCallback = () => {
          this.removeNote(id, true);
          this.modalConfig.show = false;
        };
        this.modalConfig = {
          text: "Вы уверены что хотите удалить заметку?",
          warning: "Заметка удалится безвозвратно",
          show: true
        };
      }
    },

    // Сохранение заметки в массиве заметок
    saveNote(note) {
      this.notes = this.notes.map(n => {
        if (n.id === note.id) return note;
        return n;
      });
      this.saveNotesToStorage();
    },

    // Сохранение текущего состояния в локальном хранилище
    saveNotesToStorage() {
      localStorage.notes = JSON.stringify(this.notes);
    }
  }
};
</script>
<style>
@font-face {
  font-family: "Kwixter Sketch";
  font-style: normal;
  font-weight: normal;
  src: local("Kwixter Sketch"),
    url("/fonts/Kwixter Sketch_D.woff") format("woff");
}
html,
body {
  width: 100%;
  margin: 0;
  height: 100%;
  overflow-x: hidden;
}
body {
  background: url("/img/bodybg2.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  justify-content: center;
  height: 100%;
}
button:focus {
  border: none;
  outline: none;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.15s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
