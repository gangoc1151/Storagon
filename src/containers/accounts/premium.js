import React, { useEffect, useState } from 'react'
import SideBar from 'components/SideBarOld'
import { useSelector, useDispatch } from 'react-redux'

import vps_step_1 from '../../assets/images/icons/vps_step_1.png'
import vps_step_2 from '../../assets/images/icons/vps_step_2.png'
import vps_step_3 from '../../assets/images/icons/vps_step_3.png'
import visa_mastercard from '../../assets/images/icons/visa_mastercard.png'
import paypal from '../../assets/images/icons/paypal.png'
import webmoney from '../../assets/images/icons/webmoney.png'
import visa from '../../assets/images/icons/visa.png'
import mastercard from '../../assets/images/icons/mastercard.png'
import jcb from '../../assets/images/icons/jcb.png'


import actions from './redux/action'
import { convertFilesize, convertDuration, convertCurrency } from 'actions/constants'
import Modal from 'react-modal'
import countries from '../../assets/countries'

const { getPlan } = actions

const Page = ({ }) => {
    const dispatch = useDispatch()
    const userPlan = useSelector((state) => state.account.plan)

    const [methodModal, setMethodModal] = useState(false)
    const [creditPaymentModal, setCreditPaymentModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    useEffect(() => {
        dispatch(getPlan())

        return () => { }
    }, [])

    const paymentMethod = (plan) => {
        setMethodModal(true)
        setSelectedPlan(plan)
    }

    const closeMethodModal = () => {
        setMethodModal(false)
        setSelectedPlan(null)
    }

    const closeCreditPayment = () => {
        setCreditPaymentModal(false)
        setSelectedPlan(null)
    }

    const creditPayment = () => {
        setMethodModal(false)
        setCreditPaymentModal(true)
    }

    const paypalPayment = () => {
        setMethodModal(false)
    }

    const submitCreditPayment = (event) => {
        event.preventDefault()
        const data = new FormData(event.target)
        console.log(data)
    }

    let plans = []
    let paygates = []
    if (userPlan && userPlan.planIDList) {
        for (var i in userPlan.planIDList) {
            var k = userPlan.planIDList[i]
            userPlan.planConfigDict[k]['planid'] = k;
            plans.push(userPlan.planConfigDict[k]);
        }
    }

    if (userPlan && userPlan.paygateConfigDict) {
        paygates = userPlan.paygateConfigDict
    }

    return (
        <div >
            <div className="vps-order-steps">
                <div className="row">
                    <div className="small-12 columns">
                        <h2>Getting Premium is easy.</h2>
                        <hr />
                        <div className="spacing-top-50"></div>
                        <div className="row">
                            <div data-wow-delay="0.4s" className="large-4 medium-4 columns text-center wow zoomIn hide-for-small-only">
                                <img src={vps_step_2} alt="" />
                            </div>
                            <div data-wow-delay="0.2s" className="large-4 medium-4 columns text-center wow zoomIn hide-for-small-only">
                                <img src={vps_step_1} alt="" />
                            </div>
                            <div data-wow-delay="0.6s" className="large-4 medium-4 columns text-center wow zoomIn hide-for-small-only">
                                <img src={vps_step_3} alt="" />
                            </div>
                            <div className="large-12 columns hide-for-small-only">
                                <div className="order-step">
                                    <div className="row collapse">
                                        <div data-wow-delay="0.2s" className="order-circle large-4 medium-4 columns wow fadeInUp">
                                            <div className="line left-side"></div>
                                            <span className="left-side">1</span>
                                        </div>
                                        <div data-wow-delay="0.4s" className="order-circle large-4 medium-4 columns wow fadeInUp">
                                            <div className="line"></div>
                                            <span>2</span>
                                        </div>
                                        <div data-wow-delay="0.6s" className="order-circle large-4 medium-4 columns wow fadeInUp">
                                            <div className="line right-side"></div>
                                            <span className="right-side">3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="large-4 medium-4 small-12 columns text-center">
                                <img className="show-for-small-only" src={vps_step_2} alt="" />
                                <h3>Signup or Signin Your Account</h3>
                            </div>
                            <div className="large-4 medium-4 small-12 columns text-center">
                                <img className="show-for-small-only" src={vps_step_1} alt="" />
                                <h3>Choose a Premium Plan</h3>
                            </div>
                            <div className="large-4 medium-4 small-12 columns text-center">
                                <img className="show-for-small-only" src={vps_step_3} alt="" />
                                <h3>Complete Your Payment</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pricingboxes">
                <div className="row">
                    {plans.map((plan) => {
                        return (
                            <div key={plan.planid.toString()} data-wow-delay="0.2s" className="small-12 large-3 medium-3 columns wow fadeInUp">
                                <div className="title">{(plan.planid === 4) ? 'Risk Trial Plan' : 'Plan ' + plan.planid}</div>
                                <ul className="pricing-table">
                                    <li className="description">Grant <strong>Premium</strong> status</li>
                                    <li className="bullet-item"> {convertFilesize(plan.storage)}  storage</li>
                                    <li className="bullet-item"> {convertFilesize(plan.download_bandwidth)}  Download bandwidth</li>
                                    <li className="bullet-item">Unlimited Upload bandwidth</li>
                                    <li className="bullet-item">Maximum download speed</li>
                                    <li className="bullet-item">No waiting, No captcha</li>
                                    <li className="price"><span> {convertCurrency(plan.price / 100)} </span> {convertDuration(plan.expires)} </li>
                                    <li className="cta-button"><p><span><a onClick={() => paymentMethod(plan)}>UPGRADE NOW</a></span></p></li>
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>

            <section className="content">
                <div className="padding-top-50 padding-bottom-100">
                    <div className="pricingboxes-comparison">
                        <div className="row">
                            <div className="small-12 columns">
                                <h2>Free vs Premium comparision</h2>
                                <hr />
                            </div>
                        </div>

                        <div className="spacing-30"></div>

                        <div className="row collapse">
                            <div data-wow-delay="0.2s" className="small-12 large-4 medium-4 columns wow zoomIn hostingfeatures animated" style={{ visibility: 'visible', WebkitAnimation: 'zoomIn 0.2s' }}>
                                <div className="title-features">FEATURES</div>
                                <ul className="pricing-table alter features">
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius open" data-selector="tooltip-i4j8ypv80" aria-describedby="tooltip-i4j8ypv80" title="">Storage Space</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv81" aria-describedby="tooltip-i4j8ypv81" title="">Monthly Bandwidth</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv82" aria-describedby="tooltip-i4j8ypv82" title="">Download Speed</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv83" aria-describedby="tooltip-i4j8ypv83" title="">Download Wait</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv84" aria-describedby="tooltip-i4j8ypv84" title="">Access to Premium files</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv85" aria-describedby="tooltip-i4j8ypv85" title="">Access to Premium tools</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv87" aria-describedby="tooltip-i4j8ypv87" title="">24/7 Customer Support</span></li>
                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv88" aria-describedby="tooltip-i4j8ypv88" title="">Automatic Delete File</span></li>
                                </ul>
                            </div>

                            <div data-wow-delay="0.4s" className="small-12 large-4 medium-4 columns wow zoomIn animated" style={{ visibility: 'visible', WebkitAnimation: 'zoomIn 0.4s' }}>
                                <div className="title-alt">FREE</div>
                                <ul className="pricing-table alter">
                                    <li className="bullet-item">20 GB</li>
                                    <li className="bullet-item">500 GB</li>
                                    <li className="bullet-item">Slow</li>
                                    <li className="bullet-item">30 seconds</li>
                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No</div></li>
                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No</div></li>
                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No</div></li>
                                    <li className="bullet-item">Never</li>
                                </ul>
                            </div>

                            <div data-wow-delay="0.6s" className="small-12 large-4 medium-4 columns wow zoomIn animated" style={{ visibility: 'visible', WebkitAnimation: 'zoomIn 0.6s' }}>
                                <div className="title-alt">PREMIUM</div>
                                <ul className="pricing-table alter">
                                    <li className="bullet-item">100 GB and more</li>
                                    <li className="bullet-item">Unlimited</li>
                                    <li className="bullet-item">Unlimited</li>
                                    <li className="bullet-item">No wait</li>
                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                    <li className="bullet-item">Never</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal
                isOpen={methodModal}
                onRequestClose={closeMethodModal}
                style={customStyles}
                appElement={document.getElementById('root')}
            >
                <div>
                    <h4 className="text-center">Select your favorite payment method</h4>
                    <div className="row">
                        <div className="small-12 large-12 medium-12 columns">
                            <div className="panel callout radius">
                                <ul className="listPaygate text-center">
                                    <li className="text-center"><a className="button small" onClick={creditPayment} >Credit Card<br /><img src={visa_mastercard} /></a></li>
                                    <li className="text-center"><a className="button small" onClick={paypalPayment}>Paypal<br /><img src={paypal} /></a></li>
                                    <li className="text-center"><a className="button small secondary disabled" >WebMoney<br /><img src={webmoney} /></a></li>
                                </ul>
                            </div>
                            <form name="empty-form" id="empty-form" method="post" action="">
                            </form>
                        </div>
                    </div>
                    <h6 className="subheader text-center">100% Safe and Anonymous</h6>
                    <a className="close-reveal-modal" aria-label="Close">&#215;</a>
                </div>
            </Modal>

            <Modal
                isOpen={creditPaymentModal}
                onRequestClose={closeCreditPayment}
                style={customStyles}
                appElement={document.getElementById('root')}
            >
                <h4 className="text-center">Please enter your payment information</h4>
                <div className="padding-top-30 padding-bottom-30">
                    <form id="payment" name="payment" onSubmit={submitCreditPayment}>
                        <div className="row">
                            <div className="large-6 columns">
                                <h5>Billing Information</h5>
                                <input type="text" name="first_name" id="first_name" ng-model="$parent.first_name" placeholder="First Name" required />
                                <input type="text" name="last_name" id="last_name" ng-model="$parent.last_name" placeholder="Last Name" required />
                                <input type="text" name="email" id="email" ng-model="$parent.email" placeholder="Email Address" required />
                                <input type="text" name="phone_number" id="phone_number" ng-model="$parent.phone_number" placeholder="Phone" required />
                                <input type="text" name="address" id="address" ng-model="$parent.address" placeholder="Address" required />
                                <input type="text" name="city" id="city" ng-model="$parent.city" placeholder="City" required />
                                <input type="text" name="state" id="state" ng-model="$parent.state" placeholder="State" required />
                                <input type="text" name="zipcode" id="zipcode" ng-model="$parent.zipcode" placeholder="Zip/Postal code" required />
                                <select id="country" name="country" ng-model="$parent.country" required>
                                    <option value="">Select Country</option>
                                    {countries.map((item) => {
                                        return (
                                            <option value={item.code}>{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="large-6 columns">
                                <h5>Credit Card Information</h5>
                                <ul className="inline-list">
                                    <li>We accept:</li>
                                    <li><img src={visa} /></li>
                                    <li><img src={mastercard} /></li>
                                    <li><img src={jcb} /></li>
                                </ul>
                                <input type="text" name="card_number" id="card_number" ng-model="$parent.card_number" placeholder="Card Number" required />
                                <input type="text" name="card_name" id="card_name" ng-model="$parent.card_name" placeholder="Full Name" required />
                                <input type="text" name="card_expiry" id="card_expiry" ng-model="$parent.card_expiry" placeholder="MM/YY" required />
                                <input type="text" name="card_cvc" id="card_cvc" ng-model="$parent.card_cvc" placeholder="CVC" required />
                                <div className="panel callout radius">
                                    {selectedPlan &&
                                        <ul className="no-bullet">
                                            <li>Storage: {convertFilesize(selectedPlan.storage)}</li>
                                            <li>Bandwidth: {convertFilesize(selectedPlan.download_bandwidth)}</li>
                                            <li>Price: {convertCurrency(selectedPlan.price / 100)}</li>
                                        </ul>
                                    }
                                </div>
                                <button type="submit" className="button small expand"> Checkout </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default Page

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '560px',
        width: '90%',
        backgroundColor: 'white'
    },
    overlay: {
        backgroundColor: '#000000cc'
    }
}