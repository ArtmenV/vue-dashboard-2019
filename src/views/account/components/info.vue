<template>
  <div class="container" v-loading="loading">
    <div class="header">
      Account information
    </div>

    <div class="information">
      <!-- Company's name -->
      <div class="prop">
        <div class="title">
          Company name:
        </div>

        <div class="value">
          <div class="view" v-show="!editing.companyName">
            {{ user.company }}

            <el-button
              class="icon-btn edit-btn"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit('companyName')"
            />
          </div>

          <div class="edit" v-show="editing.companyName">
            <el-input
              size="small"
              v-model="editing.newCompanyName"
              @keyup.enter.native="handleSave('companyName')"
            />

            <el-button
              class="icon-btn submit-btn"
              type="text"
              icon="el-icon-check"
              @click="handleSave('companyName')"
            />

            <el-button
              class="icon-btn close-btn"
              type="text"
              icon="el-icon-close"
              @click="editing.companyName = false"
            />

            <div class="error-msg" v-if="errors.companyName">
              {{ errors.companyName }}
            </div>
          </div>
        </div>
      </div>

      <!-- Account's name -->
      <div class="prop">
        <div class="title">
          Name:
        </div>

        <div class="value">
          <div class="view" v-show="!editing.name">
            {{ user.first_name + " " + user.last_name }}

            <el-button
              class="icon-btn edit-btn"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit('name')"
            />
          </div>

          <div class="edit" v-show="editing.name">
            <el-input
              size="small"
              v-model="editing.newFirstName"
              @keyup.enter.native="handleSave('name')"
            />

            <el-input
              size="small"
              class="second-input"
              v-model="editing.newLastName"
              @keyup.enter.native="handleSave('name')"
            />

            <el-button
              class="icon-btn submit-btn"
              type="text"
              icon="el-icon-check"
              @click="handleSave('name')"
            />

            <el-button
              class="icon-btn close-btn"
              type="text"
              icon="el-icon-close"
              @click="editing.name = false"
            />
            <div class="error-container">
              <div class="error-msg" v-if="errors.name">
                {{ errors.name }}
              </div>
              
              <div class="error-msg error-lastName" v-if="errors.lastName">
                {{ errors.lastName }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account's email -->
      <div class="prop">
        <div class="title title--fl-end">
          Email:
        </div>

        <div class="value">
          <div class="view" v-show="!editing.email">
            {{ user.email }}

            <el-button
              class="icon-btn edit-btn"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit('email')"
            />

            <div
              class="not-confirmed-emails"
              v-for="email in user.unconfirmed_emails"
              :key="email"
            >
              {{ email }} <span class="text--warning">not confirmed</span>

              <el-tooltip class="item" effect="dark" placement="top">
                <div class="question-mark"></div>

                <div slot="content" class="content">
                  Your old email will be used until you confirm the new one.<br />

                  <span class="resend">
                    Resend confirmation
                  </span>
                </div>
              </el-tooltip>
            </div>
          </div>

          <div class="edit" v-show="editing.email">
            <el-input
              size="small"
              v-model="editing.newEmail"
              @keyup.enter.native="handleSave('email')"
            />

            <el-button
              class="icon-btn submit-btn"
              type="text"
              icon="el-icon-check"
              @click="handleSave('email')"
            />

            <el-button
              class="icon-btn close-btn"
              type="text"
              icon="el-icon-close"
              @click="editing.email = false"
            />

            <div class="error-msg" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>
        </div>
      </div>

      <!-- Account's password -->
      <div class="prop">
        <div class="title">
          Password:
        </div>

        <div class="value">
          ******

          <el-button
            class="icon-btn edit-btn"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit('password')"
          />
        </div>
      </div>

      <!-- Mobile Phone -->
      <div 
        class="prop"
      >
        <div class="title">
          Mobile phone:
        </div>

        <div class="value">
          <!-- ****** -->
          <div 
            class="phone"
            v-if="user.user_settings.is_active_phone_number"
          >
            {{ user.user_settings.phone_number }}
          </div>
          
          <el-button
            class="icon-btn edit-phone-btn"
            type="text"
            icon="el-icon-edit"
            @click="handleEditPhone"
          />
        </div>
      </div>
    </div>

    <div class="edit-phone">
      <el-dialog
        title="Enter your phone number"
        :visible.sync="isPhoneEdit"
        :key="editKey"
      >
        <phone-edit 
          :user="user"
          @changeMobileEdit="changeMobileEdit"
        />
      </el-dialog>
    </div>
    
    <div class="edit-phone-confirm">
      <el-dialog
        title="Enter your verification code"
        :visible.sync="isPhoneEditConfirm"
        :key="editKey"
      >
        <confirm-phone-edit 
          :user="user"
          @confirmChangeTel="confirmChangeTel"
          @updateUserInfo="() => $emit('refreshUserInfo')"
        />
      </el-dialog>
    </div>

    <div>
      <two-factor-auth 
        :user="user"
        @changeUserAuth="changeUserAuth"
      />
    </div>
    <div class="container-password">
      <el-dialog 
        title="Changing password" 
        :visible.sync="editing.password"
      >
        <change-password 
          @password-changed="passwordChangeSuccess"
        />
      </el-dialog>
    </div>

  </div>
</template>

<script>
import SPPCloudApi from "@/api/cloud-api.js";
import handleError from "@/utils/errorHandler.js";

export default {
  props: ["user"],

  data() {
    return {
      loading: false,

      editing: {
        companyName: false,
        name: false,
        email: false,
        password: false, // ???

        newCompanyName: "",
        newName: "",
        newFirstName: "",
        newLastName: "",
        newEmail: "",
        newPassword: "" // ???
      },

      errors: {
        name: "",
        lastName: "",
        companyName: "",
        email: ""
      },

      errMessage: null,
      isPhoneEdit: false,
      isPhoneEditConfirm: false,
      editKey: 1
    };
  },

  beforeDestroy() {
    if (this.errMessage) {
      this.errMessage.close();
    }
  },

  components: {
    changePassword: () => import("./change-password"),
    twoFactorAuth: () => import("./2fa/2fa-section"),
    phoneEdit: () => import("./phone-edit"),
    confirmPhoneEdit: () => import("./confirm-phone-edit")
  },

  methods: {
    handleEdit(prop) {
      switch (prop) {
        case "companyName":
          this.errors.companyName = "";
          this.editing.companyName = true;
          this.editing.newCompanyName = this.user.company;
          break;

        case "name":
          this.errors.name = "";
          this.errors.lastName = "";
          this.editing.name = true;
          this.editing.newFirstName = this.user.first_name;
          this.editing.newLastName = this.user.last_name;
          break;

        case "email":
          this.errors.email = "";
          this.editing.email = true;
          this.editing.newEmail = this.user.email;
          break;

        case "password":
          this.editing.password = true;
          break;

        default:
          console.error("handleEdit() got unexpected argument");
      }
    },

    handleSave(prop) {
      switch (prop) {
        case "companyName":
          if (this.editing.newCompanyName === "") {
            this.errors.companyName = "is required";
            return
          } else {
            this.errors.companyName = "";
          }
          this.loading = true;
          SPPCloudApi.updateUserInfo({
            company_name: this.editing.newCompanyName
          }, 'subscription/company-name')
            .then(r => {
              this.loading = false;
              this.editing.companyName = false;
              this.$emit("updateUser", "company", this.editing.newCompanyName);
            })
            .catch(e => {
              this.loading = false;
              this.errors.companyName = e.message;
              const { response } = e;
              const { data } = response;
              
              if (data && data.status_code == "400") {
                this.errors.companyName = "Company name is incorrect";
              } else {
                handleError(this, e);
              }
            })
            .finally(_ => {
              this.loading = false;
            });
        break;

        case "name":
          const firstName = this.editing.newFirstName;
          const lastName = this.editing.newLastName;
          if (firstName === "") {
            this.errors.name = "is required";
            return
          } else {
            this.errors.name = "";
          }

          if (lastName === "") {
            this.errors.lastName = "is required";
            return
          } else {
            this.errors.lastName = "";
          }

          this.errors.name = "";
          this.errors.lastName = "";
          this.loading = true;

          const responseFirstName = SPPCloudApi.updateUserInfo({
            first_name: firstName,
          }, 'user/first-name')

          const responseLastName = SPPCloudApi.updateUserInfo({
            last_name: lastName
          }, 'user/last-name')

            Promise.all([responseFirstName, responseLastName])
              .then(r => {
                this.editing.name = false;
                this.loading = false;
                this.$emit("updateUser", "first_name", firstName);
                this.$emit("updateUser", "last_name", lastName);

                this.$store.dispatch(
                  "updateUsername",
                  `${firstName} ${lastName}`
                );
            }).catch(e => {

              this.loading = false;
              const { response } = e;
              const { data } = response;

              if (data.status_code == "400") {
                const errors = data.messages[0].context;

                if (errors["first_name_d_t_o.first_name"]) {
                  this.errors.name = "First name is incorrect";
                } else if (errors["last_name_d_t_o.last_name"]) {
                  this.errors.lastName = "Last name is incorrect";
                } 
                
              } else {
                handleError(this, e);
              }
              this.loading = false;
            });
          break;

        case "email":

          if (this.editing.newEmail === "") {
            this.errors.email = "is required";
            return
          } else {
            this.errors.email = "";
          }
          
          this.loading = true;

          SPPCloudApi.updateUserInfo(
            { email: this.editing.newEmail },
            'user/email'
            )
            .then(r => {
              this.editing.email = false;
              this.loading = false;
              this.$emit(
                "updateUser",
                "unconfirmed_emails",
                this.editing.newEmail
              );
            })
            .catch(e => {
              this.loading = false;
              this.errors.email = e.message;
              const { response } = e;
              const { data } = response;

              if (data.status_code == "400") {
                this.errors.email = "Email is incorrect";
              } else {
                handleError(this, e);
              }
              this.loading = false;
            })
          break;
      }
    },

    handleEditPhone() {
      this.isPhoneEdit = true
    },

    changeUserAuth() {
      this.$emit('refreshUserInfo')
    },

    changeMobileEdit() {
      this.isPhoneEdit = false
      this.isPhoneEditConfirm = true
      this.$emit('refreshUserInfo')
      this.editKey++
    },

    confirmChangeTel() {
      this.isPhoneEditConfirm = false
      this.editKey++
      this.$emit('updateUser')
    },

    passwordChangeSuccess() {
      this.editing.password = false
    }
  },

  computed: {
    editPhoneInfo () {
      if (this.user.user_settings.phone_number === null || '' || undefined) {
        return false
      } else {
        true
      }
    }
  }
};
</script>
<style lang="scss">
.edit-phone {
  .el-dialog__body {
    padding-top: 0;
  }
  .el-dialog__header {
    margin-bottom: .5rem;
    width: 88%;
  }
  .el-dialog {
    width: 320px;;
  }
}
.edit-phone-confirm {
  .el-dialog__body {
    padding-top: 5px !important;
    padding-bottom: 22px !important;
  }
  .el-dialog__header {
    width: 88%;
  }
  .el-dialog {
    width: 320px !important;
  }
}
.container-password {
  .el-dialog__body {
    padding-top: 5px !important;
    padding-bottom: 22px !important;
  }
  .el-dialog__header {
    width: 88%;
  }
  .el-dialog {
    width: 320px !important;
  }
}
</style>

<style lang="scss" scoped>
.text--warning {
  color: hsl(7, 100%, 75%);
}

.resend {
  display: block;
  color: rgb(64, 158, 255);
  font-weight: bold;

  padding-top: 10px;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.container {
  max-width: 500px;

  .header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .information {
    display: flex;
    flex-direction: column;

    .prop {
      margin: 5px 0;
      display: grid;
      grid-template-columns: 2fr 5fr;

      .value,
      .title {
        display: flex;
        align-items: center;

        &.title--fl-end {
          align-items: flex-start;
        }
      }

      .icon-btn {
        font-size: 15px;
        margin: 0;
        padding: 0;
      }

      .phone {
        margin-right: .4rem;
      }

      .value {
        .edit {
          display: flex;

          position: relative;
          padding: 7px 0;

          .second-input {
            margin-left: 10px;
          }

          .icon-btn {
            margin-left: 5px;
            // font-weight: bold;

            &.submit-btn {
              color: green;
            }

            &.close-btn {
              color: red;
            }
          }
        }

        .not-confirmed-emails {
          padding-top: 10px;
          padding-bottom: 15px;

          .question-mark {
            display: inline-flex;
            // align-self: center;

            padding-top: 2px;
            padding-right: 1px;

            width: 16px;
            height: 16px;

            background: lightgray;

            border-radius: 100%;

            align-items: center;
            justify-content: center;

            cursor: pointer;

            &::before {
              content: "?";
              color: white;
              font-size: 12px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

.error-container {
  display: flex;
  justify-content: space-between;

  .error-lastName {
    left: 165px;
  }
}

.error-msg {
  font-size: 12px;
  color: red;

  position: absolute;
  bottom: -8px;
  left: 1px;
}
</style>
