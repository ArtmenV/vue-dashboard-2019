import {  login, logout, getInfo } from '@/api/login'
import {  getToken, setToken, removeToken,
          getRefreshToken, setRefreshToken, removeRefreshToken,
          getTokenStart, setTokenStart, removeTokenStart,
          getTokenLifetime, setTokenLifetime, removeTokenLifetime,
          setSubscriptionType, getSubscriptionType, setUserName,
          getUserName, setUserId, getUserId, getSubscriptionStatus,
          setSubscriptionStatus, getPlanId, setPlanId } from '@/utils/auth'
import axios from 'axios'
import baseUrl from '@/api/config.js'
import redirectUrl from '@/api/redirectUrl.js'

const user = {
  state: {
    token: getToken(),
    refreshToken: getRefreshToken(),
    tokenExpires: getTokenLifetime(),
    tokenStart: getTokenStart(),
    userId: getUserId(),
    name: '',
    avatar: 'admin',
    userName: getUserName(),
    subscriptionType: getSubscriptionType(),
    subscriptionStatus: getSubscriptionStatus(),
    roles: [],
    phoneNumber: '',
    stepOneToken: '',

    planId: getPlanId()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_REFRESH_TOKEN: (state, token) => state.refreshToken = token,
    SET_USER_NAME: (state, userName) => state.userName = userName,
    SET_SUBSCRIPTION_TYPE: (state, subscriptionType) => state.subscriptionType = subscriptionType,
    SET_TOKEN_EXPIRES: (state, time) => state.tokenExpires = time,
    SET_TOKEN_START: (state, time) => state.tokenStart = time,
    SET_USER_ID: (state, id) => state.userId = id,
    SET_SUBSCRIPTION_STATUS: (state, status) => state.subscriptionStatus = status,
    SET_PLAN_ID: (state, planId) => state.planId = planId,
    SET_TWO_AUTH_PHONE: (state, phoneNumber) => state.phoneNumber = phoneNumber,
    SET_STEP_ONE_TOKEN: (state, tokenStepOne) => state.stepOneToken = tokenStepOne
  },

  actions: {
    UpdateToken ({ commit }, token) {
      setToken(token)
      commit('SET_TOKEN', token)
    },

    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {

        axios.post(baseUrl + '/auth/v1/token', JSON.stringify({
          "username": username,
          "password": userInfo.password
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            const data = response.data

            if (data.result && data.result.step_one_token) {
              commit('SET_STEP_ONE_TOKEN', data.result.step_one_token)
              localStorage.setItem('stepOneToken', data.result.step_one_token)
              localStorage.setItem('methodAuth', data.result.auth_method)
            } else {
              if (data.user.roles[0] === 'ROLE_ADMIN') {
                let url = redirectUrl + data.refresh_token
                url += '&token=' + data.token
                url += '&user=' + username
                window.location.replace(url)
              } else {
                setToken(data.token)
                commit('SET_TOKEN', data.token)
                
                setSubscriptionStatus(data.subscription.status)
                commit('SET_SUBSCRIPTION_STATUS', data.subscription.status)
    
                setRefreshToken(data.refresh_token)
                commit('SET_REFRESH_TOKEN', data.refresh_token)
  
                commit('SET_PLAN_ID', data.plan.id)
                setPlanId(data.plan.id)
  
                commit('SET_SUBSCRIPTION_TYPE', data.plan.name)
                setSubscriptionType(data.plan.name)
                
                commit('SET_USER_NAME', data.user.first_name + ' ' + data.user.last_name)
                setUserName(data.user.first_name + ' ' + data.user.last_name)
  
                commit('SET_USER_ID', data.user.id)
                setUserId(data.user.id)
              }
            }
            resolve()
          })
          .catch(error => reject(error))
      })
    },

    TwoFactorAuth ({ commit }, data) {
      return new Promise((resolve, reject) => {

        axios.post(baseUrl + '/auth/v1/second-auth', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            const data = response.data

              if (data.user.roles[0] === 'ROLE_ADMIN') {
                let url = redirectUrl + data.refresh_token
                url += '&token=' + data.token
                url += '&user=' + username
                window.location.replace(url)
              } else {
                setToken(data.token)
                commit('SET_TOKEN', data.token)
                
                setSubscriptionStatus(data.subscription.status)
                commit('SET_SUBSCRIPTION_STATUS', data.subscription.status)
    
                setRefreshToken(data.refresh_token)
                commit('SET_REFRESH_TOKEN', data.refresh_token)
  
                commit('SET_PLAN_ID', data.plan.id)
                setPlanId(data.plan.id)
  
                commit('SET_SUBSCRIPTION_TYPE', data.plan.name)
                setSubscriptionType(data.plan.name)
                
                commit('SET_USER_NAME', data.user.first_name + ' ' + data.user.last_name)
                setUserName(data.user.first_name + ' ' + data.user.last_name)
  
                commit('SET_USER_ID', data.user.id)
                setUserId(data.user.id)
              }
            resolve()
          })
          .catch(error => reject(error))
      })
    },

    updateSubscriptionStatusAndType ({ commit }, data) {

      setSubscriptionStatus(data.status)
      commit('SET_SUBSCRIPTION_STATUS', data.status)

      commit('SET_SUBSCRIPTION_TYPE', data.type)
      setSubscriptionType(data.type)
    },

    cancelSubscription ({ commit }) {
      setSubscriptionStatus('non-renewing')
      commit('SET_SUBSCRIPTION_STATUS', 'non-renewing')
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeRefreshToken()
        removeToken()
        removeTokenStart()
        removeTokenLifetime()
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    updateUsername ({ commit }, username) {
      commit('SET_USER_NAME', username)
    }
  }
}

export default user
