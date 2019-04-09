const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  permission: state => state.user.permission,
  pagePermission: state => state.permission.pagePermission,
  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  // common
  statusOption: state => state.common.statusOption,
  genderOption: state => state.common.genderOption,
  stageOption: state => state.common.stageOption
}
export default getters
