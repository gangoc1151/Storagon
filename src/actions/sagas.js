import { all } from 'redux-saga/effects';
import authSaga from 'pages/sessions/redux/saga'
import fileSaga from 'containers/files/redux/saga'
import accountSaga from 'pages/accounts/redux/saga'

export default function* rootSaga(getState) {
  yield all([
    authSaga(),
    accountSaga(),
    fileSaga()
  ]);
}
