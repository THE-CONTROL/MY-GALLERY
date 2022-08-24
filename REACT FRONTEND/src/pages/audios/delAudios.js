import { useState, useEffect } from "react"
import {err, customFetcher, imgs} from "../../utils/data"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner, faPlay, faPause, faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons'

const DelAudios = ({flashFunc}) => {
    const [audio, setAudio] = useState({})
    const [status, setStatus] = useState(false)
    const navigate = useNavigate()
    const pathname = useLocation().pathname.split("/")[1]
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>
    const { id, page } = useParams()

    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgAd": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "uAd": "h-16 w-16 sm:w-20 sm:h-20 md:w-24 md:h-24 m-auto mt-4",
        "cdCon": "bg-[#2D2D2D] w-8/12 sm:w-96 m-auto rounded-xl px-4 pb-3 pt-2",
        "btn1": "bg-blue-700 hover:bg-blue-900 p-1 text-xs rounded-md",
        "btn2": "bg-red-700 hover:bg-red-900 p-1 text-xs rounded-md",
        "btnCon": "w-full flex flex-row justify-center gap-3 mt-3",
        "failed": "text-9xl pt-10",
        "wN": "text-red-700 font-bold",
        "ctCon": "w-full flex flex-row gap-4 justify-center",
        "ctBtn": "hover:text-gray-400",
        "adTxt": "text-xs overflow-auto"
    }

    const rd = {
        "alt": "Background image",
        "li": `/audios/${page}`,
        "btn1": "CANCEL",
        "btn2": "DELETE",
        "id": audio.id
    }

    const txt = {
        "wnTxt": "Are you sure you want to delete this audio?",
        "adTxt": "Your browser does not support the audio tag."
    }

    const getAudio = async () => {
        try {
            var { res, data } = await customFetcher(`audios/get/${id}`)
            setAudio(data.audios)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res)
        }
    }


    const playFunc = () => {
        var ad = document.getElementById(rd.id);
        var adImg = document.getElementById(`#${rd.id}`);

        ad.currentTime = 0;
        adImg.classList = ["h-16 w-16 sm:w-20 sm:h-20 md:w-24 md:h-24 m-auto mt-4 border-4 border-green-700"]
        ad.play();
    }


    const pauseFunc = () => {
        var ad = document.getElementById(rd.id);
        ad.classList = [classes.uAd]
        ad.pause();
    }


    const forFunc = () => {
        var ad = document.getElementById(rd.id);

        ad.currentTime = ad.currentTime + 5 >= ad.duration ? ad.currentTime : ad.currentTime + 5 
    }

    
    const backFunc = () => {
        var ad = document.getElementById(rd.id);

        ad.currentTime = ad.currentTime - 5 <= 0 ? 0 : ad.currentTime - 5 
    }


    const delFunc = async () => {
        try {
            const {res, data} = await customFetcher(`audios/delete/${id}`, {method: "DELETE"})
            flashFunc(data.message, res.ok)
            if (res.ok) {
                navigate(`/audios/${page == 1 ? page : page - 1}`, { replace: true })
            }
        }
        catch (e) {
            flashFunc(err.msg, err.val)
        }
    } 

    useEffect(() => {
        getAudio()
        if (`${pathname}/${id}/${page}` != `delAudios/${id}/${page}`) {
            navigate(`/delAudios/${id}/${page}`, { replace: true });
        }
    }, [])

    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[1]} alt={rd.alt} className={classes.bgAd}/>
            {audio?.id && <div className={classes.cdCon}>
                <h2 className={classes.wN}>{txt.wnTxt}</h2>
                <img src={imgs[15]}  id={`#${rd.id}`} alt={rd.alt} className={classes.uAd} />
                <audio id={rd.id}>
                    <source src={audio.link}/>
                    <h4>{txt.adTxt}</h4>
                </audio>
                <p className={classes.adTxt}>{audio.name}</p>
                <div className={classes.ctCon}>
                    <button type={rd.btnType1} onClick={backFunc} className={classes.ctBtn}>
                        <FontAwesomeIcon icon={faBackwardFast}/></button>
                    <button type={rd.btnType1} onClick={pauseFunc} className={classes.ctBtn}>
                        <FontAwesomeIcon icon={faPause}/></button>
                    <button type={rd.btnType1} onClick={playFunc} className={classes.ctBtn}>
                        <FontAwesomeIcon icon={faPlay}/></button>
                    <button type={rd.btnType1} onClick={forFunc} className={classes.ctBtn}>
                        <FontAwesomeIcon icon={faForwardFast}/></button>
                </div>
                <div className={classes.btnCon}>
                    <NavLink to={rd.li} className={classes.btn1}>{rd.btn1}</NavLink>
                    <button onClick={delFunc} className={classes.btn2}>{rd.btn2}</button>
                </div>
            </div>}
            {!audio?.id && !status && <div>
                <h3 className={classes.failed}>{element}</h3>
            </div>}
        </div>
    );
}
 
export default DelAudios;