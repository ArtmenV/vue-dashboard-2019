import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const RefreshTokenKey = 'real_spp_refresh_token'
const TokenStartKey = 'real_spp_refresh_token_start'
const TokenLifetimeKey = 'real_spp_refresh_token_lifetime'
const SubscriptionTypeKey = 'real_spp_subscription_type'
const UserNameKey = 'real_spp_user_name'
const UserIdKey = 'real_spp_user_id'
const SubscriptionStatusKey = 'real_spp_subscription_status'
const PlanIdKey = 'real_spp_plan_id'

export function getPlanId () {
  return Cookies.get(PlanIdKey)
}

export function setPlanId (planId) {
  return Cookies.set(PlanIdKey, planId)
}

export function setSubscriptionStatus (subscriptionStatus) {
  return Cookies.set(SubscriptionStatusKey, subscriptionStatus)
}

export function getSubscriptionStatus () {
  return Cookies.get(SubscriptionStatusKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setSubscriptionType (subscriptionType) {
  return Cookies.set(SubscriptionTypeKey, subscriptionType)
}

export function getSubscriptionType () {
  return Cookies.get(SubscriptionTypeKey)
}

export function setUserName (userName) {
  return Cookies.set(UserNameKey, userName)
}

export function getUserId () {
  return Cookies.get(UserIdKey)
}

export function setUserId (userId) {
  return Cookies.set(UserIdKey, userId)
}

export function getUserName () {
  return Cookies.get(UserNameKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function getTokenStart() {
  return Cookies.get(TokenStartKey)
}

export function setTokenStart(date) {
  return Cookies.set(TokenStartKey, date)
}

export function removeTokenStart() {
  return Cookies.remove(TokenStartKey)
}

export function getTokenLifetime() {
  return Cookies.get(TokenLifetimeKey)
}

export function setTokenLifetime(time) {
  return Cookies.set(TokenLifetimeKey, time)
}

export function removeTokenLifetime() {
  return Cookies.remove(TokenLifetimeKey)
}

