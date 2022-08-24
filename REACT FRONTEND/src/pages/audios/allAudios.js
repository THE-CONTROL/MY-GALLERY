import { customFetcher, err, imgs } from "../../utils/data";
import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner, faTrash, faPlay, faPause, faBackwardFast, faForwardFast, faDownload } from '@fortawesome/free-solid-svg-icons'
import FullAudio from "../../modals/fullAudio";

const Audios = ({flashFunc}) => {
    const [audios, setAudios] = useState([])
    const [fullAudio, setFullAudio] = useState(-1)
    const [status, setStatus] = useState(false)
    const [meta, setMeta] = useState({})
    const [tO, setTO] = useState()
    const { page } = useParams()
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>
    const classes = {
        "container": "pt-[120px] text-white text-center overflow-auto h-screen pb-10",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgAd": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-30 object-cover",
        "btn": "bg-blue-700 hover:bg-blue-900 p-1 text-sm rounded-md",
        "empty": "text-3xl mb-3",
        "failed": "text-9xl pt-10",
        "audios": "w-64 h-40 object-cover hover:border-4 hover:border-blue-700 lg:w-72 lg:h-52",
        "audiosCon": "w-full h-full px-2 sm:px-4 flex flex-wrap gap-8 justify-center overflow-auto",
        "pgCon": "bg-slate-700 opacity-70 mt-6 w-fit flex flex-row m-auto mb-7",
        "pg1": "w-fit py-1 px-2 border hover:bg-slate-900",
        "pg2": "w-fit py-1 px-2 border bg-slate-900",
        "ctCon": "w-full flex flex-row gap-4 justify-center",
        "ctBtn": "hover:text-gray-400",
        "adTxt": "text-xs overflow-auto w-64"
    }

    const rd = {
        "alt": "Background image",
        "btn": "ADD",
        "li": "/addAudios",
        "li2": "/delAudios/",
        "li3": "/audios/",
        "nF": "No audios yet!",
        "pv": "Prev",
        "nt": "Next",
        "vdTxt": "Your browser does not support the audio tag.",
        "btnType": "button",
        "dl": "audio",
        "tg": "_blank"
    }

    const getAudios = async (pg=page) => {
        try {
            pauseAll()
            var { res, data } = await customFetcher(`audios/get/all/${pg}`)
            setAudios(data.audios.items)
            setMeta(data.audios.meta)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res.ok)
        }
    }


    const playFunc = (id) => {
        pauseAll()
        var ad = document.getElementById(id);
        var adIm = document.getElementById(`#${id}`);

        adIm.classList = ["w-64 h-40 object-cover border-4 border-green-700 lg:w-72 lg:h-52"]
        ad.currentTime = 0;
        ad.play();

        const time = ad.duration * 1000
        const next = id + 1

        if (next < audios.length)
            setTO(setTimeout(playFunc, time, next))
    }


    const pauseAll = () => {
        for (let item in audios) {
            pauseFunc(item)
        }
    }


    const forFunc = (id) => {
        clearTimeout(tO)
        var ad = document.getElementById(id);

        ad.currentTime = ad.currentTime + 5 >= ad.duration ? ad.currentTime : ad.currentTime + 5 
        const time = (ad.duration - ad.currentTime) * 1000
        const next = id + 1
        setTO(setTimeout(playFunc, time, next))
    }

    const backFunc = (id) => {
        clearTimeout(tO)
        var ad = document.getElementById(id);

        ad.currentTime = ad.currentTime - 5 <= 0 ? 0 : ad.currentTime - 5 
        const time = (ad.duration - ad.currentTime) * 1000
        const next = id + 1
        setTO(setTimeout(playFunc, time, next))
    }

    const pauseFunc = (id) => {
        var ad = document.getElementById(id);
        var adIm = document.getElementById(`#${id}`);

        adIm.classList = ["w-64 h-40 object-cover hover:border-4 hover:border-blue-700 lg:w-72 lg:h-52"]
        ad.pause(); 
        clearTimeout(tO)
    }


    const nav = (pg) => {
        navigate(`${rd.li3}${pg}`, { replace: true });
    }


    useEffect(() => {
        getAudios()
        if (`${pathname}/${page}` != `audios/${page}`) {
            navigate(`/audios/${page}`, { replace: true });
        }
    }, [page])

    return ( 
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[16]} alt={rd.alt} className={classes.bgAd}/>
            {fullAudio < 0 && <div>
                {status && <div>
                    {audios.length > 0 && <div> 
                        <div className={classes.audiosCon}>
                            {audios.map((ad, index) => ( <div key={ad.id}>
                                <img src={imgs[15]} alt={rd.alt} className={classes.audios} id={`#${index}`} 
                                onClick={() => {setFullAudio(index)}} />
                                <audio id={index}>
                                    <source src={ad.link}/>
                                    <h4>{rd.vdTxt}</h4>
                                </audio>
                                <p className={classes.adTxt}>{ad.name}</p>
                                <div className={classes.ctCon}>
                                    <button type={rd.btnType} onClick={() => {backFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faBackwardFast}/></button>
                                    <button type={rd.btnType} onClick={() => {pauseFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faPause}/></button>
                                    <button type={rd.btnType} onClick={() => {playFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faPlay}/></button>
                                    <button type={rd.btnType} onClick={() => {forFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faForwardFast}/></button>
                                    <a href={ad.link} target={rd.tg} download={rd.dl} className={classes.ctBtn}>
                                    <FontAwesomeIcon icon={faDownload}/>
                                    </a> 
                                    <NavLink to={`${rd.li2}${ad.id}/${page}`} className={classes.ctBtn}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </NavLink>
                                </div>
                            </div>))}
                        </div>
                        <div className={classes.pgCon}>
                            {meta.prev_page && <h3 className={classes.pg1} onClick={() => {nav(meta.prev_page)}}>
                            {rd.pv}</h3>}
                            {meta.pages.map((page, index) => (<h3 key={index} onClick={() => {nav(page)}}
                            className={page == meta.page ? classes.pg2 : classes.pg1}>{page}</h3>))}
                            {meta.next_page && <h3 className={classes.pg1} onClick={() => {nav(meta.next_page)}}>
                            {rd.nt}</h3>}
                        </div>
                    </div>}
                    {!audios.length && <div>
                        <h3 className={classes.empty}>{rd.nF}</h3>
                    </div>}
                    <NavLink to={rd.li} className={classes.btn}>{rd.btn}</NavLink>
                </div>}
                {!audios.length && !status && <div>
                    <h3 className={classes.failed}><span>{element}</span></h3>
                </div>}
            </div>}
            {fullAudio > -1 && <FullAudio setFullAudio={setFullAudio} fullAudio={fullAudio} 
            audios={audios}/>}
        </div>
     );
}
 
export default Audios;