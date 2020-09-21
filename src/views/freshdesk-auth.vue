<template>
  <div class="page">
    You will be redirected to forums in a few seconds...
  </div>
</template>

<script>
import SPPCloudApi from '@/api/cloud-api.js'
import handleError from '@/utils/errorHandler.js'

export default {
  mounted () {
    SPPCloudApi.freshdeskAuth()
      .then(r => {
        window.location.href = r.data.result.url
      })
      .catch(e => {
        window.location.href = e.response.data.result.url
      })
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}
</style>
