import SignupSaga from './Signup/sagas'
import LoginSaga from './Login/sagas'
import DashboardSaga, { logoutWatcher as LogoutSaga } from './Dashboard/sagas';

export default function* IndexSaga () {  
    yield [
        SignupSaga(),
        LoginSaga(),
        LogoutSaga(),
        DashboardSaga(),
    ]
  }