<template>
  <div v-drag-n-line="{width, height, index, blocksCount}" :key="blocksCount" data-draggble class="AppBlock">
    <div :data-point-1="index" class="AppBlock__point AppBlock__point-1"></div>
    <div :data-point-2="index" class="AppBlock__point AppBlock__point-2"></div>
    <div :data-point-3="index" class="AppBlock__point AppBlock__point-3"></div>
    <div :data-point-4="index" class="AppBlock__point AppBlock__point-4"></div>
  </div>
</template>

<script>
export default {
  name: 'AppBlock',
  props: {
    index: {
      type: Number
    }
  },
  computed: {
    blocksCount() {
      return this.$store.state.blocksCount
    },
    width() {
      return this.$store.state.blockWidth
    },
    height() {
      return this.$store.state.blockHeight
    }
  }
}
</script>

<style>
  .AppBlock{
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #03A9F4;
    border: 3px solid #1976D2;
  }

  .AppBlock__point{
    position: absolute;
    background-color: tomato;
    z-index: 1;
    width: 16px;
    height: 16px;
    border-radius: 100%;
  }

  .AppBlock__point-1{
    top: 0;
    left: calc(50% - 8px);
  }

  .AppBlock__point-2{
    top: calc(50% - 8px);
    right: 0;
  }

  .AppBlock__point-3{
    left: calc(50% - 8px);
    bottom: 0;
  }

  .AppBlock__point-4{
    top: calc(50% - 8px);
    left: 0;
  }

  .AppBlock__line{
    pointer-events: none;
  }
</style>