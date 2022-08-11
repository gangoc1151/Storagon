import React, { useEffect } from 'react'
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { history } from './actions/store'

import Home from './pages/Home'
import Login from './pages/sessions/Login'
import LoginTest from './pages/sessions/LoginTest'
import Register from './pages/sessions/Register'

import About from './pages/extra/About'
import Copyright from './pages/extra/Copyright'
import CopyrightNotice from './pages/extra/CopyrightNotice'
import Developer from './pages/extra/Developer'
import Privacy from './pages/extra/Privacy'
import Support from './pages/extra/Support'
import Takedown from './pages/extra/Takedown'
import Term from './pages/extra/Term'
import Account from './pages/accounts/Account'
import Billing from './pages/accounts/Billing'
// import Exchange from './pages/accounts/Exchange'
import Inbox from './pages/accounts/Inbox'
// import Manage from './pages/accounts/Manage'
import Profile from './pages/accounts/Profile'
import Redeem from './pages/accounts/Redeem'
import Report from './pages/accounts/Report'
// import RequestHistory from './pages/accounts/RequestHistory'
// import Reseller from './pages/accounts/Reseller'
import Statistic from './pages/accounts/Statistic'
import statistic from './containers/accounts/statistic'
// import Transaction from './pages/accounts/Transaction'
// import Premium from './pages/accounts/Premium'

import FileManager from './pages/files/FileManager'
import DownloadFile from './pages/files/DownloadFile'
import { useDispatch } from 'react-redux'

import actions from './pages/sessions/redux/action'

import MiniSideBar from 'components/SideBar'

import Header from 'components/Header'
import PrivateRoute from 'components/PrivateRoute'


const { getProfile } = actions

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProfile())

    return () => { }
  }, [])

  return (
    <Router history={history}>
     <MiniSideBar />
     <div>
        <Switch>
          <PrivateRoute exact path="/" component={Account} />
          {/* <Redirect from="*" to="/" /> */}
          {/* <Route exact path="/" component={Account} /> */}
          <Route path="/login" component={Login} />
          <Route path="/LoginTest" component={LoginTest} />
          <Route path="/register" component={Register} />

          <Route exact path="/about" component={About} />
          <Route exact path="/copyright" component={Copyright} />
          <Route exact path="/copyright_notice" component={CopyrightNotice} />
          <Route exact path="/developer" component={Developer} />
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/support" component={Support} />
          <Route exact path="/takedown" component={Takedown} />
          <Route exact path="/tos" component={Term} />

          <PrivateRoute exact path="/account" component={Account} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/billing" component={Billing} />
          <PrivateRoute exact path="/statistic" component={Statistic} />
          <PrivateRoute exact path="/statistic_old" component={statistic} />
          <PrivateRoute exact path="/inbox" component={Inbox} />
          <PrivateRoute exact path="/report" component={Report} />
          <PrivateRoute exact path="/redeem" component={Redeem} />
          {/* <Route exact path="/billing" component={Billing} />
          <Route exact path="/statistic" component={Statistic} />
          <Route exact path="/inbox" component={Inbox} />
          <Route exact path="/report" component={Report} />
          <Route exact path="/exchange" component={Exchange} />
          <Route exact path="/transaction" component={Transaction} />
          <Route exact path="/manage" component={Manage} />
          <Route exact path="/request-history" component={RequestHistory} />
          <Route exact path="/reseller" component={Reseller} />
          <Route exact path="/redeem" component={Redeem} />
          <Route exact path="/premium" component={Premium} /> */}

          <Route exact path="/fm2" component={FileManager} />
          <Route exact path="/dl/:file_id?s:file_hash?" component={DownloadFile} />
          <Route exact path="/dl/:file_id/:file_name" component={DownloadFile} />


        </Switch>
      </div>
 

    </Router>
  )
}

export default App