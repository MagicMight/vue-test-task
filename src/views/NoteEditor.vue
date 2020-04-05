<template>
  <div class="editor-container" v-if="note" ref="editor-container">
    <h2>Редактирование заметки</h2>
    <div class="note-panel">
      <Note
        :note="note"
        @remove-note="$emit('remove-note', note.id)"
        @remove-task="removeTask"
        @create-task="createTask"
        @register-state="doAction('register')"
        @drop-last-state="doAction('dropLastState')"
      />
    </div>
    <div class="actions-panel" ref="actions-panel">
      <a
        @click="doAction('undo')"
        class="action__undo"
        title="Отменить изменение"
      />

      <a
        @click="doAction('redo')"
        class="action__redo"
        title="Повторить изменение"
      />

      <a
        @click="doAction('save')"
        class="action__save"
        :class="{ unsaved: changeIndex > 0 }"
        title="Сохранить"
      />

      <router-link
        :to="{ name: 'Home' }"
        class="action__home"
        :title="changeIndex === 0 ? 'На главную' : 'Отменить редактирование'"
      />

      <div class="freespace"></div>
    </div>
  </div>
</template>

<script>
import Note from "@/components/Note";
export default {
  name: "NoteEditor",
  components: { Note },
  props: ["notes", "removeNote"],

  data() {
    // Находим ссылку на заметку по ID, указанному в роуте
    for (let note of this.notes) {
      if (note.id == this.$route.params.id)
        return { note, changeStack: [], changeIndex: 0 };
    }
    return { note: "", changeStack: [], changeIndex: 0 };
  },

  methods: {
    // Набор действий, сопряженных с изменением пула состояний
    doAction(action) {
      switch (action) {
        // Откат изменений
        case "undo":
          if (this.changeIndex > 0) {
            this.note = this.changeStack[--this.changeIndex];
          }
          break;

        // Отмена отката
        case "redo":
          if (this.changeIndex < this.changeStack.length - 1) {
            this.note = this.changeStack[++this.changeIndex];
          }
          break;

        // Добавление текущего состояния в пул
        case "register":
          // Глубокое копирование объекта
          this.$set(
            this.changeStack,
            this.changeStack.length,
            JSON.parse(JSON.stringify(this.note))
          );

          this.changeIndex = this.changeStack.length - 1;
          this.note = this.changeStack[this.changeIndex];
          break;

        // Сохранение текущего состояния и сброс очереди
        case "save":
          this.changeStack = this.changeStack.filter(
            (el, idx) => idx === this.changeIndex
          );
          this.changeIndex = 0;
          this.note = this.changeStack[this.changeIndex];

          this.$emit("save-note", this.note);
          break;

        // Выйти без сохранения (отменить редактирование)
        case "exit-wo-saving":
          this.note = this.changeStack[0];
          this.$router.push({ name: "Home" });
          break;

        // Удалить из пула последнее зарегистрированное состояние
        case "dropLastState":
          if (
            this.changeIndex !== 0 &&
            this.changeIndex !== this.changeStack.length - 1
          ) {
            this.changeStack.pop();
          } else if (this.changeIndex === this.changeStack.length - 1) {
            this.note = this.changeStack[--this.changeIndex];
            this.changeStack.pop();
          }
      }
    },

    // Сохранить текущее состояние и удалить задачу из списка (удаление задачи из списка - обратимое действие, если изменения не были сохранены)
    removeTask(id) {
      this.doAction("register");
      this.note = this.changeStack[this.changeIndex];
      this.note.tasks = this.note.tasks.filter(t => t.id != id);
    },

    createTask() {
      this.doAction("register");
      this.note = this.changeStack[this.changeIndex];
      let id =
        this.note.tasks.length > 0
          ? this.note.tasks[this.note.tasks.length - 1].id + 1
          : 1;
      this.note.tasks.push({
        id,
        title: "Новая задача #" + id,
        isComplete: false
      });
    }
  },

  created() {
    if (!this.note) {
      // Если нет заметки с таким идентификатором, то возвращаемся на главную
      this.$router.push({ name: "Home" });
    } else {
      // В пул изменений ставим текущее состояние заметки при создании
      this.doAction("register");
    }
  }
};
</script>

<style scoped>
.editor-container {
  display: grid;
  grid-template-rows: 91% 9%;
  grid-template-columns: 1fr;
  margin: 0 auto;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.973);
  border-right: 1px dashed #ccc;
  border-left: 1px dashed #ccc;
}
.actions-panel {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
}
.editor-container .note {
  width: 95%;
  margin: 0 auto;
  box-shadow: none;
  height: 100%;
}
.editor-container h2 {
  align-self: baseline;
  display: none;
  font-family: "Kwixter Sketch" !important;
  font-size: 1.8rem !important;
  font-weight: normal;
}
.actions-panel a {
  transition: all 0.5s ease;
  background: none;
  border: none;
  padding: 0em 4%;
  display: flex;
  justify-content: space-around;
  text-decoration: none;
  font-size: 0.85em;
  align-items: center;
  color: #888;
  cursor: pointer;
  user-select: none;
  transform: rotateZ(-1deg);
}

.actions-panel a:hover {
  transition: transform 0.5s ease;
  transform: rotateZ(3deg);
}
.actions-panel span,
.actions-panel .freespace {
  display: none;
}

@media screen and (min-width: 500px) {
  .editor-container {
    min-width: 500px;
    margin: 0;
    grid-template-rows: 10% 90%;
    grid-template-columns: auto 4em;
    height: 100%;
  }

  .editor-container .note-panel {
    grid-row: 1/3;
    grid-column: 1;
  }
  .actions-panel {
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr;
    grid-row: 1/3;
    grid-column: 2;
  }
}
@media screen and (min-height: 768px) and (min-width: 768px) {
  .editor-container {
    min-width: 768px;
    grid-template-rows: 5em calc(100% - 10em) 5em;
    grid-template-columns: 1fr;
  }
  .editor-container h2 {
    grid-column: 1;
    grid-row: 1;
    display: block;
    font-size: 1.8em;
    margin: 0%;
    padding: 0.8em;
  }
  .editor-container .note-panel {
    grid-row: 2;
    grid-column: 1;
  }
  .actions-panel {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row: 3;
    grid-column: 1;
  }
  .actions-panel a {
    font-size: 1.2em;
  }
}

@media screen and (min-height: 992px) and (min-width: 992px) {
  .editor-container {
    min-width: 992px;
    max-width: 1200px;
    grid-template-rows: 5em calc(100% - 5em) 5em;
    grid-template-columns: calc(100% - 120px) 120px;
    margin: 0 auto;
  }

  .editor-container .note-panel {
    grid-row: 2/3;
    grid-column: 1;
  }
  .actions-panel {
    grid-template-rows: 120px 120px 120px 120px auto;
    grid-template-columns: 1fr;
    grid-row: 2/3;
    grid-column: 2;
    font-size: 1em;
  }
  .editor-container .actions-panel a {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-around;
    align-content: center;
    max-height: 120px;
  }
  .actions-panel a span,
  .actions-panel .freespace {
    display: block;
    width: 100%;
  }
  .actions-panel a i {
    font-size: 1.3em;
  }
}

@media screen and (min-width: 1400px) {
  .editor-container {
    min-width: 992px;
    max-width: 1200px;
    grid-template-rows: 5em calc(100% - 5em) 5em;
    grid-template-columns: calc(100% - 120px) 120px;
    margin: 0 auto;
  }
  .editor-container .note-panel {
    grid-row: 2/3;
    grid-column: 1;
  }
  .actions-panel {
    grid-template-rows: 160px 160px 160px 160px;
    grid-template-columns: 1fr;
    grid-row: 2/3;
    grid-column: 2;
    font-size: 1em;
    align-content: flex-start;
  }
  .editor-container .actions-panel a {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-around;
    align-content: center;
    max-height: 120px;
  }

  .actions-panel a span,
  .actions-panel .freespace {
    display: block;
    width: 100%;
  }
  .actions-panel a i {
    font-size: 1.3em;
  }
}

.editor-container div,
a {
  height: 100%;
}

@media all and (orientation: landscape) {
  .actions-panel .action__undo {
    background: url("/img/undo.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .actions-panel .action__redo {
    background: url("/img/redo.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .actions-panel .action__save {
    background: url("/img/save.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .actions-panel .action__save.unsaved {
    background: url("/img/unsaved.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .actions-panel .action__home {
    background: url("/img/home.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

.actions-panel .action__undo {
  background: url("/img/undo.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 70%;
}
.actions-panel .action__redo {
  background: url("/img/redo.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 70%;
}
.actions-panel .action__save {
  background: url("/img/save.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 70%;
}
.actions-panel .action__save.unsaved {
  background: url("/img/unsaved.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 70%;
}
.actions-panel .action__home {
  background: url("/img/home.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 80%;
}
</style>
