<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class=" min-h-screen bg-linear-to-br from-blue-600 to-indigo-900">
    <header>
      <Navbar />
    </header>
    
    <RouterView />
  </div>
  </template>

<style>
  @import '@/assets/main.css';
</style>

