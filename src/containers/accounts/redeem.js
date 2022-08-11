import React, { useEffect, useState } from 'react'
import SideBar from 'components/SideBarOld'
import { useSelector, useDispatch, } from 'react-redux'
import loading from '../../assets/images/loading.gif'

import actions from './redux/action'
import { fetchApi } from 'actions/api'
import { message } from 'antd'

const { getBilling } = actions

const Page = ({ }) => {
    const dispatch = useDispatch()
    const [fetching, setFetching] = useState(false)

    const [code, setCode] = useState('')
    const [codeType, setCodeType] = useState(null)

    useEffect(() => {
        dispatch(getBilling())

        return () => { }
    }, [])

    const onSubmit = (event) => {
        event.preventDefault()

        setFetching(true)
        fetchApi('post', 'clapi/premium/exchangePremiumKey/', { premium_code: code })
            .then((data) => {
                console.log({ data })
                if (data && data.error) {
                    message.error(data.error)
                } else {

                }
                setFetching(false)
            })
            .catch((error) => {
                console.log({ error })
                message.error('Redeem code or code type is not valid')
                setFetching(false)
            })
    }

    const types = [{ id: 1, name: "Premium" }]

    return (
        <div className="padding-top-30 padding-bottom-30">
            <div className="row padding-bottom-100">
                <SideBar />

                <div className="large-10 push-0 columns">
                    <div id="redeem">
                        <form id="redeem_form" novalidate="novalidate" ng-submit="processForm()">
                            <div className="row">
                                <div className="large-8 columns">
                                    <h5>Redeem Code</h5>
                                    <p>
                                        <label for="redeem_code">Redeem code:</label>
                                        <input type="text" name="redeem_code" id="redeem_code" tabIndex="2" placeholder="Redeem Code" value={code} onChange={event => setCode(event.target.value)} required />
                                    </p>
                                    <p>
                                        <label for="code_type">Code type:</label>
                                        <select type="text" name="code_type" id="code_type" tabIndex="3" value={codeType} onChange={event => setCodeType(event.target.value)} required>
                                            <option value="">- Choose Code Type -</option>
                                            {types.map((item) => {
                                                return (
                                                    <option value={item.id}>{item.name}</option>
                                                )
                                            })}
                                        </select>
                                    </p>
                                    <button onClick={onSubmit} type="submit" className="button expand">Submit</button>
                                    {fetching &&
                                        <div className="loader show">
                                            <img id="loading-image" src={loading} alt="Loading..." />
                                        </div>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page