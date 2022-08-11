import React, { useEffect, useState } from 'react'
import SideBar from 'components/SideBarOld'
import { useSelector, useDispatch } from 'react-redux'

import actions from './redux/action'
import { fetchApi } from 'actions/api'
import { ApplyStatusFilter, ApplyTypeFilter } from 'actions/constants'
import moment from 'moment'

const { getBilling } = actions

const Page = ({ }) => {
    const dispatch = useDispatch()
    const [applyHistories, setApplyHistories] = useState([])

    useEffect(() => {
        fetchApi('get', 'api/user/userApplyList/')
            .then((data) => {
                console.log({ data })
                setApplyHistories(data)
            })
            .catch((error) => {
                console.log({ error })
            })

        return () => { }
    }, [])

    return (
        <div className="padding-top-30 padding-bottom-30">
            <div className="row padding-bottom-100">
                <SideBar />
                <div className="large-10 push-0 columns">
                    <h5>Request History</h5>
                    <table role="grid" className="table fixed_layout">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Status</th>
                                <th>Created date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applyHistories.map((applyHistory, index) => {
                                return (
                                    <tr id={index.toString()}>
                                        <td> {ApplyTypeFilter[applyHistory.apply_type]} </td>
                                        <td className={(applyHistory.apply_status === 0 || applyHistory.apply_status === 1) ? 'success' : 'danger'}> {ApplyStatusFilter[applyHistory.apply_status]} </td>
                                        <td> {moment(applyHistory.created_date).format('MMM DD,YYYY HH:mm:ss A')}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page