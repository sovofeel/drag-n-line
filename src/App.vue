<template>
  <div id="app">
    <AppField />
    <ControlPanel />
  </div>
</template>

<script>
import AppField from '@/components/AppField'
import ControlPanel from '@/components/ControlPanel'

export default {
  name: 'App',
  components: {
    AppField,
    ControlPanel
  }
}
</script>

<style>
#app{
  display: flex;
  flex-direction: column;
}
</style>
