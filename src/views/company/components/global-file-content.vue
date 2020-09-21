<template>
  <div class="global-file-content-container">
    <div class="description">
      <strong>Description:</strong> {{ file.description }}<br/><br/>
      <br/><br/>

      <el-button
        @click="downloadFile"
        size="mini"
        type="success"
        class="download-btn">
        Download file
      </el-button>
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  import baseUrl from '@/api/config.js'

  export default {
    props: [
      'file'
    ],

    data () {
      return {
        loading: false,
        errMessage: null
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    methods: {
      updateFile () {
        // ...
      },

      downloadFile () {
        SPPCloudApi
          .downloadActionFile(this.file.block_list_id, this.file.name)
          .then()
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
      }
    }
  }
</script>

<style lang="scss">
  .global-file-content-container {
    .el-table td {
      padding: 7px 0;
    }
  }
</style>

<style lang="scss" scoped>
  .global-file-content-container {
    max-width: 500px;
    display: grid;
    grid-gap: 75px;

    .check {
      display: grid;
      grid-template-columns: 5fr 1fr;
      grid-gap: 10px;

      .header {
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }

    .download-btn {
      margin-right: auto;
    }
  }
</style>
