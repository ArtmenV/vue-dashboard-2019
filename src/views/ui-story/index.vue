<template>
  <div class="story-book" v-if="isHidden">
    <div class="container">
      <h1 style="color: red">URGENT: DELETE THIS WHEN WE TO OUT LIVE</h1>
      <div class="header">
        <h1>UI-GUIDE</h1>
        <div></div>
      </div>
      <section class='text-section'>

        <!-- text basic -->
        <h4 class="sub-title">Text basic</h4>
        <div>
          <div class="basic-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </div>

          <div class="css-container">
            <div class="basic">
              {
                font-family: Helvetica Neue;
                font-size: 16px;
              }
            </div>
          </div>
        </div>
        <!-- page title -->
        <h4 class="sub-title">Page title</h4>
        <div>
          <div>
            <h1 class="header">Server list</h1>
          </div>

          <div class="css-container">
            <div class="basic">
              {
                font-family: Helvetica Neue;
                font-size: 24px;
                font-weight: bold;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Title section</h4>
        <div>
          <div>
            <h1 class="title-section">Account information</h1>
          </div>

          <div class="css-container">
            <div class="basic">
              {
                font-family: Helvetica Neue;
                font-size: 20px;
                font-weight: bold;
              }
            </div>
          </div>
        </div>
      </section>

      <div class="header">
        <h2>
          TABLE UI
        </h2>
        <div></div>
      </div>

      <section class="table-section">
        <h4 class="sub-title">Header table</h4>
          <div>
            <div class="header-table">Example text for table</div>

            <div class="css-container">
              <div class="basic">
                {
                  color: #909399;
                  font-size: 14px;
                  font-weight: bold;
                  line-height: 23px;
                }
              </div>
            </div>
          </div>

          <h4 class="sub-title">Table text</h4>
          <div>
            <div class="text-table">Example text for table</div>

            <div class="css-container">
              <div class="basic">
                {
                  color: #606266;
                  font-size: 14px;
                  line-height: 23px;
                }
              </div>
            </div>
          </div>

          <h4 class="sub-title">Table Status</h4>
          <div>
            <div class="status-container">
              <div class="server-sync">
                SYNC ON
              </div>
              <div class="server-sync-off">
                SYNC OFF
              </div>
            </div>

            <div class="css-container">
              <div class="basic">
                on {
                  background-color: rgba(103,194,58,.1);
                  color: #67c23a;
                  height: 20px;
                  border: 1px solid rgba(64,158,255,.2);
                  border-radius: 4px;
                  font-size: 12px;

                }
              </div>
              <div class="basic server-on">
                off {
                  background-color: rgba(245,108,108,.1);
                  border: 1px solid;
                  border-color: rgba(245,108,108,.2);
                  color: #f56c6c;
                  height: 20px;
                  border-radius: 4px;
                  font-size: 12px;
                }
              </div>
            </div>
          </div>

          <h4 class="sub-title">Table button</h4>
          <div>
            <div class="table-button-container">
              <div class="button-view">
                <el-tooltip class="item" effect="dark" content="View server's statistics" placement="bottom">
                <el-button type="text" >
                  <i class="el-icon-view icon-btn"></i>
                </el-button>
              </el-tooltip>
              </div>
              <div class="button-edit">
              <el-tooltip class="item" effect="dark" content="View server's threatlist" placement="bottom">
                <el-button type="text">
                  <i class="el-icon-document icon-btn"></i>
                </el-button>
              </el-tooltip>

              </div>
              <div class="button-delete">
                <el-tooltip class="item" effect="dark" content="Delete server" placement="bottom">
                  <el-button type="text" class="del-icon">
                    <i class="el-icon-delete icon-btn"></i>
                  </el-button>
                </el-tooltip>
              </div>
            </div>

            <div class="css-container">
              <div class="basic">
                view, edit{font-size: 18px, color: #409EFF}
                delete {font-size: 18px, color: red}
              </div>
            </div>
          </div>
      </section>

      <div class="header">
        <h2>
          BUTTONS UI
        </h2>
        <div></div>
      </div>

      <section class="buttons-section">
        <h4 class="sub-title">Button success</h4>
        <div>
          <el-button 
            type="success" 
            class="button"
          >
            click me
          </el-button>

          <div class="css-container">
            <div class="basic">
              {
                font-family: Helvetica Neue, Helvetica;
                color: #fff;
                background: #67c23a;
                font-size: 12px;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Button primary</h4>
        <div>
          <el-button 
            type="primary" 
            class="button"
          >
            click me
          </el-button>

          <div class="css-container">
            <div class="basic">
              {
                font-family: Helvetica Neue, Helvetica;
                color: #fff;
                background: #409EFF;
                font-size: 12px;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Button basic</h4>
        <div>
          <el-button 
            class="button"
          >
            click me
          </el-button>

          <div class="css-container">
            <div class="basic">
              {
                font-family: Helvetica Neue, Helvetica;
                color: #606266;
                background: #fff;
                font-size: 12px;
              }
            </div>
          </div>
        </div>
      </section>

      <div class="header">
        <h2>
          OTHER UI
        </h2>
        <div></div>
      </div>

      <section class="other-ui">
        <h4 class="sub-title">Pagination</h4>
        <div>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="10"
              :total="10">
            </el-pagination>
          </div>

          <div class="css-container">
            <div class="basic">
            </div>
          </div>
        </div>

        <h4 class="sub-title">Checkbox</h4>
        <div>
          <div class="checkbox">
            <el-checkbox
            > 
              click me
            </el-checkbox>
          </div>

          <div class="css-container">
            <div class="basic">
              non-active{
                font-family: Helvetica Neue, Helvetica;
                color: #606266;
                font-size: 14px;
              }
              active{
                color: #409EFF;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Dropdown</h4>
        <div>
          <div class="checkbox">
            <el-select
              v-model="value"
              placeholder="Select girl"
              size="small"
            >
              <el-option
                v-for="user in jimbo"
                :value="user.name"
                :key="user.id"
              />
            </el-select>
          </div>

          <div class="css-container">
            <div class="basic">
              non-active{
                font-family: Helvetica Neue, Helvetica;
                color: #606266;
                font-size: 14px;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Footer link</h4>
        <div>
          <div class="footer-link">
            <a
              class="legal-link"
              target="_blank"
              href="/terms-and-conditions"
            >
              Terms and conditions
            </a>
          </div>

          <div class="css-container">
            <div class="basic">
              {
                transition: all .2s ease-in;
                color: #409EFF;
                text-decoration: underline;
              }
              &:hover {
                color: rgb(30, 143, 255);
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Popup</h4>
        <div>
          <div class="footer-link">
            <el-button 
              class="modal__button"
              type="primary" 
              @click="isPhoneEditConfirm = true"
            >
              click me
            </el-button>
            <el-dialog
              title="Enter your verification code"
              :visible.sync="isPhoneEditConfirm"
            >

            </el-dialog>
          </div>

          <div class="css-container">
            <div class="basic">
              { }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Editable field</h4>
        <div>
          <div class="edit-word">
            <div 
              class="edit-container" 
              v-if="isOpenEdit"
            >
              <div class="input-container">
                <div class="description">
                  Enter IP address or FQDN
                </div>
                <div class="input-item">
                  <el-input 
                    class="name-input"
                    placeholder="enter IP/FQDN"
                    size="small" 
                    v-model.trim="inputID"
                  />
                  <small style="color: red">{{ fieldinputIDError }}</small>
                </div>
                
                <div class="container-item">
                  <div class="row">
                    <div class="description">
                      Port #
                    </div>
                    <el-input 
                      class="name-input"
                      placeholder="enter port"
                      size="small" 
                      v-model.trim="inputPort"
                    />

                    <el-button 
                      class="submit-btn" 
                      type="text" 
                      @click="handlerForwarding"
                    >
                      <i class="el-icon-check"></i>
                    </el-button>

                    <el-button 
                      class="close-btn" 
                      type="text" 
                      @click="handleEditClose"
                    >
                      <i class="el-icon-close"></i>
                    </el-button>
                  </div>
                  <small style="color: red">{{ fieldinputPortError }}</small>
                </div>
              </div>
            </div>

            <div class="edit-word" v-else>
              <div class="input-container">
                <div class="description edit">
                  Enter IP address or FQDN
                </div>

                <div class="view-mode">
                  <span class="name">
                    {{ inputID || 'IP address/FQDN' }}
                  </span>
                </div>

                <div class="description edit">
                  Port #
                </div>

                <div class="view-mode">
                  <span class="name">
                    {{ inputPort || 'Port' }}
                  </span>
                </div>
              </div>

              <el-button 
                class="edit-btn" 
                size="small" 
                type="text" 
                @click="handlerOpenEdit"
              >
                <h2>
                  <i class="el-icon-edit"/>
                </h2>
              </el-button>
            </div>
          </div>

          <div class="css-container">
            <div class="basic">
              not-edit-state{
                font-family: Helvetica Neue, Helvetica;
                color: #000;
                font-size: 14px;
                color-button: #409EFF;
                size-button: 12px;
              }
              <hr>
              edit-state{
                font-family: Helvetica Neue, Helvetica;
                color: #000;
                font-size: 14px;
                color-button-submit: green;
                color-button-close: red;
                button-size: 18px;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Alert</h4>
        <div>
          <el-alert
            style="maxWidth: 230px"
            v-if="true"
            type="error"
            :title="'Tony Stark'"
            class="success-msg"
          />
          <el-alert
            style="maxWidth: 230px"
            v-if="true"
            type="success"
            :title="'You wrong'"
            class="success-msg"
          />
          <el-alert
            style="maxWidth: 230px"
            v-if="true"
            type="warning"
            :title="'You bad coder'"
            class="success-msg"
          />

          <div class="css-container">
            <div class="basic">
              {                            
                font-family: Helvetica Neue, Helvetica;
                font-size: 13px;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Tooltip</h4>
        <div>
          <el-tooltip 
            class="item" 
            effect="dark" 
            content="Left Bottom prompts info" 
            placement="top"
          >
            <el-button>left-end</el-button>
            
          </el-tooltip>
          <el-tooltip 
            class="item" 
            effect="light" 
            content="Left Bottom prompts info" 
            placement="top"
          >
            <el-button>
              right-end
            </el-button>
          </el-tooltip>

          <div class="css-container">
            <div class="basic">   
              Настройки тултипа передаются пропсами
              effect="dark" 
              content="Right Bottom prompts info" 
              placement="right-end"
            </div>
          </div>
        </div>
        
        <h4 class="sub-title">Dropdown menu</h4>
        <div>
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <!-- <img :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'" class="user-avatar"> -->
              <img :src="avatarPlaceholder" class="user-avatar">
              <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <el-dropdown-item>
                <span style="display:block;" @click="$router.push('/account')">Settings</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <a
                  href="https://nextvectorsecurity.com/donate/"
                >
                  Fund the project
                </a>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:block;">Sign out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <div class="css-container">
            <div class="basic">   
                <!-- Настройки тултипа передаются просами
                effect="dark" 
                content="Right Bottom prompts info" 
                placement="right-end" -->
            </div>
          </div>
        </div>

        <h4 class="sub-title">Validation error</h4>
        <div>
          <div>
            <small style="color: red">Request failed</small>
            <div class="css-container">
              <div class="basic">   
                { font-size: 12.8px, color: red }
              </div>
            </div>
          </div>
        </div>

        <h4 class="sub-title">Subscription</h4>
        <div>
          <div class="spammer-container">
            <div class="exclamation-mark" @click="long = !long" >
              !
            </div>

            <div class="content" :class="{'is-visible': long}">
              <div class="text" :class="{'text-left': $store.getters.subscriptionStatus === 'paused'}">
                {{ $store.getters.subscriptionStatus === 'cancelled'
                  ? 'Your subsctiption is cancelled. Please press button to subscribe.'
                  : 'Subscription is paused. Reason: Insufficient funds.'
                }}
              </div> 

              <el-button
                v-if="$store.getters.subscriptionStatus === 'cancelled'"
                @click="handleResubscribe"
                class="subscribe-btn"
                plain
                :loading="loading"
              >
                Resubscribe
              </el-button>

              <el-button
                class="close-btn" 
                type="text"
                icon="el-icon-close"
                @click="long = false"
              />
            </div>
          </div>

          <div class="css-container">
            <div class="basic">   
              exclamation-mark 
              {
                font-size: 46px;
                font-weight: bold;
                color: whitesmoke;
                background-color: #ca0000;
                font-family: Helvetica Neue, Helvetica,
              } <br>
              basic-text 
              {
                font-family: Helvetica Neue, Helvetica,
                font-size: 16px;
                color: #ca0000;
                background: #f5f5f5
              } <br>
              close-button 
              {
                color: #409EFF;
                font-size: 40px;
              }
            </div>
          </div>
        </div>

        <h4 class="sub-title">Whitelist window</h4>
        <div>
          <div class="whitelist">
            <div class="row">
              <div class="whitelist-container">
                <h2 class="header--list">
                  Whitelist
                </h2>

                <select
                  v-model="whitelist"
                  multiple 
                  class="site-select" 
                  :size="Math.max(Math.min(server.whitelist.data.length, 10), 5)"
                >
                  <option
                    v-for="action in server.whitelist.data"
                    :key="action.id"
                    class="action-option"
                    :class="{'active': selected.whitelist.indexOf(action.value) !== -1}">
                    {{ action.value }}
                  </option>
                </select>

                <div class="footer">
                  <el-button type="text" class="del-btn">
                    <i class="el-icon-delete"></i>
                  </el-button>

                  <el-button type="text" disabled>
                    <i class="el-icon-upload"></i>
                  </el-button>
                </div>
              </div>
            </div>

            <div class="new-element">
              <el-alert
                type="error"
                class="error-alert"
                v-if="whitelistAddingErrorMsg"
                :title="whitelistAddingErrorMsg"
                :closable="false"
              />          

              <el-input
                class="input"
                type="textarea"
                :autosize="{ minRows: 2 }"
                v-model="whitelistNew"
                @keyup.enter.native="addWhitelist"
                size="mini" 
              />

              <el-button
                type="success"
                size="mini"
                @click="whitelistAdd"
                class="submit-btn"
              >
              <!-- :disabled="!whitelistNew" -->
                Submit
              </el-button>

              <div class="new-items-list">
                <div 
                  class="item"
                  v-for="(item, index) in whitelistNewItems"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>

          <div class="css-container">
            <div class="basic">   
              container 
              {
                width: 420px
                color: whitesmoke;
                background-color: #ca0000;
                font-family: Helvetica Neue, Helvetica,
              } <br>
              header 
              {
                color: #303133;
                font-size: 20px;
                margin: 0;
                padding: 5px 0;
                background-color: #f5f7fa;
              } <br>
              footer-button-delete
              {
                color: red;
                font-size: 20px
              } <br>
              text-area
              {
                width: 330px
              } <br>
              button-submit
              {
                color: #fff;
                background-color: #67c23a;
                border-color: #67c23a;
                font-size: 12px;
                border-radius: 3px;
              } <br>
            </div>
          </div>
        </div>

        <h4 class="sub-title">Threatlist edit button</h4>
        <div>
          <div>
            <el-button 
              style="color: red;" 
              class="remove-btn btn" 
              type="text" 
              @click.native.prevent="deleteThreat(scope.$index)"
            >
              <i class="el-icon-circle-close-outline"></i>
            </el-button>

          <el-button class="btn add-btn" type="text">
            <i class="el-icon-circle-plus-outline"></i>
          </el-button>
            <div class="css-container">
              <div class="basic">   
                btn { font-size: 20px } <br>
                remove-btn { color: red} <br>
                add-btn { color: #409EFF } <br>
              </div>
            </div>
          </div>
        </div>

        <h4 class="sub-title">Button transfer</h4>
        <div>
          <div>
            <el-button
              type="primary"
              icon="el-icon-arrow-left"
              class="move-btn"
              circle
              plain
            />
            <div class="css-container">
              <div class="basic">   
                transfer-button {
                  cursor: pointer;
                  background: #fff;
                  border: 1px solid #dcdfe6;
                  padding: 12px 20px;
                  font-size: 14px;
                  border-radius: 4px;
                  color: #409EFF;
                  background: #ecf5ff;
                  border-color: #b3d8ff;
                } <br>
                transfer-button: hover {
                  background-color: #409EFF; 
                  color: #ffffff, white
                }
              </div>
            </div>
          </div>
        </div>

        <h4 class="sub-title">Select threatlist</h4>
        <div>
          <div>
            <div style="display: flex" >
              <div class="file-item">
                <div class="name">
                  <div class="text">
                    {{ 'name' }}
                  </div>
                </div>

                <el-button
                  type="text"
                  icon="el-icon-view"
                  class="icon-btn"
                />
              </div>
              <div
                class="file-item is-active"
              >
                <div class="name">
                  <div class="text">
                    {{ 'name' }}
                  </div>
                </div>

                <el-button
                  type="text"
                  icon="el-icon-view"
                  class="icon-btn"
                />
              </div>
            </div>

            <div class="css-container">
              <div class="basic">   
                not active {
                  font-familly: 13px, Helvetica;
                  color: #409EFF;
                  icon-size: 18px;
                } <br>
                active {
                  background-color: lightblue(#add8e6);
                }
              </div>
            </div>
          </div>
        </div>

        <h4 class="sub-title">Tabs</h4>
        <div>
          <div class="tabs-container">
            <el-tabs type="border-card">
              <!-- Statistics -->
                <el-tab-pane 
                  class="stat" 
                  label="Statistics"
                >
                </el-tab-pane>

                <el-tab-pane class="threatlist" label="Threatlist">
                </el-tab-pane>

                <!-- Whitelist -->
                <el-tab-pane  class="whitelist" label="Whitelist">
                </el-tab-pane>

                <el-tab-pane class="info" label="Settings">
                </el-tab-pane>

                <el-tab-pane 
                  class="info" 
                  label="Security" 
                >
                </el-tab-pane>
                <el-tab-pane 
                  class="info" 
                  label="Privacy" 
                >
                </el-tab-pane>

                <el-tab-pane 
                  class="info" 
                  label="Logging" 
                >
                </el-tab-pane>

                <!-- Information -->
                <el-tab-pane  class="info" label="Info">
                </el-tab-pane>
              </el-tabs>
            <div class="css-container">
              <div class="basic">   
                header-tabs { 
                  font-size: 14px 
                  font-family: Helvetica
                  font-color: #909399;
                } <br>
                header-tabs-active {
                  color: #409EFF;
                  background-color: #fff;
                  border-right-color: #dcdfe6;
                  border-left-color: #dcdfe6;
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import baseUrl from '../../api/config'
export default {
  data() {
    return {
      isHidden: true,
      value: '',
      isPhoneEditConfirm: false,
      isOpenEdit: false,

      whitelist: [],
      whitelistAddingErrorMsg: '',

      state: false,

      selected: {
        whitelist: [

        ]
      },

      whitelistNew: '',
      whitelistAdd: [],
      whitelistNewItems: [],

      server: {
        whitelist: {
          data: [

          ]
        } 
      },

      inputID: '',
      inputPort: '',

      long: true,
      loading: false,
      errMessage: null,

      jimbo: [
        {
          id: 1,
          name: 'Masha'
        },
        {
          id: 2,
          name: 'Kristina'
        }
      ]
    }
  },

  methods: {
    handlerOpenEdit() {
      this.isOpenEdit = true
    },

    handleEditClose() {
      this.isOpenEdit = false
    },

    openFilePage () {
      window.open(this.$router.resolve({path: '/action-files/' + this.id + '?back=' + this.$route.path}).href)
    },

    getIconClassFromFileType (type) {
      switch (type) {
        case 0: return 'business'
        case 1: return 'home'
        default: return 'unknown'
      }
    }
  },

  mounted() {
    const url = 'https://demo-sppapi.zimalab.com'
    switch(this.baseUrl) {

      case url:
        this.isHidden = false
        break
        
      default:
        this.isHidden = true
    }
  },

  computed: {
    avatarPlaceholder () {
      return require('@/assets/images/avatar-placeholder.png')
    }
  }
}
</script>
<style lang="scss">
body {
  height: auto !important;
};

input {
  font-family: Helvetica Neue, Helvetica;
}
</style>
<style lang="scss" scoped>
  .story-book {
    height: 100%;
    width: 100%;
    background: #ca91ff;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
      min-width: 860px;
      max-width: 1024px;
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 2rem;

// text css
      .text-section {
        display: grid;
        grid-template-columns: 140px 1fr;
        grid-gap: 1rem;

        .description {
          margin-bottom: .5rem;
        }

        h4 {
          padding: 0;
          margin: 0 0 3rem;
        }

        .basic-text {
          font-family: Helvetica Neue, Helvetica;
          font-size: 16px;
        }

        .css-container {
          margin-top: .3rem;
        }

        .header {
          font-size: 24px;
          margin: 0;
        }

        .title-section {
          font-size: 20px;
        }

        h1 {
          margin: 0;
        }
      }

      // css table
      .table-section {
        display: grid;
        grid-template-columns: 140px 1fr;
        grid-gap: 1rem;

        h4 {
          padding: 0;
          margin: 0 0 3rem;
        }

        .table-text {
          font-size: 14px;
          color: #606266;
        }

        .header-table {
          color: #909399;
          font-size: 14px;
          font-weight: bold;
          line-height: 23px;
        }

        .text-table {
          font-size: 14px;
          color: #606266;
          line-height: 23px;
        }

        .status-container {
          display: flex;
        }

        .server-sync {
          background-color: rgba(103,194,58,.1);
          color: #67c23a;
          height: 20px;
          padding: 0 5px;
          line-height: 19px;
          box-sizing: border-box;
          border: 1px solid rgba(64,158,255,.2);
          border-radius: 4px;
          font-size: 12px;
          max-width: 66px;
        }
        .server-sync-off {
          background-color: rgba(245,108,108,.1);
          border: 1px solid;
          border-color: rgba(245,108,108,.2);
          color: #f56c6c;
          height: 20px;
          padding: 0 5px;
          line-height: 19px;
          box-sizing: border-box;
          border-radius: 4px;
          font-size: 12px;
          max-width: 72px;
        }

        .server-on {
          margin-top: 1rem;
        }

        .table-button-container {
          display: flex;

          .icon-btn {
            font-size: 18px;
            padding-left: 12px;
          }
          
          .el-icon-delete {
            color: red;
          }
        }
      }

      // buttons section
      .buttons-section {
        display: grid;
        grid-template-columns: 140px 1fr;
        grid-gap: 1rem;

        h4 {
          margin: 0;;
        }

        .button {
          font-family: Helvetica Neue, Helvetica;
          font-size: 12px;
        }
      }

      //other section
      .other-ui {
        display: grid;
        grid-template-columns: 140px 1fr;
        grid-gap: 1rem;

        h4 {
          margin: 0;
        }

        .legal-link {
          transition: all .2s ease-in;
          color: #409EFF;
          text-decoration: underline;

          &:hover {
            color: rgb(30, 143, 255);
          }
        }

        .modal__button {
          font-family: Helvetica Neue, Helvetica;
          font-size: 12px;
        }

        .tooltip {
          font-size: 45px;
        }

        .avatar-container {
          height: 50px;
          .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            line-height: initial;
            .user-avatar {
              width: 40px;
              height: 40px;
              border-radius: 10px;
            }
            .el-icon-caret-bottom {
              font-size: 12px;
            }
          }
        }

        //for edit field
        .input-container {
          display: flex;

          .close-btn {
            color: red;
            padding: 7px 0;
            i {
              font-size: 18px;
              font-weight: bold;
            }
          }

          .submit-btn {
            color: green;
            margin-left: 8px;
            padding: 7px 0;

            i {
              font-size: 18px;
              font-weight: bold;
            }
          }

          .edit {
            color: #000000 !important;
          }

          .container-item {
            display: flex;
            flex-direction: column;
            margin-top: -1px;

            .row {
              display: flex;
            }

            small {
              margin-left: 3.5rem;
            }
          }

          .input-item {
            margin-right: 1rem;

            small {
              width: 160px;
              word-break: break-all ;
            }
          }

          .description {
            margin-top: .6rem;
            font-size: 14px;
            color: #000;
            margin-right: 1rem;
            min-width: 50px;
          }

          .description-silver {
            color: silver;
          }
        }

        .edit-word {
          display: flex;

          .edit-container {
            display: flex;
          }

          .input-container {
            display: flex;

            .edit {
              color: #000000 !important;
            }

            .container-item {
              display: flex;
              flex-direction: column;
              margin-top: -1px;

              .row {
                display: flex;
              }

              small {
                margin-left: 3.5rem;
              }
            }

            .input-item {
              margin-right: 1rem;

              small {
                width: 160px;
                word-break: break-all ;
              }
            }

            .description {
              margin-top: .6rem;
              font-size: 14px;
              color: #000;
              margin-right: 1rem;
            }

            .description-silver {
              color: silver;
            }
          }

          .view-mode {
            margin-right: 1rem;
            margin-top: .4rem;
            
          .name {
            margin-top: .5rem;
            font-size: 14px;
            padding: 0 .4rem .1rem .4rem;
            border-bottom: 1px solid #409EFF;
          }

          .name-silver {
            margin-top: .5rem;
            font-size: 14px;
            color: silver;
            padding: 0 .4rem .1rem .4rem;
            border-bottom: 1px solid silver;
          }

            h4 {
              margin: 0;
            }
          }

          h2 {
            padding: 0px 0;
            margin: -2px 0;
          }

          .close-btn {
            color: red;
            padding: 7px 0;
            i {
              font-size: 18px;
              font-weight: bold;
            }
          }

          .submit-btn {
            color: green;
            margin-left: 8px;
            padding: 7px 0;

            i {
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }

      .sub-title {
        margin-top: 1rem;
        color: #5f00db;
        text-decoration: underline;
      }
      .table-text {
        font-size: 14px;
        color: #606266;
      }

      .title {
        font-size: 24px;
        font-weight: bold;
      }

      .header {
        margin: 1rem 0 2rem 0rem;
        display: grid;
        grid-template-columns: 1fr 4fr;
        align-items: center;
        h1 {
          margin: 0;
        }
        div {
          background-color: #9543ff;;
          height: .7rem;
        }
      }
    }

    .basic {
      font-size: 12px;
    }
  }
</style>

//subscription
<style lang="scss" scoped>
  $circle-size: 60px;
  $exclamation-mark-size: 46px;

  .spammer-container {
    // position: fixed;
    // z-index: 2000;
    // min-width: $circle-size;

    transition: all .2s ease-in;

    max-width: 768px;

    padding: 0;
    
    height: $circle-size;
    bottom: 50px;
    left: 50px;
    background-color: whitesmoke;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    &:hover {
      cursor: pointer;
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .exclamation-mark {
      font-size: $exclamation-mark-size;
      font-weight: bold;

      color: whitesmoke;
      background-color: rgb(202, 0, 0);
      user-select: none;

      padding: 0 30px;

      height: 100%;
      display: flex;
      align-items: center;
    }

    .content {
      height: 100%;
      display: flex;
      align-items: center;
      color: rgb(202, 0, 0);
      // padding-left: 20px;

      background-color: whitesmoke;

      overflow: hidden;

      .close-btn {
        // display: none;
        font-size: 40px;
        padding: 0 30px;
      }

      .subscribe-btn {
        // display: none;
        margin-left: 30px;
      }

      transition: width .2s ease-in;

      pointer-events: none;
      opacity: 0;
      width: 0px;
      &.is-visible {
        opacity: 1;
        width: calc(100vw - 175px);
        pointer-events: initial;
        .text {
          width: auto;
          height: 1em;
        }
      }

      .text {
        // width: 0;
        margin-left: auto;
        overflow: hidden;
        transition: all .2s ease-in;

        .text-left {
          margin-left: 20px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .whitelist {
    max-width: 420px;
    .whitelist-container {
      border: 1px solid #e4e7ed;

      .header--list {
        font-weight: 500;
        font-size: 20px;
        text-align: center;
        margin: 0;
        margin-top: 0 !important;
        padding: 5px 0;
        background-color: #f5f7fa;
      }

      .site-select {
        width: 100%;
        overflow-y: auto;
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
        max-width: 420px;
        background-color: #f5f7fa;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        padding-right: 10px;
        
        i {
          font-size: 20px;
        }

      .del-btn {
        color: red;

        &.is-disabled {
          color: #c0c4cc;
        }
      }
    }
  }

  .new-element {
    display: grid;
    grid-template-columns: 1fr 80px;
    margin-top: 10px;
    max-width: 420px;

    .input {
      width: calc(100% - 10px);
    }

    .new-items-list {
      grid-column-start: 1;
      grid-column-end: 4;

      padding-top: 10px;

      .item {
        padding: 5px 0;
      }
    }

    .submit-btn {
      margin-bottom: auto;
    }

    .error-alert {
      max-width: 420px;
      margin-bottom: 10px;
      grid-column-start: 1;
      grid-column-end: 4;
    }
  }
}
</style>

//edit-threalist-button
<style lang="scss" scoped>
  .btn {
    font-size: 20px;
  }
  .remove-btn {
    color: red;
  }
  .add-btn {
    color: #409EFF;
  }
</style>

<style lang="scss" scoped>
  .file-item {
    width: 250px;
    padding: 0 10px;
    cursor: pointer;
    user-select: none;
    transition: all .1s ease-in-out;
    height: 30px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon-btn {
      font-size: 18px;
    }

    .name {
      display: flex;
      align-items: center;

      .text {
        white-space: nowrap;
        max-width: 13em;
        font-size: 13px;
        color: rgb(48, 49, 51);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .type-icon {
        margin-right: 5px;
        font-size: 15px;
      }
    }

    &.is-active {
      background-color: lightblue;
      .icon-btn {
        color: rgba(0, 0, 255, 0.7);

        &:hover {
          color: rgba(0, 0, 255, 1);
        }
      }
    }
  }
</style>

<style lang="scss">
.tabs-container {
  .el-tabs__content {
    max-height: 70px !important;
  }
}
</style>


