import { customFetcher, err, imgs } from "../../utils/data";
import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner, faTrash, faPlay, faPause, faBackwardFast, faForwardFast, faDownload } from '@fortawesome/free-solid-svg-icons'
import FullVideo from "../../modals/fullVideo";

const Videos = ({flashFunc}) => {
    const [videos, setVideos] = useState([])
    const [fullVideo, setFullVideo] = useState(-1)
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
        "bgVid": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-30 object-cover",
        "btn": "bg-blue-700 hover:bg-blue-900 p-1 text-sm rounded-md",
        "empty": "text-3xl mb-3",
        "failed": "text-9xl pt-10",
        "videos": "w-64 h-40 object-cover hover:border-4 hover:border-blue-700 lg:w-72 lg:h-52",
        "videosCon": "w-full h-full px-2 sm:px-4 flex flex-wrap gap-8 justify-center overflow-auto",
        "pgCon": "bg-slate-700 opacity-70 mt-6 w-fit flex flex-row m-auto mb-7",
        "pg1": "w-fit py-1 px-2 border hover:bg-slate-900",
        "pg2": "w-fit py-1 px-2 border bg-slate-900",
        "ctCon": "w-full flex flex-row gap-4 justify-center",
        "ctBtn": "hover:text-gray-400",
        "vidTxt": "text-xs overflow-auto w-64"
    }

    const rd = {
        "alt": "Background image",
        "btn": "ADD",
        "li": "/addVideos",
        "li2": "/delVideos/",
        "li3": "/videos/",
        "nF": "No videos yet!",
        "pv": "Prev",
        "nt": "Next",
        "vdTxt": "Your browser does not support the video tag.",
        "btnType": "button",
        "dl": "video",
        "tg": "_blank"
    }

    const getVideos = async (pg=page) => {
        try {
            pauseAll()
            var { res, data } = await customFetcher(`videos/get/all/${pg}`)
            setVideos(data.videos.items)
            setMeta(data.videos.meta)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res.ok)
        }
    }


    const playFunc = (id) => {
        try {
            clearTimeout(tO)
            pauseAll()
            var vid = document.getElementById(id);

            vid.currentTime = 0;
            vid.classList = ["w-64 h-40 object-cover border-4 border-green-700 lg:w-72 lg:h-52"]
            vid.play();

            const time = vid.duration * 1000
            const next = id + 1

            if (next < videos.length)
                setTO(setTimeout(playFunc, time, next))
        }
        catch(e) {
            console.log(e)
        }
    }


    const pauseAll = () => {
        for (let item in videos) {
            pauseFunc(item)
        }
    }


    const pauseFunc = (id) => {
        var vid = document.getElementById(id);

        vid.classList = ["w-64 h-40 object-cover hover:border-4 hover:border-blue-700 lg:w-72 lg:h-52"]
        vid.pause();

    }


    const forFunc = (id) => {
        clearTimeout(tO)
        var vi = document.getElementById(id);

        vi.currentTime = vi.currentTime + 5 >= vi.duration ? vi.currentTime : vi.currentTime + 5 
        const time = (vi.duration - vi.currentTime) * 1000
        const next = id + 1
        setTO(setTimeout(playFunc, time, next))
    }

    const backFunc = (id) => {
        clearTimeout(tO)
        var vi = document.getElementById(id);

        vi.currentTime = vi.currentTime - 5 <= 0 ? 0 : vi.currentTime - 5 
        const time = (vi.duration - vi.currentTime) * 1000
        const next = id + 1
        setTO(setTimeout(playFunc, time, next))
    }

    const nav = (pg) => {
        navigate(`${rd.li3}${pg}`, { replace: true });
    }


    useEffect(() => {
        getVideos()
        if (`${pathname}/${page}` != `videos/${page}`) {
            navigate(`/videos/${page}`, { replace: true });
        }
    }, [page])

    return ( 
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[8]} alt={rd.alt} className={classes.bgVid}/>
            {fullVideo < 0 && <div>
                {status && <div>
                    {videos.length > 0 && <div> 
                        <div className={classes.videosCon}>
                            {videos.map((vid, index) => ( <div key={vid.id}>
                                <video className={classes.videos} id={index} onClick={() => 
                                    {setFullVideo(index)}} >
                                    <source src={vid.link}/>
                                    <h4>{rd.vdTxt}</h4>
                                </video>
                                <p className={classes.vidTxt}>{vid.name}</p>
                                <div className={classes.ctCon}>
                                    <button type={rd.btnType} onClick={() => {backFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faBackwardFast}/></button>
                                    <button type={rd.btnType} onClick={() => {pauseFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faPause}/></button>
                                    <button type={rd.btnType} onClick={() => {playFunc(index);}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faPlay}/></button>
                                    <button type={rd.btnType} onClick={() => {forFunc(index)}} 
                                    className={classes.ctBtn}><FontAwesomeIcon icon={faForwardFast}/></button>
                                    <a href={vid.link} target={rd.tg} download={rd.dl} className={classes.ctBtn}>
                                    <FontAwesomeIcon icon={faDownload}/>
                                    </a> 
                                    <NavLink to={`${rd.li2}${vid.id}/${page}`} className={classes.ctBtn}>
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
                    {!videos.length && <div>
                        <h3 className={classes.empty}>{rd.nF}</h3>
                    </div>}
                    <NavLink to={rd.li} className={classes.btn}>{rd.btn}</NavLink>
                </div>}
                {!videos.length && !status && <div>
                    <h3 className={classes.failed}><span>{element}</span></h3>
                </div>}
            </div>}
            {fullVideo > -1 && <FullVideo setFullVideo={setFullVideo} fullVideo={fullVideo} 
            videos={videos}/>}
        </div>
     );
}
 
export default Videos;