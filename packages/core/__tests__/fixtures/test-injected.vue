<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
})
</script>
<template>
  <div>
    hello world123
    {{ a }}
  </div>
</template>

<script lang="ts" setup name="App">
const a = 1
</script>
