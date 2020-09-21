<template>
  <div class="page-container">
    <div class="header">
      <div class="title">Settings</div>
    </div>

    <el-tabs type="border-card" v-model="tab">
      <el-tab-pane label="My Account">
        <info 
          v-if="user" 
          :user="user" 
          @updateUser="handleUserUpdate"
          @refreshUserInfo="() => updateUserInfo()"
        />
      </el-tab-pane>
      <el-tab-pane label="Subscription">
        <subscription
          v-if="user"
          :invoice="user.upcoming_invoice"
          :history="user.billing_history"
          :user="user"
          @subscription-update="handleSubscriptionUpdate"
          @card-updated="handleCardUpdate"
          @subscription-cancelled="handleSubscriptionCancelled"
          @card-removed="user.subscription.payment_method = null"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SPPCloudApi from "@/api/cloud-api.js";
import handleError from "@/utils/errorHandler.js";

export default {
  data() {
    return {
      loading: false,

      user: null,

      tab: 0,

      errMessage: null
    };
  },

  components: {
    info: () => import("./components/info"),
    subscription: () => import("./components/subscription")
  },

  beforeDestroy() {
    if (this.errMessage) {
      this.errMessage.close();
    }
  },

  mounted() {
    if (this.$route.query) {
      this.tab = this.$route.query.tab || 0;
    }

    SPPCloudApi.getUser()
      .then(r => {
        this.user = Object.assign(
          {
            upcoming_invoice: [],
            billing_history: []
          },
          r.data.result
        );
      })
      .catch(e => {
        this.errMessage = handleError(this, e);
      });
  },

  methods: {
    handleUserUpdate(prop, value) {
      this.user[prop] = value;
    },

    updateUserInfo() {
      SPPCloudApi.getUser()
        .then(r => {
          this.user = Object.assign(
            {
              upcoming_invoice: [],
              billing_history: []
            },
            r.data.result
          );
        })
        .catch(e => {
          this.errMessage = handleError(this, e);
        });
    },

    handleSubscriptionUpdate(data, status) {
      if (data) {
        this.user.subscription.plan.name = data.plan.name;
        this.user.subscription.plan.price = data.plan.price;
      }

      if (status) {
        this.user.subscription.status = status;
      }
    },

    handleCardUpdate(payment) {
      if (this.user.subscription.payment_method) {
        this.user.subscription.payment_method.last4 = payment.number.slice(-4);
        this.user.subscription.payment_method.expiry_month = payment.expiryDate.slice(
          0,
          2
        );
        this.user.subscription.payment_method.expiry_year = payment.expiryDate.slice(
          -2
        );
      } else {
        this.user.subscription.payment_method = {
          last4: payment.number.slice(-4),
          expiry_month: payment.expiryDate.slice(0, 2),
          expiry_year: payment.expiryDate.slice(-2)
        };
      }
    },

    handleSubscriptionCancelled() {
      this.user.subscription.status = "cancelled";
    }
  }
};
</script>


<style lang="scss" scoped>
.page-container {
  padding: 20px;

  .header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      font-weight: bold;
    }

    .subscription {
      margin-left: 20px;
      margin-bottom: 3px;
      color: lightgray;
      font-size: 15px;
      font-weight: normal;
    }
  }
}
</style>
