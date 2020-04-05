<template>
  <div class="overflow">
    <div class="modal">
      <div><h5>Необходимо подтверждение</h5></div>
      <div class="body">
        <h2>{{ config.text }}</h2>
        <a href="#" class="accept" @click="$emit('modal-callback')">&nbsp;</a>
        <a href="#" class="decline" @click="config.show = false"></a>
      </div>
      <div>
        <h6>{{ config.warning }}</h6>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: ["config", "modal-callback"]
};
</script>

<style scoped>
.overflow {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(179, 183, 187, 0.568);
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
}

.modal {
  box-shadow: 0px 0px 3px 2px rgba(238, 240, 233, 0.062);
  border-radius: 1em;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 5fr auto;
  grid-template-columns: 1fr;
  width: 95%;
  max-width: 95vw;
  max-height: 90vh;
  align-self: center;
  background: url("https://www.onlygfx.com/wp-content/uploads/2018/04/rectangle-scribble-frame-4.png"),
    rgb(255, 255, 255);
  background-size: 105% 107%;
  background-position: center;
  background-repeat: no-repeat;
}
.modal .body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  border-top: 1px solid rgba(196, 176, 176, 0.527);
  width: 95%;
  justify-self: center;
}

.modal .body h2 {
  width: 100%;
  margin: 4vmin 0;
  grid-row: 1/1;
  grid-column: 1/3;
  font-size: 4vmin;
}
.modal .body a {
  display: block;
  border-radius: 0.5em;
  margin: 0 auto;
  color: #fff;
  text-decoration: none;
  height: auto;
  width: 60%;
  padding: 0;
}
.modal h5,
.modal h6 {
  font-size: 2.5vmin;
}
@media (min-width: 576px) {
  .modal {
    max-width: 600px;
  }
  .modal .body h2 {
    margin: 1.3em 0;
    font-size: 1.2em;
  }
  .modal .body a {
    justify-self: center;
    padding: 1.1em;
  }
  .modal h5,
  .modal h6 {
    font-size: 0.8em;
  }
}

.modal h2 {
  color: rgb(105, 91, 91);
}
.modal h6 {
  color: rgb(116, 108, 108);
}
/* .modal > div { 					background-color: rgb(255, 255, 255) } */
.modal .body a.accept {
  background: url("/img/accept.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.modal .body a.decline {
  background: url("/img/decline.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
