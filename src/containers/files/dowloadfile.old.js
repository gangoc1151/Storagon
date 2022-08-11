import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchApi } from 'actions/api'
import { convertFilesize, DownloadType } from 'actions/constants'
import Token from 'actions/token'

const Page = () => {

    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState(0)
    const { file_id, file_hash } = useParams()
    const [counter, setCounter] = useState(5)
    const user = Token.getUser()

    useEffect(() => {
        setTimeout(() => {
            if (counter > 0) {
                setCounter(counter - 1)
            }
        }, 1000)
    }, [counter])

    useEffect(() => {
        if (file_id, file_hash) {
            fetchApi('get', 'clapi/file/getFile/', { file_id, file_hash: file_hash })
                .then((data) => {
                    try {
                        setFileSize(data.file_size)
                        setFileName(data.file_name)
                    } catch (error) {

                    }
                    console.log({ fileSearch: data })
                })
                .catch((error) => {
                    console.log({ error })
                })
        }


        return () => { }
    }, [])

    const normalDownload = () => {
        fetchApi('post', 'clapi/session/createDownloadSession/', { userFile_id: file_id, download_type: DownloadType.direct })
            .then((data) => {
                console.log({ data })
                if (data && data.download_link) {
                    window.open(data.download_link)
                }
            })
            .catch((error) => {
                console.log({ error })
                alert('Cannot open downlink')
            })
    }

    const torrentDownload = () => {
        fetchApi('post', 'clapi/session/createDownloadSession/', { userFile_id: file_id, download_type: DownloadType.torrent })
            .then((data) => {
                if (data && data.download_link) {
                    window.open(data.download_link)
                }
            })
            .catch((error) => {
                console.log({ error })
            })
    }

    return (
        <div className="padding-top-50">
            <div className="row">
                <div className="large-4 columns">
                    <ul className="large-block-grid-1 testimonialsContainer">
                        <li className="testimonial-item">
                            <div className="testimonial-text">
                                <p className="text-center padding-top-20"><strong>File Information</strong></p>
                                <p>Name: <strong>{fileName}</strong></p>
                                <p>Size: <strong>{convertFilesize(fileSize)}</strong></p>
                                <h6><a id="reportDMCA" >Report DMCA</a></h6>
                            </div>
                        </li>
                    </ul>
                    <div id="downloadProcess">
                        <div className="padding-top-20 padding-bottom-20">
                            <ul className="countdown">
                                <li> <span className="hours">00</span>
                                    <p className="hours_ref">hours</p>
                                </li>
                                <li className="seperator">:</li>
                                <li> <span className="minutes">00</span>
                                    <p className="minutes_ref">minutes</p>
                                </li>
                                <li className="seperator">:</li>
                                <li> <span className="seconds">00</span>
                                    <p className="seconds_ref">seconds</p>
                                </li>
                            </ul>
                            <div id="progress"></div>
                        </div>

                        <a id="result_file" className="text-center"  download="{{file_name}}"></a>
                        <div id="help_message_download" className="panel text-center">
                            <strong>Please choose your download type</strong>
                        </div>
                        <section className="btn-wrapper-download">
                            <div className="download-btns small-12 columns">
                                <a className="button expand browser-download-btn hvr-hang text-justify" id="freedl" title="Download and decrypt file using browser"><img style={{width: '28px', height: '28px', marginTop: '-7px'}} src="/static/assets/frontend/images/idm.png"/> Download decrypted file by browser</a>
                                    <a className="button expand torrent-download-btn hvr-hang text-justify" id="torrentdl" title="Download encrypted file with torrent"><img style={{width: '37px', height: '37px', marginTop: '-12px'}} src="/static/assets/frontend/images/utorrent.png"/> Download encrypted file by torrent</a>
                                        <a className="button expand direct-download-btn hvr-hang text-justify" id="idmdl" title="Direct download encrypted file"><img style={{width: '37px', height: '37px', marginTop: '-12px'}} src="/static/assets/frontend/images/encrypted_file.png"/> Download encrypted file directly</a>
              </div>
            </section>
                                    <div id="help_message" className="panel">
                                        If you choose to download encrypted file, you will need to use our <a href="/download-tool" target="_blank">Decrypt Application</a> in order to decrypt it! <a href="/download-tool">Download App</a>
                                    </div>
                                    <input type="hidden" id="user_id" value="{{ user.profile.id }}" />
                                        <input type="hidden" id="deviceId" value="" />
          </div>
        </div>
                                    <div className="pricingboxes-comparison">
                                        <div className="row collapse">
                                            <div data-wow-delay="0.2s" className="large-4 medium-4 columns wow zoomIn hostingfeatures animated" style={{visibility: 'visible', WebkitAnimation: 'zoomIn 0.2s'}}>
                                                <div className="title-features">FEATURES</div>
                                                <ul className="pricing-table alter features">
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius open" data-selector="tooltip-i4j8ypv80" aria-describedby="tooltip-i4j8ypv80" title="">Storage Space</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv81" aria-describedby="tooltip-i4j8ypv81" title="">Monthly Bandwidth</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv82" aria-describedby="tooltip-i4j8ypv82" title="">Download Speed</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv83" aria-describedby="tooltip-i4j8ypv83" title="">Download Wait</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv84" aria-describedby="tooltip-i4j8ypv84" title="">Access to Premium files</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv85" aria-describedby="tooltip-i4j8ypv85" title="">Access to Premium tools</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv86" aria-describedby="tooltip-i4j8ypv86" title="">Limit number of download per day</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv87" aria-describedby="tooltip-i4j8ypv87" title="">24/7 Customer Support</span></li>
                                                    <li className="bullet-item"><span data-tooltip="" className="has-tip tip-right radius" data-selector="tooltip-i4j8ypv88" aria-describedby="tooltip-i4j8ypv88" title="">Automatic Delete File</span></li>
                                                </ul>
                                            </div>

                                            <div data-wow-delay="0.4s" className="large-4 medium-4 columns wow zoomIn animated" style={{visibility: 'visible', WebkitAnimation: 'zoomIn 0.4s'}}>
                                                <div className="title-alt">FREE</div>
                                                <ul className="pricing-table alter">
                                                    <li className="bullet-item">50 GB</li>
                                                    <li className="bullet-item">250 GB</li>
                                                    <li className="bullet-item">Average</li>
                                                    <li className="bullet-item">30 seconds</li>
                                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No</div></li>
                                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No</div></li>
                                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No</div></li>
                                                    <li className="bullet-item">Never</li>
                                                    <li className="price"><span>Free</span></li>
                                                    <li className="cta-button freedl"><p><span><a  id="showFreeDownloadProcess">Free Download</a></span></p></li>
                                                </ul>
                                            </div>

                                            <div data-wow-delay="0.6s" className="large-4 medium-4 columns wow zoomIn animated" style={{visibility: 'visible', WebkitAnimation: 'zoomIn 0.6s'}}>
                                                <div className="title-alt">PREMIUM</div>
                                                <ul className="pricing-table alter">
                                                    <li className="bullet-item">500 GB and more</li>
                                                    <li className="bullet-item">1 TB and more</li>
                                                    <li className="bullet-item">Unlimited</li>
                                                    <li className="bullet-item">No wait</li>
                                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                                    <li className="bullet-item"><i className="fa fa-times"></i> <div className="show-for-small">No Limit</div></li>
                                                    <li className="bullet-item"><i className="fa fa-check"></i> <div className="show-for-small">Yes</div></li>
                                                    <li className="bullet-item">Never</li>
                                                    <li className="price"><span>$12.99 <sub>/mo.</sub></span></li>
                                                    <li className="cta-button"><p><span><a  id="showPlanModal">Premium Download</a></span></p></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
      </div>
                            </div>
                            )
}

                            export default Page