<!--

	В режиме превью (отображения на главной странице) выводятся только 
	первые 5 пунктов из списка и отключена возможность изменения списка.

-->

<template>
  <div class="task-list">
    <button
      v-if="!preview"
      @click="$emit('create-task')"
      class="create-task-button"
    >
      Добавить задачу
    </button>

    <TaskItem
      v-for="task of preview ? tasks.slice(0, 5) : tasks"
      :key="task.id"
      :task="task"
      :preview="preview"
      @remove-task="removeTask"
      @register-state="$emit('register-state')"
      @drop-last-state="$emit('drop-last-state')"
      @complete-task="completeTask"
    />
    <span class="no-tasks" v-if="tasks.length == 0">Список дел пуст!</span>
  </div>
</template>

<script>
import TaskItem from "@/components/TaskItem";
export default {
  props: ["tasks", "preview"],
  components: { TaskItem },
  methods: {
    removeTask(id) {
      this.$emit("remove-task", id);
    },
    completeTask(id, status) {
      this.$emit("complete-task", { task_id: id, status: status });
    }
  },
  created() {}
};
</script>

<style scoped>
.task-list {
  display: block;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}

.task-list .taskitem:last-child {
  margin-bottom: 5em;
}
.preview .task-list {
  overflow: hidden;
  width: 85%;
  margin: 0% auto;
}
.no-tasks {
  height: 100%;
  font-size: 0.7em;
  margin-top: 0.2em;
}
.task-list .create-task-button {
  transition: transform 0.5s ease;
  border: none;
  background: url("/img/newtask.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: block;
  font-size: 1em;
  padding: 0.6em;
  width: 15em;
  max-width: 80%;
  height: 4em;
  margin: 1em auto;
  transform: rotateZ(0deg);
}
.task-list button:hover {
  transition: transform 0.5s ease;
  transform: rotateZ(1deg);
}
</style>
