const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  
  token: state => {
    return state.user.token
  },

  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  subscriptionType: state => state.user.subscriptionType,
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  subscriptionStatus: state => state.user.subscriptionStatus,
  planId: state => state.user.planId,
  userPhoneNumber: state => state.user.phoneNumber
}
export default getters
