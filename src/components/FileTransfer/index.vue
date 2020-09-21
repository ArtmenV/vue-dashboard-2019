<template>
  <div class="file-transfer">
    <div class="files-list used">
      <div class="header">
        {{ $route.path.includes('/templates') ? "Template" : 'Threatlists in use' }}
      </div>

      <div :value="getArrayOfAllCollapseItemsNames(data.used)">
          <div
            class="file"
            v-for="category in data.used"
            :key="category.name"
            :name="category.name"
          >
            <file-item
              v-for="file in category.items"
              :key="file.id"
              place="used"
              :name="file.name"
              :id="file.id"
              :state="selected.used.indexOf(file.id) !== -1"
              :type="file.environment"
              @change="handleFileStateChange"
            />
          </div>
      </div>
    </div>

    <!-- Buttons to transfer files -->
    <div class="file-move">
      <el-button
        type="primary"
        icon="el-icon-arrow-right"
        class="move-btn"
        circle
        plain
        :disabled="selected.used.length === 0"
        @click="emitFileTransfer('to-right')"
      ></el-button>

      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        class="move-btn"
        circle
        plain
        :disabled="selected.available.length === 0"
        @click="emitFileTransfer('to-left')"
      ></el-button>
    </div>

    <!-- Available files -->
    <div class="files-list available">
      <div class="header">
        Threatlists available
      </div>

      <el-collapse :value="getArrayOfAllCollapseItemsNames(data.available)">
        <el-collapse-item
          v-for="category in data.available"
          :key="category.name"
          :name="category.name"
        >
          <template slot="title">
            <div class="category-title" style="font-weight: bold;">
              {{ category.name }}
            </div>
          </template>

          <div
            class="file"
            v-for="file in category.items"
            :key="file.id"
          >
            <file-item
              place="selected"
              :name="file.name"
              :id="file.id"
              :state="selected.available.indexOf(file.id) !== -1"
              :type="file.environment"
              @change="handleFileStateChange"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- File's description -->
    <div class="file-description">
      <div class="help-text" style="margin-bottom: 20px;" v-if="$route.path.includes('/templates')">
        Combine several threatlists into Template
      </div>

      <div class="help-text" style="margin-bottom: 20px;" v-if="$route.path.includes('/company')">
        Choose and add threatlists that will be applied to all the servers on your account at once!
      </div>

      <h2 class="header">
        Threatlist Store:
      </h2>

      <p class="description">
        <i class="material-icons-outlined type-icon">business</i> Business and Education –
        Threatlists in this category are designed to remove unwanted elements with very 
        careful consideration not to break websites. 
      </p>

      <p class="description">
        <i class="material-icons-outlined type-icon">home</i> Home – Threatlists in this category
        are designed to remove unwanted elements very aggressively and may include lists
        which block entire domains, corporations, categories, etc. 
      </p>

      <p class="description">
        Custom – threatlists created by you.
      </p>

      <h2 class="header" v-if="selectedFile">
        Threatlist description:
      </h2>

      <p class="description" v-loading="loading" v-if="selectedFile">
        {{ description }}<br/>

        <el-button
          @click="downloadFile"
          size="mini"
          type="success"
          class="download-btn"
          style="margin-top:10px;">
          Download file
        </el-button>
      </p>

      <div class="additional-info">
        All threatlists are free and open source and contain links back to the maintainers.
        Next Vector Security does not charge for the use of threatlists, only for the server
        resources, bandwidthm and developer support it takes to create and run this website.
        We encourage you to support threatlist maintainers if you feel a list is particularly
        helpful in securing your network.
      </div>
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  import 'material-design-icons/iconfont/material-icons.css'

  export default {
    props: ['data'],

    components: {
      FileItem: () => import('./FileItem.vue')
    },

    data () {
      return {
        selected: {
          used: [],
          available: []
        },

        loading: false,

        description: '',
        downloadFileId: '',
        downloadFileName: '',
        isDownloadEnable: false,

        errMessage: null
      }
    },

    computed: {
      selectedFile () {
        if (this.selected.used.length === 1 && this.selected.available.length === 0) {
          return this.selected.used
        } else if (this.selected.used.length === 0 && this.selected.available.length === 1) {
          return this.selected.available
        } else {
          return null
        }
      }
    },

    watch: {
      selectedFile (val) {
        if (val) {
          this.updateDescription(val)
        }
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    methods: {
      getArrayOfAllCollapseItemsNames (files) {
        if (!files.length) return []

        return files.reduce((acc, cur) => {
          acc.push(cur.name)
          return acc
        }, [])
      },

      handleFileStateChange (id, state, place) {
        let selected = (place === 'used') ? this.selected.used : this.selected.available
        
        if (state) {
          selected.length = 0
          selected.push(id)
        } else {
          const index = selected.indexOf(id)

          if (index !== -1) {
            selected.splice(index, 1)
          }
        }
      },

      emitFileTransfer (direction) {
        const from = (direction === 'to-right') ? this.selected.used : this.selected.available
        this.$emit('transfer', direction, from)
        from.length = 0
      },

      updateDescription (id) {
        this.loading = true
        
        SPPCloudApi
          .getActionFileInfo(id)
          .then(r => {
            this.description = r.description
            this.downloadFileName = r.name
            this.downloadFileId = r.block_list_id
            this.isDownloadEnable = r.is_global

            this.loading = false
          })
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
      },

      downloadFile () {
        SPPCloudApi
          .downloadActionFile(this.downloadFileId, this.downloadFileName)
          .then()
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
      }
    }
  }
</script>

<style lang="scss">
  .files-list {
    .el-collapse-item__wrap {
      border-bottom: none;
    }

    .el-collapse-item__header {
      border-bottom: none;
      line-height: 25px;
      height: 25px;
      padding-right: 5px;
      user-select: none;
    }

    .el-collapse-item__arrow {
      line-height: 25px;
    }
  }

  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url('/static/fonts/iconfont/MaterialIcons-Regular.eot'); /* For IE6-8 */
    src: local('Material Icons'),
      local('MaterialIcons-Regular'),
      url('/static/fonts/iconfont/MaterialIcons-Regular.woff2') format('woff2'),
      url('/static/fonts/iconfont/MaterialIcons-Regular.woff') format('woff'),
      url('/static/fonts/iconfont/MaterialIcons-Regular.ttf') format('truetype');
  }

  .material-icons-outlined {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
</style>

<style lang="scss" scoped>
  .file-transfer {
    display: grid;
    grid-template-columns: 2fr 50px 2fr 3fr;
    grid-gap: 10px;
    min-height: 492px;

    .file-move {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      padding-top: 30px;

      .move-btn {
        margin: 5px 0;
      }
    }

    .files-list {
      border: 1px solid #e4e7ed;

      height: 620px;
      overflow-y: auto;
      padding-bottom: 20px;

      .header {
        text-align: center;
        width: 100%;
        padding: 5px 0;
        text-align: center;

        background-color: #f5f7fa;
        color: #303133;
        font-size: 18px;
      }
      
      .category-title {
        padding-left: 10px;
      }
    }

    .file-description {
      color: #303133;
      padding: 0 10px;
      font-size: 15px;

      .header {
        margin: 0;
        font-weight: normal;
        font-size: 20px;
      }

      p + .header {
        margin-top: 50px;
      }

      .type-icon {
        font-size: 15px;
        transform: translateY(2px)
      }

      .additional-info {
        margin-top: 40px;
      }
    }
  }
</style>
