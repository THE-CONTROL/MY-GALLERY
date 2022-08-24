import { useEffect, useState } from "react"
import {err, customFetcher, imgs} from "../../utils/data"
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faRectangleXmark, faPlay, faPause, faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons'
import upMed from "../../utils/media"

const AddVideos = ({flashFunc}) => {
    const [video, setVideo] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState("")
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()

    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgVid": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "form": "w-fit m-auto flex flex-col gap-5",
        "cdCon": "bg-[#2D2D2D] w-8/12 sm:w-96 m-auto rounded-xl px-4 pb-3 pt-2",
        "inCon": "rounded-full flex flex-row bg-[#ffffff20] hover:bg-[#ffffff40]",
        "icon": "py-[6px] sm:py-[8px] w-2/12 bg-transparent text-lg sm:text-xl pl-2 md:text-2xl text-center rounded-full",
        "in": "w-full rounded-full bg-transparent px-3 focus:bg-[#ffffff40] md:py-[10px] py-[6px] sm:py-[8px]",
        "btn": "w-fit p-2 m-auto text-sm bg-green-600 hover:bg-green-800 rounded-full font-medium",
        "vidCon": "w-full",
        "canBtnCon": "w-full flex justify-center",
        "canBtn": "text-red-600 ml-16 hover:text-red-800",
        "vid": "w-20 h-20 m-auto",
        "ld": "text-center font-semibold text-xs",
        "failed": "text-9xl pt-10",
        "ctCon": "w-full flex flex-row gap-4 justify-center",
        "ctBtn": "hover:text-gray-400",
        "vidTxt": "text-xs overflow-auto"
    }

    const vid = {"icon": faVideo, "ty": "file", "mediaType": "video"}

    const rd = {
        "alt": "Background image",
        "btn": "ADD VIDEO",
        "btnType": "submit",
        "btnType1": "button",
        "id": 1,
        "vdTxt": "Your browser does not support the video tag."
    }
    

    const setVid = async (e, mediaType, setter) => {
        setVideo("")
        setLoading("Loading...")
        try {
            upMed(e, mediaType, setter, setLoading, setName)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
            setLoading("Failed!")
            classes.ld = "text-center font-semibold text-xs text-red-700"
        }
    }


    const playFunc = () => {
        var vid = document.getElementById(rd.id);
        vid.currentTime = 0;
        vid.classList = ["w-20 h-20 m-auto border-4 border-green-700"]
        vid.play();
    }


    const pauseFunc = () => {
        var vid = document.getElementById(rd.id);
        vid.classList = [classes.vid]
        vid.pause();
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
        setVideo("")
        setLoading("")
    }


    const submitFunc = async (e) => {
        e.preventDefault()
        const body = {
            link: video,
            name: name
        }
        try {
            const {res, data} = await customFetcher("videos/add", {method: "POST", body: JSON.stringify(body)})
            flashFunc(data.message, res.ok)
            if (res.ok) {
                navigate("/videos/1", { replace: true });
            }
        }
        catch (e) {
            flashFunc(err.msg, err.val)
        }
    } 


    useEffect(() => {
        if (pathname != "addVideos") {
            navigate("/addVideos", { replace: true });
        }
    }, [])


    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[14]} alt={rd.alt} className={classes.bgVid}></img>
            <div className={classes.cdCon}>
                <form className={classes.form} onSubmit={(e) => {submitFunc(e)}}>
                    <div className={classes.inCon}>
                        <div className={classes.icon}>
                            <FontAwesomeIcon icon={vid.icon}/>
                        </div>
                        <input type={vid.ty} className={classes.in} onChange={(e) =>{setVid(e, vid.mediaType, setVideo)}}/>
                    </div>
                    {video && <div className={classes.vidCon}>
                        <div className={classes.canBtnCon}>
                            <button className={classes.canBtn} onClick={remove}>
                                <FontAwesomeIcon icon={faRectangleXmark}/></button>
                        </div>
                        <video className={classes.vid} id={rd.id} loop>
                            <source src={video}/>
                            <h4>{rd.vdTxt}</h4>
                        </video>
                        <p className={classes.vidTxt}>{name}</p>
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
                    {!video && loading && <h6 className={classes.ld}>{loading}</h6>}
                    {video && <button type={rd.btnType} className={classes.btn}>{rd.btn}</button>}
                </form>
            </div>
        </div>
    );
}
 
export default AddVideos;