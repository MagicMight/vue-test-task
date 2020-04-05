<template>
  <div class="home">
    <h2>Все заметки</h2>
    <div class="create-new" @click="$emit('create-note')"></div>
    <h2 class="empty" v-if="!notes.length">
      Пока не создано ни одной заметки!
    </h2>
    <Note
      v-for="note of notes"
      :key="note.id"
      :preview="true"
      :note="note"
      @remove-note="$emit('remove-note', note.id)"
    />
    <div class="flex-fillers note"></div>
    <div class="flex-fillers note"></div>
    <div class="flex-fillers note"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import Note from "@/components/Note";
export default {
  name: "Home",
  props: ["notes"],
  components: { Note }
};
</script>

<style scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 1500px;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  min-width: 300px;
  min-height: 100%;
  background-color: rgba(255, 255, 255, 0.966);
  align-content: flex-start;
  border-right: 1px dashed #ccc;
  border-left: 1px dashed #ccc;
}
.home h2 {
  align-self: baseline;
  font-family: "Kwixter Sketch" !important;
  font-size: 1.8rem !important;
  font-weight: normal;
  width: 100%;
}
.home .note,
.home .create-new {
  min-width: 200px;
  max-width: 400px;
  width: 90%;
  margin: 0.75em 1%;
  background-color: #fff;
}
@media screen and (min-width: 576px) {
  .home {
    min-width: 550px;
    max-width: 720px;
  }
  .home .note,
  .home .create-new {
    width: 47%;
    margin: 0.75em 1%;
  }
}
@media screen and (min-width: 768px) {
  .home {
    min-width: 740px;
    max-width: 1400px;
  }
  .home .note,
  .home .create-new {
    width: 300px;
    min-width: 20em;
    margin: 0.75em 1%;
  }
}
@media screen and (min-width: 1600px) {
  .home {
    min-width: 1400px;
    max-width: 1500px;
  }
}

.create-new {
  transition: all 0.6s ease-in;
  height: 17em;
  overflow: hidden;
  background: url("/img/idea.png"), url("/img/bgnote3.png");
  background-size: contain, 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
}
.create-new:hover {
  transition: all 0.3s ease-in;
  transform: rotateZ(-2.5deg);
  -webkit-filter: grayscale(0%);
  -moz-filter: grayscale(0%);
  -ms-filter: grayscale(0%);
  -o-filter: grayscale(0%);
  filter: grayscale(0%);
}

.create-new::after {
  transition: top 0.3s ease;
  display: block;
  content: "Есть идея!";
  position: relative;
  top: 100%;
  height: 2em;
  width: 90%;
  margin: 0 auto;
  padding-top: 1em;
  background-color: rgba(255, 255, 255, 0.897);
  font-size: 1.2em;
}
.create-new:hover::after {
  transition: top 0.3s ease;
  top: calc(100% - 4em);
}
.create-new i {
  font-size: 7em;
  align-items: center;
  justify-content: center;
  display: flex;
  opacity: 0.4;
}
</style>
