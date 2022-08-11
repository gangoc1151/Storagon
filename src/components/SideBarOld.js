import Token from 'actions/token'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const LocationPath = ({path, name, currentPath}) => {
    return (
        <li className={currentPath == path ? 'active-path' : []}><a href={path}>{name}</a></li>
    )
}

const SideBar = ({ }) => {
    const user = useSelector(state => state.auth.currentUser)
    const history = useHistory()
    const { location } = history

    const [accountMenu, setAccountMenu] = useState(location.pathname == '/billing' || location.pathname == '/redeem' || location.pathname == '/profile')
    const [affiliateMenu, setAffiliateMenu] = useState(location.pathname == '/manage' || location.pathname == '/statistic' || location.pathname == '/transaction' || location.pathname == '/request-history' || location.pathname == '/affiliate-tool')
    let showAffiliate = false
    let showReseller = false

    if (user && user.profile && user.profile.fields && user.profile.fields.account_type) {
        if (user.profile.fields.account_type == 1 || user.profile.fields.account_type == 3) {
            showAffiliate = true
        } else if (user.profile.fields.account_type == 2) {
            showReseller = true;
        }
    }

    return (
        <div className="large-2 pull-10 columns">
            <p><img className="th" src='http://placehold.it/128x128' /></p>
            <ul className="side-nav">
                <LocationPath path='/account' name='Overview' currentPath={location.pathname} />
                <li>
                    <a onClick={() => setAccountMenu(!accountMenu)}>My Account</a>
                    {accountMenu &&
                        <ul className="hidden-list">
                            <LocationPath path='/billing' name='Billing history' currentPath={location.pathname} />
                            <li className="divider"></li>
                            <LocationPath path='/redeem' name='Redeem' currentPath={location.pathname} />
                            <li className="divider"></li>
                            <LocationPath path='/profile' name='Edit Profile' currentPath={location.pathname} />
                        </ul>
                    }
                </li>
                <LocationPath path='/inbox' name='Inbox' currentPath={location.pathname} />
                <LocationPath path='/report' name='Report' currentPath={location.pathname} />
                {showAffiliate &&
                    <li>
                        <a onClick={() => setAffiliateMenu(!affiliateMenu)}>Affiliate</a>
                        {affiliateMenu &&
                            <ul className="hidden-list">
                                <LocationPath path='/manage' name='Dashboard' currentPath={location.pathname} />
                                <li className="divider"></li>
                                <LocationPath path='/statistic' name='Statistic' currentPath={location.pathname} />
                                <li className="divider"></li>
                                <LocationPath path='/transaction' name='Transactions' currentPath={location.pathname} />
                                <li className="divider"></li>
                                <LocationPath path='/request-history' name='Request History' currentPath={location.pathname} />
                                <li className="divider"></li>
                                <LocationPath path='/affiliate-tool' name='Affiliate Tools' currentPath={location.pathname} />
                            </ul>
                        }
                    </li>
                }
                {showReseller &&
                    <LocationPath path='/reseller' name='Reseller' currentPath={location.pathname} />
                }
            </ul>
        </div>
    )
}

export default SideBar