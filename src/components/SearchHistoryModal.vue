
<template>
  <md-dialog id="searchHistoryModal" :md-active.sync="showSearchHistoryModal" :md-close-on-esc="false" :md-click-outside-to-close="false">
    <md-dialog-title>Search History</md-dialog-title>
    
    <md-dialog-content>
      <HistoryTable
        v-if="locationList"
        :computedTableData="computedTableData"
        :handleDeleteSearchHistory="handleDeleteSearchHistory"
        :checkedItems="checkedItems"
        :handleSelectAll="handleSelectAll"
        :handleSelect="handleSelect"
        @link-clicked="getAddressByInput"
        :selectAllChecked="selectAllChecked"
      />
      <Pagination 
        v-if="locationList"
        v-model="pagination"
        :page="pagination.page"
        :changePage="changePage"
        :pages="pages"
      />
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="hideModal">Close</md-button>
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import HistoryTable from './HistoryTable'
import Pagination from './Pagination'

export default {
  components: {
    HistoryTable,
    Pagination,
  },
  props: {
    showSearchHistoryModal: {
      type: Boolean,
      default: false
    },
    hideModal: {
      type: Function,
    },
    locationList: {
      type: Array,
    },
    perPageOptions: {
      type: Array,
    },
    pagination: {
      type: Object,
    },
    computedTableData: {
      type: Array,
    },
    changePage: {
      type: Function,
    },
    pages: {
      type: Number,
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
    getAddressByInput(dataValue) {
      this.$emit('link-clicked', dataValue)
    }
  }
}
</script>

<style>
.ui.modal.visible.active {
  margin-top: 15vh !important;
}

.ui.dimmer {
  background-color: rgba(0,0,0,.70);
}
</style>