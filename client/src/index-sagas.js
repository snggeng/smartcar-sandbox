import SignupSaga from './Signup/sagas'
import LoginSaga from './Login/sagas'
import { logoutWatcher as LogoutSaga } from './Dashboard/sagas';

export default function* IndexSaga () {  
    yield [
        SignupSaga(),
        LoginSaga(),
        LogoutSaga(),
    ]
  }