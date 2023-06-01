<template>
  <section>
    <p class="pagination-container">
      <i class="fal angle double left icon" @click="changePage(0)"></i>
      <i class="fal angle left icon" @click="changePage(-1)"></i>
      <span class="inner-pagination-content">
        Page {{ page }} of {{ pages }}
      </span>
      <i class="fal angle right icon" @click="changePage(1)"></i>
      <i class="fal angle double right icon" @click="changePage(pages)"></i>
          
    </p>
  </section>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
    },
    changePage: {
      type: Function,
    },
    pages:{
      type: Number,
    },
  }
}
</script>

<style>

.pagination-container {
  display: flex;
  justify-content: flex-end;
  color: #444;
  margin-right: 20p
}

.fal {
  width: 20px;
  color: #2997ff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2.5px;
  cursor: pointer;
}

</style>