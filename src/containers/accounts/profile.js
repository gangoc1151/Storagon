import React, { useEffect, useState } from 'react'
import SideBar from 'components/SideBarOld'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import loading from '../../assets/images/loading.gif'

import actions from './redux/action'
import authActions from 'containers/sessions/redux/action'
import Token from 'actions/token'

const { getProfile, updateProfile } = authActions

const Page = ({ }) => {
    const dispatch = useDispatch()
    const user = Token.getUser()
    const fetching = useSelector(state => state.auth.fetching)

    const [fullname, setFullname] = useState(user ? user.profile.fields.full_name : '')
    const [address, setAddress] = useState(user ? user.profile.fields.address : '')
    const [email, setEmail] = useState(user ? user.profile.fields.email : '')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        dispatch(getProfile())

        return () => { }
    }, [])

    onsubmit = (event) => {
        event.preventDefault()

        if (newPassword != confirmPassword) {
            message.error('New password and confirm new password are not match')
            return
        }

        dispatch(updateProfile({ full_name: fullname, address: address, email: email, old_password: currentPassword, password: newPassword }))
    }

    return (
        <div className="padding-top-30 padding-bottom-30">
            <div className="row padding-bottom-100">
                <SideBar />
                <div className="large-10 push-0 columns">
                    <div id="profile">
                        <form id="profile_form" novalidate="novalidate" ng-submit="processForm()">
                            <div className="row">
                                <div className="large-8 columns">
                                    <div className="loader">
                                        <img id="loading-image" src="/static/assets/frontend/images/ajax-spinner.gif" alt="Loading..." />
                                    </div>
                                    <h5>Personal Information</h5>
                                    <p>
                                        <label for="full_name">Full Name:</label>
                                        <input type="text" tabIndex="2" placeholder="Full Name" required value={fullname} onChange={(event) => setFullname(event.target.value)} />
                                    </p>
                                    <p>
                                        <label for="address">Address:</label>
                                        <input type="text" tabIndex="3" placeholder="Address" required value={address} onChange={(event) => setAddress(event.target.value)} />
                                    </p>
                                    <p>
                                        <label for="email">Email:</label>
                                        <input type="text" tabIndex="4" placeholder="Email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                                    </p>
                                    <hr />
                                    <h5>Change Password</h5>
                                    <p>
                                        <label for="account-password">Current Password:</label>
                                        <input type="password" tabIndex="4" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                                    </p>
                                    <p>
                                        <label for="account-new-password">New Password:</label>
                                        <input type="password" tabIndex="5" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                                    </p>
                                    <p>
                                        <label for="account-confirm-password">Confirm New Password:</label>
                                        <input type="password" tabIndex="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                                    </p>
                                    <button onClick={onsubmit} type="submit" className="button expand">Submit</button>
                                </div>
                            </div>
                        </form>
                        {fetching &&
                            <div className="loader" style={{ display: 'block' }}>
                                <img id="loading-image" src={loading} alt="Loading..." />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page