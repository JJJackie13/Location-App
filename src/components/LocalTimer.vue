<template>
  <div style="display:flex">
    <div id="timer">{{ currentTime }}</div>
    <div id="timeZone">{{currentDate}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: '',
      currentTime: '',
    };
  },
  props: {
    timeZone: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.updateClock();
    setInterval(this.updateClock, 1000);
  },
  methods: {
    updateClock() {
      const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: this.timeZone , timeZoneName: "short" }
      const timeOptions = { hour: "numeric", minute: "numeric", second: "numeric", timeZone: this.timeZone };
      const currentDate = new Date().toLocaleDateString('en-US', dateOptions)
      const currentTime = new Date().toLocaleTimeString('en-US', timeOptions)

      this.currentDate = currentDate
      this.currentTime = currentTime
    },
  },
}
</script>

<style scoped>
#timeZone {
  padding-top: 8px;
  padding-left: 4px;
  font-size: 16px;
}
#timer {
  padding-top: 4px;
  font-size: 32px;
  font-weight: 600;
}
</style>
