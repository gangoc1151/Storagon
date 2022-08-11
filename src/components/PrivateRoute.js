import { Route, Redirect } from 'react-router-dom';
import Token from 'actions/token'


function PrivateRoute({ component: Component, ...rest }) {
    const auth = Token.getToken();
    console.log("token", auth)
    return (
        <Route {...rest} render={props => {
            if (!auth) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            // authorized so return component
            return <Component {...props} />
        }} />
    );
}
export default PrivateRoute;