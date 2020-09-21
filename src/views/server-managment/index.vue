<template>
  <div class="page-container">
    <server-list 
      v-show="$route.params['id'] === 'list'" 
      @state-change="changeState"
    />

    <server-settings 
      v-if="$route.params['id'] !== 'list'" 
      @state-change="changeState" 
      :tab="stateParam" 
      :id="serverId"
    />
  </div>
</template>

<script>

  export default {
    data () {
      return {
        showList: true,
        showServer: true,

        filterStatus: 'ALL',
        filterSearch: '',
        filterGroup: 'ALL',

        state: 'list',
        serverId: null,
        stateParam: ''
      }
    },

    components: {
      serverList: () => import('./components/server-list.vue'),
      serverSettings: () => import('./components/server-settings.vue')
    },

    mounted () {
      if ((isNaN(this.$route.params['id'])
          || this.$route.params['id'].indexOf('.') !== -1)
          && this.$route.params['id'] !== 'list') {
        this.$router.push('/404')
      }
    },

    methods: {
      changeState (id, param) {
        if (!id) {
          this.state = 'list'
          return
        }
        this.$router.push('/servers/' + id)
        this.state = 'settings'
        this.serverId = id
        this.stateParam = param || ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 20px;
    padding-top: 0;

    .server-list {
      &__filters {
        display: flex;
        margin-bottom: 10px;

        .filter-status {
          margin-right: 20px;
        }

        .filter-search {
          max-width: 200px;
          margin-right: 10px;
          margin-left: auto;
        }

        .add-new-btn {
          margin-left: 20px;
        }
      }

      &__pagination {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }

      .table-icon {
        font-size: 20px;

        &.del-icon {
          color: red;
        }
      }
    }

    .server {
      color: #606266;

      .back-to-list-btn {
        margin: 15px 0px;
      }

      &__stat {
        display: grid;
        grid-template:  "a b" 
                        "c c";
        grid-template-columns: 1fr 1fr;        

        .stat-threat-total,
        .stat-threat-top,
        .stat-threat-plot {
          margin: 5px;
        }

        .stat-threat-total {
          grid-area: a;
          display: flex;
          justify-content: center;
          align-items: center;

          .header {
            font-size: 24px;
            font-weight: 500;

            text-align: center;
          }

          .count {
            font-size: 36px;
            font-weight: 300;

            text-align: center;
          }
        }

        .stat-threat-top {
          grid-area: b;
          max-width: 100%;
        }

        .stat-threat-plot {
          grid-area: c;
        }
      }

      &__action {
        display: grid;
        grid-template-columns: 1fr 50px 1fr 1fr;
        column-gap: 15px;

        .action-move {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          font-size: 34px;

          padding-top: 40px;

          i {
            margin: 5px 0;

            transition: all .2s ease-in;           

            &:hover {
              cursor: pointer;
              color: #409EFF;
              background-color: #f5f7fa;
            }
          }
        }

        .header {
          font-weight: 500;
          font-size: 20px;
          text-align: center;
          margin: 0;
          padding: 5px 0;
        }

        .action {
          border: 1px solid #e4e7ed;
          .header {
            background-color: #f5f7fa;
          }

          .action-select {
            width: 100%;
            overflow-y: hidden;

            border: 0;

            &:hover {
              cursor: pointer;
            }

            outline: none;
            option {
              min-height: 30px;
              display: flex;
              align-items: center;
              padding-left: 5px;
            }
          }
        }
      }

      &__whitelist {
        .container {
          border: 1px solid #e4e7ed;
          max-width: 500px;

          .header {
            font-weight: 500;
            font-size: 20px;
            text-align: center;
            margin: 0;
            padding: 5px 0;
            background-color: #f5f7fa;
          }

          .site-select {
            width: 100%;
            overflow-y: hidden;
            border: 0;
            outline: none;

            option {
              min-height: 30px;
              display: flex;
              align-items: center;
              padding-left: 5px;
            }
          }

          .footer {
            background-color: #f5f7fa;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            padding-right: 10px;
            
            i {
              font-size: 20px;
            }
          }
        }

        .new-element {
          max-width: 500px;
          margin-top: 10px;
          display: grid;
          grid-template-columns: 1fr 60px;
          column-gap: 10px;
        }
      }

      &__info {
        display: grid;
        grid-template-columns: 140px 1fr;
        font-size: 14px;

        .info {
          &-content,
          &-title {
            margin: 3px 0;
          }

          &-title {
            font-weight: bold;
          }
        }
      }
    }
  }
</style>

