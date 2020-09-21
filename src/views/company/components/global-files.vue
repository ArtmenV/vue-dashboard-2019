<template>
  <div class="global-files-container">
    <file-list
      v-if="list"
      class="list"
      :list="list"
      @selected-file-changed="handleSelectedFileIdChanged"
    />

    <div
      class="file-content"      
    >
      <global-file-content
        v-if="selectedFile"
        :file="selectedFile"
        :id="selectedFileId"
      />
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        loading: false,

        selectedFileId: -1,

        selectedFile: null,

        fakeList: [
          {id: 1, name: 'Malware'},
          {id: 2, name: 'Piehole'},
          {id: 3, name: 'Porn'},
          {id: 4, name: 'Ads'},
          {id: 5, name: 'Casinos'}
        ],

        list: null,

        fileDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
          mollit anim id est laborum.`,
      
        errMessage: null
      }
    },

    components: {
      FileList: () => import('./file-list'),
      GlobalFileContent: () => import('./global-file-content')
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    mounted () {
      this.loading = true

      SPPCloudApi
        .getCloudFiles()
        .then(r => {
          this.list = r.items
          this.loading = false
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
        })
    },

    methods: {
      updateFileDescription () {
        // this.fileDescription = 
      },

      handleSelectedFileIdChanged (file) {
        this.selectedFile = file
        this.updateFileDescription()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .global-files-container {
    display: grid;
    grid-template-columns: 2fr 5fr;
    grid-gap: 10px;

    min-height: 231px;

    .file-content {
      padding: 5px 10px;
    }
  }
</style>
