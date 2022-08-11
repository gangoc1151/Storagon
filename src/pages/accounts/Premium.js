import React, { Fragment, useState, useEffect } from 'react'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Premium from 'containers/accounts/premium'

const Page = ({ history }) => {

    return (
        <Fragment>
            <Header />
            <div className="content">
                <div id="main">
                    <div autoscroll="">
                        <Premium />
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}

export default Page