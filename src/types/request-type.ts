enum RequestMode {
  error = 'ERROR',
  userLogin = 'USER_LOGIN',
  userLogout = 'USER_LOGOUT',
  userExtLogin = 'USER_EXTERNAL_LOGIN',
  userExtLogout = 'USER_EXTERNAL_LOGOUT',
  userActive = 'USER_ACTIVE',
  userInactive = 'USER_INACTIVE',
  msgSend = 'MSG_SEND',
  msgFromUser = 'MSG_FROM_USER',
  msgDeliver = 'MSG_DELIVER',
  msgRead = 'MSG_READ',
  msgDelete = 'MSG_DELETE',
  msgEdit = 'MSG_EDIT',
}

export default RequestMode;
