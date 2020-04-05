<template>
  <div class="note" :class="{ preview }">
    <div class="panel" :title="note.title">
      <input
        type="text"
        v-model="note.title"
        @focus="renameNote('before')"
        @blur="renameNote('after')"
        class="note-title"
        :disabled="preview"
      />

      <router-link
        :to="{ name: 'NoteEditor', params: { id: note.id } }"
        v-if="preview"
      >
        <button class="edit" title="Редактировать заметку">
          <i class="edit-note-button"></i>
        </button>
      </router-link>

      <button class="remove" @click="removeNote" title="Удалить заметку">
        <i class="remove-note-button"></i>
      </button>
    </div>
    <TaskList
      :tasks="note.tasks"
      :preview="preview"
      @remove-task="removeTask"
      @create-task="$emit('create-task')"
      @register-state="$emit('register-state')"
      @drop-last-state="$emit('drop-last-state')"
      @complete-task="completeTask"
    />
  </div>
</template>

<script>
import TaskList from "@/components/TaskList";
export default {
  props: ["note", "preview"],
  components: { TaskList },
  methods: {
    removeTask(id) {
      this.$emit("remove-task", id);
    },

    // Переименование заметки с возможностью отката изменений
    renameNote(step = "before") {
      if (step === "before") {
        this.$emit("register-state");
      }
      if (step === "after") {
        if (this.note.title === this.previousTitle) {
          this.$emit("drop-last-state");
        } else {
          this.previousTitle = this.note.title;
        }
      }
    },

    removeNote() {
      this.$emit("remove-note", this.note.id);
    },

    completeTask(params) {
      params.note_id = this.note.id;
      this.$emit("complete-task", params);
    }
  },

  computed: {
    previousTitle: {
      get: function() {
        return this.title;
      },
      set: function(title) {
        this.title = title;
      }
    }
  },

  created() {
    this.previousTitle = this.note.title;
  }
};
</script>

<style scoped>
.note {
  height: 17em;
  text-overflow: ellipsis;
  margin-top: 0px;
  width: 95%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3em auto;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  overflow: hidden;
}
.note.preview {
  transition: transform 0.25s ease-in-out;
  margin: 0.5em 0em;
  background: url("/img/bgnote3.png"), #fff;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.note.preview:nth-child(2n) {
  transform: rotateZ(1deg);
}
.note.preview:nth-child(2n + 1) {
  transform: rotateZ(-1deg);
}
.note.preview:hover {
  transition: transform 0.35s ease-in-out;
  transform: rotateZ(0deg);
}

.panel {
  display: grid;
  grid-template-columns: 9fr 1fr;
  text-overflow: ellipsis;
  border-bottom: 1px solid #ccc;
}
.preview .panel {
  grid-template-columns: 1fr auto auto;
  grid-template-columns: auto 2em 2em;
  grid-template-columns: 74% 13% 13%;
  justify-self: left;
  padding-top: 0.4em;
  padding: 0em 4%;
  width: 95%;
  overflow: hidden;
}

.note .note-title {
  border: none;
  padding-left: 1em;
  background-color: rgba(255, 255, 255, 0);
  font-size: 1em;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 600;
}
.note .note-title:focus {
  outline: none;
  border: none;
}
span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
  padding: 0em 0.4em;
  align-content: center;
  align-self: center;
}
a {
  text-decoration: none !important;
}
.panel button {
  transition: opacity 0.2s linear;
  border: none;
  background: none;
  opacity: 0.55;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

button:hover {
  transition: opacity 0.1s linear;
  opacity: 1;
}
.panel i {
  display: block;
  height: 1.4em;
  width: 1.4em;
  align-self: center;
}
.panel i.remove-note-button {
  background: url("/img/cross.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.panel i.edit-note-button {
  background: url("/img/edit.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
