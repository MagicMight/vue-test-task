<template>
  <div class="taskitem" :class="{ completed: isComplete }">
    <button v-if="!preview" @click="$emit('remove-task', task_id)">
      <i class="remove-task-img"></i>
    </button>

    <span :title="task.title" v-if="!editMode" @click="switchMode">{{
      task.title
    }}</span>

    <input
      type="text"
      ref="task-editor"
      v-model="task.title"
      v-if="editMode && !preview"
      @blur="switchMode"
    />

    <input
      type="checkbox"
      class="checkbox"
      v-if="!preview"
      v-model="isComplete"
      @change="completeTask"
    />
  </div>
</template>

<script>
export default {
  props: ["task", "preview"],
  data() {
    return {
      task_id: this.task.id,
      editMode: false,
      lastTitle: this.task.title
    };
  },
  methods: {
    // Переключение между режимами редактирования/отображения элемента тасклиста
    // и установка автофокуса в поле редактирования
    switchMode() {
      this.editMode = !this.editMode && !this.preview;
      if (this.editMode) {
        this.$nextTick(() => {
          // Сохраняем текущее состояние в пул изменений
          this.$emit("register-state");
          this.$refs["task-editor"].focus();
        });
      } else {
        // Если после выхода из режима редактирования не изменилось описание,
        // то удаляем последнее действие из пула
        if (this.lastTitle === this.task.title) {
          this.$emit("drop-last-state");
        } else {
          this.lastTitle = this.task.title;
        }
      }
    },
    completeTask() {
      this.$emit("register-state");
      this.task.isComplete = !this.task.isComplete;
      this.$emit("complete-task", this.task.id, this.isComplete);
    }
  },

  computed: {
    isComplete: {
      get: function() {
        return this.task.isComplete;
      },
      set: function() {
        this.task.isComplete = !this.task.isComplete;
      }
    }
  }
};
</script>

<style scoped>
.taskitem:not(.preview) {
  padding: 0.4em 0.5em;
  display: grid;
  grid-template-columns: minmax(5%, 1fr) minmax(90%, 20fr) minmax(5%, 1fr);
  justify-content: space-between;
  margin-top: 0.3em;
  background: url("/img/checkbox.jpg"), url("/img/b_bottom.jpg");
  background-size: 1.8em 1.8em, auto 0.9em;
  background-repeat: no-repeat, repeat-x;
  background-position: 98% center, left 90%;
}
.taskitem.completed {
  background: url("/img/checkbox_ok.jpg"), url("/img/b_bottom.jpg");
  background-size: 1.8em 1.6em, auto 0.9em;
  background-repeat: no-repeat, repeat-x;
  background-position: 98% 83%, left 90%;
}
.preview .taskitem:not(.completed) {
  grid-template-columns: 1fr;
  background: url("/img/b_bottom.jpg");
  background-size: auto 0.9em;
  background-repeat: repeat-x;
  background-position: left 90%;
}
.preview .taskitem.completed {
  grid-template-columns: 1fr;
  background: url("/img/ok.jpg"), url("/img/b_bottom.jpg");
  background-size: 1.3em 1.3em, auto 0.9em;
  background-repeat: no-repeat, repeat-x;
  background-position: 97% 83%, left 90%;
}
.taskitem button {
  border: none;
  background: none;
}
.taskitem button:focus {
  border: none;
  outline: none;
}
.taskitem input[type="text"]:focus {
  border: none;
  outline: none;
  padding: 1em;
  font-size: 1em;
  background-color: rgba(221, 221, 221, 0);
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
}

span {
  margin-left: 1em;
  justify-self: left;
  align-self: flex-end;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80%;
  text-align: left;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
}
input.checkbox {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin: 0;
  justify-self: center;
  align-self: center;
  padding: 0px;
  opacity: 0;
}

i.remove-task-img {
  display: block;
  height: 1.2em;
  width: 1.2em;
  background: url("/img/cross.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
