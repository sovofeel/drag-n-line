<template>
  <div id="AppField" class="AppField">
    <AppBlock v-for="(block, index) in blocksCount" :key="index" :index="index"/>
  </div>
</template>

<script>
import AppBlock from './AppBlock'

export default {
  name: 'AppField',
  components: {
    AppBlock
  },
  computed: {
    blocksCount() {
      return this.$store.state.blocksCount
    },
  }
}
</script>

<style>
  .AppField{
    position: relative;
    display: flex;
    background-color: #3e464c;
    width: 100vw;
  }
</style>