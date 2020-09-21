<template>
  <div 
    class="reporting" 
    v-loading="isLoading"
    :key="keys"
  >
    <div class="settings-title synch">
      Download statistics report (pdf)
    </div>
    <div class="sync-container">
      <div class="title synch">
        Select timeframe
      </div>
      <el-select
        v-model="syncTimeValue"
        default-first-option
        placeholder="Choose or write time"
      >
        <el-option
          v-for="item in syncData"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        >
        </el-option>
      </el-select>

      <el-tooltip 
        class="item" 
        effect="dark" 
        content="There is no data for the report because the server is not logging or not enough data" 
        placement="bottom"
      >
        <el-button
          :loading="isLoading"
          v-if="isGenerate && !isLogging && !checkDataLength"
          class="disabled-button"
        >
          Generate
        </el-button>
      </el-tooltip>

      <el-button
        :loading="isLoading"
        v-if="isGenerate && isLogging && checkDataLength"
        class="print-button" 
        type="primary" 
        @click="handleGeneratePreviewDev"
      >
        Generate
      </el-button>
    </div>
  </div>
</template>

<script>
  import baseUrl from "@/api/config"
  import store from '@/store/index.js'
  import axios from 'axios'
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  export default {
    props: {
      server: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        isLoading: false,
        isLoadingTimer: false,
        isGenerate: true,

        isLogging: false,
        graph: {},

        keys: 1,

        checkDataLength: null,

        currentPeriod: '24 hours',

        syncTimeValue: 1,
        syncData: [
          {
            id: 1,
            label: '24 hours'
          },
          {
            id: 2,
            label: '7 days'
          },
          {
            id: 3,
            label: '30 days'
          },
        ],

        fixer: '99%',

        noStatMessage: '',
        noStatMessageAverage: '',
        noStatMessageMemory: '',
      }
    },

    mounted() {
      this.getGraphicData()
    },

    methods: {
      getGraphicData() {
        this.isLoading = true
        SPPCloudApi
          .getGraphicStatistic(this.server.id, this.timeInterval || 24)
            .then(result => {

              this.isLogging = result.isLogging

              this.graph = result.graph

              if (result.isLogging && result.graph.load5min.length > 0) {
                this.lastTimeSync = result.last_sync

                this.checkDataLength = true

                if (result.graph.threads_blocked && result.graph.threads_blocked.js_tread.length > 0) {
                  this.isHiddenGraphicBlocked = false
                  this.noStatMessage = ''
                } else {
                }
              } else {
                this.isLogging = false
                this.checkDataLength = false
              }
              this.isLoading = false
            })
            .catch(err => {
              console.log('error', err)
              this.errMessage = handleError(this, err)
            })
            .finally(_ => {
              this.isLoading = false
            })
      },

      handleGeneratePreviewDev() {

        switch(this.syncTimeValue) {
          case 1:
            this.currentPeriod = '24 hours'
            break
          
          case 2:
            this.currentPeriod = '7 days'
            break

          case 3:
            this.currentPeriod = '30 days'
            break

          default:
            break
        }

        switch(this.syncTimeValue) {
          case 1:
            this.timeInterval = 24
            break
          
          case 2:
            this.timeInterval = 168
            break

          case 3:
            this.timeInterval = 720
            break

          default:
            break
        }
        let routeData = this.$router.resolve({path: '/generate-pdf', query: { 
          server: this.server.id, interval: this.timeInterval, period: this.currentPeriod, 
        } });
        window.open(routeData.href, '_blank');
      },

    },

    computed: {
      logoSrc () {
        return require('@/assets/images/logo_03.png')
      },
    }
  }
</script>

<style lang="scss">
.el-input__inner {
  height: 35px;
}
.el-input__icon {
  line-height: 0;
}
</style>

<style lang="scss" scoped>
.reporting {
  .settings-title {
    margin: 3px 0;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  .synch {
    margin: .2rem .9rem .4rem 0;
  }
  .sync-container {
    display: flex;
    margin: 10px 0;

    .title {
      margin: 3px 0;
      display: flex;
      align-items: center;
    }
    .synch {
      margin: .4rem .9rem .4rem 0;
    }
  }

  .disabled-button {
    cursor: not-allowed;
    margin-left: 1rem;
    padding: 8px 15px;

    .icon {
      margin-right: .3rem;
    }
  }

  .print-button {
    margin-left: 1rem;
    padding: 8px 15px;

    .icon {
      margin-right: .3rem;
    }
  }
}
</style>
