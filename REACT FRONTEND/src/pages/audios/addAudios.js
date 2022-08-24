import { useEffect, useState } from "react"
import {err, customFetcher, imgs} from "../../utils/data"
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAudio, faRectangleXmark, faPlay, faPause, faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons'
import upMed from "../../utils/media"

const AddAudios = ({flashFunc}) => {
    const [audio, setAudio] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState("")
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()

    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgad": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "form": "w-fit m-auto flex flex-col gap-5",
        "cdCon": "bg-[#2D2D2D] w-8/12 sm:w-96 m-auto rounded-xl px-4 pb-3 pt-2",
        "inCon": "rounded-full flex flex-row bg-[#ffffff20] hover:bg-[#ffffff40]",
        "icon": "py-[6px] sm:py-[8px] w-2/12 bg-transparent text-lg sm:text-xl pl-2 md:text-2xl text-center rounded-full",
        "in": "w-full rounded-full bg-transparent px-3 focus:bg-[#ffffff40] md:py-[10px] py-[6px] sm:py-[8px]",
        "btn": "w-fit p-2 m-auto text-sm bg-green-600 hover:bg-green-800 rounded-full font-medium",
        "adCon": "w-full",
        "canBtnCon": "w-full flex justify-center",
        "canBtn": "text-red-600 ml-16 hover:text-red-800",
        "ad": "w-20 h-20 m-auto",
        "ld": "text-center font-semibold text-xs",
        "failed": "text-9xl pt-10",
        "ctCon": "w-full flex flex-row gap-4 justify-center",
        "ctBtn": "hover:text-gray-400",
        "adTxt": "text-xs overflow-auto"
    }

    const ad = {"icon": faFileAudio, "ty": "file", "mediaType": "audio"}

    const rd = {
        "alt": "Background image",
        "btn": "ADD AUDIO",
        "btnType": "submit",
        "btnType1": "button",
        "id": 1,
        "vdTxt": "Your browser does not support the audio tag."
    }


    const setAd = async (e, mediaType, setter) => {
        setAudio("")
        setLoading("Loading...")
        try {
            upMed(e, mediaType, setter, setLoading, setName)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
            setLoading("Failed!")
            classes.ld = "text-center font-semibold text-xs text-red-700"
            console.log(e)
        }
    }


    const playFunc = () => {
        var ad = document.getElementById(rd.id);
        var adImg = document.getElementById(`#${rd.id}`);

        adImg.classList = ["w-20 h-20 m-auto border-4 border-green-700"]

        ad.currentTime = 0;
        ad.play();
    }


    const pauseFunc = () => {
        var ad = document.getElementById(rd.id);
        var adImg = document.getElementById(`#${rd.id}`);

        adImg.classList = [classes.ad]

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


    const remove = () => {
        setAudio("")
        setLoading("")
    }


    const submitFunc = async (e) => {
        e.preventDefault()
        const body = {
            link: audio,
            name: name
        }
        try {
            const {res, data} = await customFetcher("audios/add", {method: "POST", body: JSON.stringify(body)})
            flashFunc(data.message, res.ok)
            if (res.ok) {
                navigate("/audios/1", { replace: true });
            }
        }
        catch (e) {
            flashFunc(err.msg, err.val)
        }
    } 


    useEffect(() => {
        if (pathname != "addAudios") {
            navigate("/addAudios", { replace: true });
        }
    }, [])


    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[9]} alt={rd.alt} className={classes.bgad}></img>
            <div className={classes.cdCon}>
                <form className={classes.form} onSubmit={(e) => {submitFunc(e)}}>
                    <div className={classes.inCon}>
                        <div className={classes.icon}>
                            <FontAwesomeIcon icon={ad.icon}/>
                        </div>
                        <input type={ad.ty} className={classes.in} onChange={(e) =>{setAd(e, ad.mediaType, setAudio)}}/>
                    </div>
                    {audio && <div className={classes.adCon}>
                        <div className={classes.canBtnCon}>
                            <button className={classes.canBtn} onClick={remove}>
                                <FontAwesomeIcon icon={faRectangleXmark}/></button>
                        </div>
                        <img src={imgs[15]}  id={`#${rd.id}`} alt={rd.alt} className={classes.ad} />
                        <audio id={rd.id} loop>
                            <source src={audio}/>
                            <h4>{rd.vdTxt}</h4>
                        </audio>
                        <p className={classes.adTxt}>{name}</p>
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
                    </div>}
                    {!audio && loading && <h6 className={classes.ld}>{loading}</h6>}
                    {audio && <button type={rd.btnType} className={classes.btn}>{rd.btn}</button>}
                </form>
            </div>
        </div>
    );
}
 
export default AddAudios;