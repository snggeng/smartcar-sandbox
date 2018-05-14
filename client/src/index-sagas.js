import SignupSaga from './Signup/sagas'
import LoginSaga from './Login/sagas'
import { dashboardWatcher as DashboardSaga, logoutWatcher as LogoutSaga, lockWatcher as lockSaga, } from './Dashboard/sagas';

export default function* IndexSaga () {  
    yield [
        SignupSaga(),
        LoginSaga(),
        LogoutSaga(),
        DashboardSaga(),
        lockSaga(),
    ]
  }