import React, { useEffect, useState } from 'react'
import SideBar from 'components/SideBarOld'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import loading from '../../assets/images/loading.gif'

import actions from './redux/action'

const { getPremiumKey } = actions

const Page = ({ }) => {
    const dispatch = useDispatch()
    const userPremium = useSelector(state => state.account.premiumKeys)
    const userBalance = useSelector(state => state.account.balance)
    const [openModal, setOpenModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        dispatch(getPremiumKey())

        return () => { }
    }, [])

    console.log({ userPremium, userBalance })
    let creditBalance = 0
    if (userBalance && userBalance.length > 0) {
        userBalance.map((item) => {
            creditBalance += item.fields.amount
        })
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    const onOpenModal = () => {
        setOpenModal(true)
    }

    const credits = userPremium && userPremium.length > 0 ? userPremium : []

    return (
        <div className="padding-top-30 padding-bottom-30">
            <div className="row padding-bottom-100">
                <SideBar />
                <div className="large-10 push-0 columns">
                    <h4 className="left">Your Current Credit Balance {creditBalance}</h4>
                    <span className="right"><a data-reveal-id="planModal" onClick={onOpenModal} className="button tiny">Purchase Premium Key</a></span>
                    <hr />
                    <div className="row">
                        <div className="large-12 columns">
                            <h5>Premium Key List</h5>
                        </div>
                    </div>
                    <table role="grid" className="table fixed_layout">
                        <thead>
                            <tr>
                                <th>Premium Code</th>
                                <th>Created</th>
                                <th>UID</th>
                                <th>Activated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {credits.map((credit) => {
                                return (
                                    <tr>
                                        <td>{credit.fields.code}</td>
                                        <td>{credit.fields.created_date}</td>
                                        <td>{credit.fields.activated_user}</td>
                                        <td>{credit.fields.activated_date}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                style={customStyles}
                appElement={document.getElementById('root')}
            >
                <div className="row">
                    <div className="large-12 columns">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h2 className="modal-title text-center" id="myModalLabel">Select plan</h2>
                        </div>
                        <div className="modal-body">
                            <div className="pricingboxes row">
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="loader">
                                <img id="loading-image" src="/static/assets/frontend/images/loading.gif" alt="Loading..." />
                            </div>
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                        {errorMessage && errorMessage.length > 0 &&
                            <div data-alert className="alert-box alert radius" ng-show="error">
                                {errorMessage}
                            </div>
                        }
                        {fetching &&
                            <div className="loader" style={{ display: 'block' }}>
                                <img id="loading-image" src={loading} alt="Loading..." />
                            </div>
                        }
                    </div>
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