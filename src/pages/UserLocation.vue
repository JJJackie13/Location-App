<template>
  <div>
    <section class="ui two column centered grid" style="position:relative;z-index:1">
      <div class="column">
        <form class="ui segment large form">
          <div class="ui message red" v-show="error">{{error}}</div>
          <div class="ui segment">
            <div class="field">
              <div class="ui right icon input large" :class="{loading:searchSpinner}">
                <input id="searchInput" type="text" placeholder="Enter your address" v-model="address" ref="autocomplete"/>
                <i class="search icon link" @click="getAddressByInput"></i>
              </div>
            </div>
              <LocalTimer v-if="showTimer" :timeZone="timeZone"></LocalTimer>
          </div>
        </form>
      </div>
    </section>

    <section id="map"></section>
    <button 
      id="currentLocationButton" 
      class="ui button icon circular"
      @click="locatedButtonPressed" 
      data-tooltip="Current location" 
      data-position="right center"
      >
      <i class="location arrow icon large" :class="{ loading:spinner }" ></i>
    </button>
    <button 
      id="historyButton"
      class="ui button icon circular"
      :class="{ disabled: locationList.length === 0 }"
      @click="handleModalOpen"
      data-tooltip="Recents"
      data-position="right center"
      >
      <i class="history icon large"></i>
    </button>
    <SearchHistoryModal
      :showSearchHistoryModal="showSearchHistoryModal"
      :hideModal="hideModal"
      :locationList="locationList"
      :perPageOptions="perPageOptions"
      :pagination="pagination"
      :computedTableData="computedTableData"
      :changePage="changePage"
      :pages="pages"
      :handleDeleteSearchHistory="handleDeleteSearchHistory"
      :checkedItems="checkedItems"
      :handleSelectAll="handleSelectAll"
      :handleSelect="handleSelect"
      @link-clicked="getAddressByInput"
      :selectAllChecked="selectAllChecked"
    />
  </div>
</template>


<script>
import axios from 'axios'
import LocalTimer from '../components/LocalTimer'
import SearchHistoryModal from '../components/SearchHistoryModal'

const perPageOptions = [2, 5, 10]

export default {
  components: {
    LocalTimer,
    SearchHistoryModal,
  },
  

  data () {
    return {
      address: "",
      error: "",
      searchSpinner: false,
      spinner: false,
      showTimer: false,
      timeZone: "",
      showSearchHistoryModal: false,
      locationList: [],
      perPageOptions,
      pagination: { page: 1, perPage: perPageOptions[2] },
      checkedItems:[],
      selectAllChecked: false,
      mapMarkers: [],
    }
  },

  mounted () {
    let autocomplete = new google.maps.places.Autocomplete(
      this.$refs["autocomplete"], {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(43.6580439, -79.3828885)
        )
    })

    autocomplete.addListener("place_changed", () => {
      this.error = ""
      let place = autocomplete.getPlace()
      
      if (!place.geometry) {
        this.getAddressByInput()
      } else {
        this.getAddressFrom(place.geometry.location.lat(), place.geometry.location.lng())
      }
    })
  },

  methods: {  
    locatedButtonPressed () {
      this.spinner = true
      if (navigator.geolocation) {
        this.error = ""
        navigator.geolocation.getCurrentPosition(
          position => {
            this.getAddressFrom(position.coords.latitude, position.coords.longitude)
          },
          error => {
            this.error = "Unable to find your location, please type your address."
            this.spinner = false
          }
        )
      } else {
        this.error = error.message
        this.spinner = false
        alert('Geolocation is not supported by this browser.')
      }
    },

    getAddressByInput (dataValue) {
      const address = dataValue ? dataValue : this.address
      this.searchSpinner = true
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='
        + address +
        `&key=${process.env.VUE_APP_GOOGLE_MAP_API_KEY}`
      )
        .then(response => {
          if (response.data.error_message) {
            this.error = response.data.error_message
            console.log(response.data.error_message)
          } else {
            const results = response.data.results[0]
            this.address = results.formatted_address

            if (this.locationList.length === 0) {
              this.locationList.push({ 
                id: this.locationList.length.toString(),
                address: results.formatted_address,
                lat: results.geometry.location.lat,
                lng: results.geometry.location.lng,
              })               
            } else if (
              this.locationList.length > 0 &&
              results.formatted_address !== this.locationList[this.locationList.length - 1].address
            ) {
              this.locationList.push({
                id: this.locationList.length.toString(),
                address: results.formatted_address,
                lat: results.geometry.location.lat,
                lng: results.geometry.location.lng,
              })
            }
          }
          this.searchSpinner = false
          this.showUserLocationOnTheMap(response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng)
          axios.get('http://api.timezonedb.com/v2.1/get-time-zone', {
            params: {
              key: process.env.VUE_APP_TIMEZONEDB_API_KEY,
              format: 'json',
              by: 'position',
              lat: response.data.results[0].geometry.location.lat,
              lng: response.data.results[0].geometry.location.lng,
            },
          })
            .then(response => {
              const { zoneName } = response.data
              this.showTimer = true
              this.timeZone = zoneName
            })
            .catch(error => {
              console.error(error)
              alert('Error occurred while fetching the time zone and local time.')
            })
        })
        .catch(error => {
          this.error = error.message
          this.searchSpinner = false
          console.error(error.message)
          alert('Error occurred while searching for the location.')
        })
      if (dataValue) {
        this.showSearchHistoryModal = false
      }
    },

    getAddressFrom (lat, long) {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='
          + lat + ","
          + long + `&key=${process.env.VUE_APP_GOOGLE_MAP_API_KEY}`
        )
          .then(response => {
            if (response.data.error_message) {
              this.error = response.data.error_message 
              console.log(response.data.error_message)
            } else {
              const result = response.data.results[0]
              this.address = result.formatted_address
              if (this.locationList.length === 0) {
                this.locationList.push({
                  id: this.locationList.length.toString(),
                  address: result.formatted_address,
                  lat: result.geometry.location.lat,
                  lng: result.geometry.location.lng,
                })               
              } else if (
                this.locationList.length > 0 &&
                result.formatted_address !== this.locationList[this.locationList.length - 1].address
              ) {
                this.locationList.push({
                  id: this.locationList.length.toString(),
                  address: result.formatted_address,
                  lat: result.geometry.location.lat,
                  lng: result.geometry.location.lng,
                })
              }
            }
            this.spinner = false
            this.showUserLocationOnTheMap(response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng)
            // Fetch time zone and local time
            axios.get('http://api.timezonedb.com/v2.1/get-time-zone', {
              params: {
                key: process.env.VUE_APP_TIMEZONEDB_API_KEY,
                format: 'json',
                by: 'position',
                lat: lat,
                lng: long,
              },
            })
              .then(response => {
                const { zoneName } = response.data
                this.showTimer = true
                this.timeZone = zoneName
              })
              .catch(error => {
                console.error(error)
                alert('Error occurred while fetching the time zone and local time.')
              })
          })
          .catch(error => {
            this.error = error.message
            this.spinner = false
            console.error(error.message)
            alert('Error occurred while searching for the location.')
          })
    },

    showUserLocationOnTheMap (lat, long) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      this.locationList.forEach((locationListItem) => {
        const position = new google.maps.LatLng(locationListItem.lat, locationListItem.lng)
        const googleMarker = new google.maps.Marker({
          position,
          map,
          title: locationListItem.address,
        })

        this.mapMarkers.push(googleMarker)
      })
    },

    deleteMarker (lat, lng) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })
      this.locationList.forEach((locationListItem) => {
        const position = new google.maps.LatLng(locationListItem.lat, locationListItem.lng)
        const googleMarker = new google.maps.Marker({
          position,
          map,
          title: locationListItem.address,
        })

        this.mapMarkers.push(googleMarker)
      })
    },

    hideModal () {
      this.showSearchHistoryModal = false;
      this.checkedItems = []
    },

    handleModalOpen () {
      this.showSearchHistoryModal = true
    },

    changePage (val) {
      switch (val) {
        case 0: this.pagination.page = 1; break;
        case -1: this.pagination.page = (this.pagination.page > 1 ? this.pagination.page - 1 : this.pagination.page); break;
        case 1: this.pagination.page = (this.pagination.page < this.pages ? this.pagination.page + 1 : this.pagination.page); break;
        case this.pages: this.pagination.page = this.pages; break;
      }
    },

    handleDeleteSearchHistory () {
      if (this.checkedItems.length > 0) {
        const deleteAll = this.locationList.length === this.checkedItems.length
        const lat = deleteAll ? 43.6580439 : this.locationList[this.locationList.length - 1].lat
        const lng = deleteAll ? -79.3828885 : this.locationList[this.locationList.length - 1].lng
        this.locationList = this.locationList.filter(item => !this.checkedItems.includes(item.id))
        this.selectAllChecked = false
        if (deleteAll) {
          this.deleteMarker(lat, lng)
          this.address = ""
          this.showTimer = false
          this.timeZone = ""
        } else {
          this.deleteMarker()
        }
      }
      if (this.locationList.length === 0){
        this.showSearchHistoryModal = false;
        this.checkedItems = []
      }
    },
        
    handleSelect (e) {
      if (e.target.checked) {
        const newCheckedItems = [...this.checkedItems]
        newCheckedItems.push(e.target.value)
        this.checkedItems = newCheckedItems
      } else {
        this.checkedItems = this.checkedItems.filter(item => item !== e.target.value)
      }
    },

    handleSelectAll (e) {
      if (e.target.checked) {
        this.selectAllChecked = true
        let allCheckedItems = this.computedTableData.map(item => item.id)
        this.checkedItems = allCheckedItems
      } else {
        this.selectAllChecked = false
        this.checkedItems = []
      }
    },
  },

  computed: {
    computedTableData () {
      if (this.locationList.length <= 0) return []
      else {
        const firstIndex = (this.pagination.page - 1) * this.pagination.perPage
        const lastIndex = this.pagination.page * this.pagination.perPage
        return this.locationList.slice(firstIndex, lastIndex)
      }
    },
    pages () {
      const remainder = this.locationList.length % this.pagination.perPage
      if (remainder > 0) {
        return Math.floor(this.locationList.length / this.pagination.perPage) + 1
      } else {
        return this.locationList.length / this.pagination.perPage
      }
    }
  },
}
</script>

<style>
.ui.button {
  background-color: #448AFF;
  color: #ffffff;
}

.ui.button:hover {
  background-color: #1970CC;
  color: #ffffff;
}

.pac-icon {
  display: none;
}

.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.pac-item:hover {
  background-color: #ececec;
}

.pac-item-query {
  font-size: 16px;
}

#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #808080;
}

#historyButton,
#currentLocationButton {
  background-color: #ffffff;
  color: #448AFF;
  position: absolute;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  left: 20px;
}

#currentLocationButton {
  bottom: 110px;
}

#historyButton {
  bottom: 50px;
}

#historyButton:hover,
#currentLocationButton:hover {
  color: #1970CC;
}
</style>
