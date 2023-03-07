import {Route, Switch} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import UserProfile from './components/UserProfile'
import SearchResults from './components/SearchResults'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/my-profile" component={MyProfile} />
    <ProtectedRoute exact path="/users/:id" component={UserProfile} />
    <ProtectedRoute exact path="/searchResults" component={SearchResults} />
    <Route component={NotFound} />
  </Switch>
)

export default App
