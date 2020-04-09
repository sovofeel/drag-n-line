<template>
  <div class="ControlPanel">
    <input type="text" v-model="blocksCount" :placeholder="`Колличество блоков ${blocksCount}`">
  </div>
</template>

<script>
export default {
  name: 'ControlPanel',
  computed: {
    blocksCount: {
      get() {
        return this.$store.state.blocksCount
      },
      set(payload) {
        this.$store.commit('SET_BLOCK_COUNT', +payload)
      }
    },
  }
}
</script>

<style>
  .ControlPanel{
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 70px;
    background-color: #fff;
  }
</style>