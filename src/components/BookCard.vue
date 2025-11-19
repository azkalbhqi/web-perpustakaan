<template>
    <div class="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-1">{{ book.title }}</h2>
      <p class="text-gray-600 text-sm mb-2">Author: {{ book.author }}</p>
      <p class="text-gray-600 text-sm mb-2">Category: {{ book.category }}</p>
  
      <div class="mt-3 flex justify-between items-center">
        <p class="text-sm font-semibold">
          Stock: <span :class="book.stock > 0 ? 'text-green-600' : 'text-red-500'">{{ book.stock }}</span>
        </p>
        <button
          class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Detail
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BookCard",
    props: {
      book: {
        type: Object,
        required: true,
      },
    },
  };
  </script>