<template>
  <q-item
    clickable
    class="nav-link"
    tag="a"
    
    :to="props.link && !props.action ? props.link : null" 
    @click="props.action ? props.action() : null"         
   
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>



<script setup>
defineOptions({
  name: 'NavLink'
})


const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  },   
  action: {
    type: Function,
    default: null    // Set action to null by default
  }
})



</script>

<style scoped>
.nav-link {
  margin: 6px 12px;
  border-radius: 14px;
  color: #51382b;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.52);
}
</style>
