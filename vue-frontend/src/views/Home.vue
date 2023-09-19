<template>
  <div>
    <top-bar></top-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import TopBar from '@/components/TopBar.vue';
  export default{
    name: 'home',
    components:{
      TopBar
    }
  }
</script>
