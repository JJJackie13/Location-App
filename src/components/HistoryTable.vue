<template>
  <table class="ui celled padded table">
    <thead>
      <tr>
        <th>
          <div class="ui checkbox" data-tooltip="Select All" data-position="right center">
            <input type="checkbox" v-model="selectAllChecked" @input="handleSelectAll"><label></label>
          </div>
        </th>
      <th>
        Previous location history
        <a href="#" :class="{disabled: checkedItems.length === 0}" @click="handleDeleteSearchHistory" data-tooltip="Delete" data-position="right center">
          <i class="trash alternate icon red" :class="{disabled: checkedItems.length === 0}"></i>
        </a>
      </th>
    </tr></thead>
    <tbody>
      <tr v-for="(item, index) in computedTableData" :key="index">
        <td>
          <div class="ui checkbox">
            <input type="checkbox" :value="item.id" v-model="checkedItems" @input="handleSelect"><label></label>
          </div>
        </td>
        <td class="selectable">
          <a href="#" @click="getAddressByInput(item.address)">{{item.address}}</a>
        </td>
      </tr>
    </tbody>
  </table>


</template>

<script>

export default {
  props: {    
    computedTableData: {
      type: Array,
    },
    handleDeleteSearchHistory: {
      type: Function,
    },
    checkedItems: {
      type: Array,      
    },
    handleSelectAll: {
      type: Function,
    },
    handleSelect: {
      type: Function,
    },
    selectAllChecked: {
      type: Boolean,
    },
  },
  methods: {
    getAddressByInput (dataValue) {
      this.$emit('link-clicked', dataValue)
    }
  }
}
</script>
