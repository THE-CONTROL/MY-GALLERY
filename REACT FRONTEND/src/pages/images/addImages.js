import { useEffect, useState } from "react"
import {err, customFetcher, imgs} from "../../utils/data"
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faRectangleXmark } from '@fortawesome/free-solid-svg-icons'
import upMed from "../../utils/media"

const AddImages = ({flashFunc}) => {
    const [picture, setPicture] = useState("")
    const [loading, setLoading] = useState("")
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()

    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "form": "w-fit m-auto flex flex-col gap-5",
        "cdCon": "bg-[#2D2D2D] w-8/12 sm:w-96 m-auto rounded-xl px-4 pb-3 pt-2",
        "inCon": "rounded-full flex flex-row bg-[#ffffff20] hover:bg-[#ffffff40]",
        "icon": "py-[6px] sm:py-[8px] w-2/12 bg-transparent text-lg sm:text-xl pl-2 md:text-2xl text-center rounded-full",
        "in": "w-full rounded-full bg-transparent px-3 focus:bg-[#ffffff40] md:py-[10px] py-[6px] sm:py-[8px]",
        "btn": "w-fit p-2 m-auto text-sm bg-green-600 hover:bg-green-800 rounded-full font-medium",
        "picCon": "w-full",
        "canBtnCon": "w-full flex justify-center",
        "canBtn": "text-red-600 ml-8 hover:text-red-800",
        "pic": "w-12 h-12 m-auto rounded-lg",
        "ld": "text-center font-semibold text-xs",
        "failed": "text-9xl pt-10"
    }

    const pic = {"icon": faImage, "ty": "file", "mediaType": "image"}

    const rd = {
        "alt": "Background image",
        "btn": "ADD IMAGE",
        "btnType": "submit"
    }


    const setImg = async (e, mediaType, setter) => {
        setPicture("")
        setLoading("Loading...")
        try {
            upMed(e, mediaType, setter, setLoading)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
            setLoading("Failed!")
            classes.ld = "text-center font-semibold text-xs text-red-700"
        }
    }


    const remove = () => {
        setPicture("")
        setLoading("")
    }


    const submitFunc = async (e) => {
        e.preventDefault()
        const body = {
            link: picture
        }
        try {
            const {res, data} = await customFetcher("images/add", {method: "POST", body: JSON.stringify(body)})
            if (res.ok) {
                navigate("/images/1", { replace: true });
            }
            else {
                flashFunc(data.message, res.ok)
            }
        }
        catch (e) {
            flashFunc(err.msg, err.val)
        }
    } 


    useEffect(() => {
        if (pathname != "addImages") {
            navigate("/addImages", { replace: true });
        }
    }, [])


    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[10]} alt={rd.alt} className={classes.bgImg}/>
            <div className={classes.cdCon}>
                <form className={classes.form} onSubmit={(e) => {submitFunc(e)}}>
                    <div className={classes.inCon}>
                        <div className={classes.icon}>
                            <FontAwesomeIcon icon={pic.icon}/>
                        </div>
                        <input type={pic.ty} className={classes.in} onChange={(e) =>{setImg(e, pic.mediaType, setPicture)}}/>
                    </div>
                    {picture && <div className={classes.picCon}>
                        <div className={classes.canBtnCon}>
                            <button className={classes.canBtn} onClick={remove}>
                                <FontAwesomeIcon icon={faRectangleXmark}/></button>
                        </div>
                        <img src={picture} alt={picture} className={classes.pic}/>
                    </div>}
                    {!picture && loading && <h6 className={classes.ld}>{loading}</h6>}
                    {picture && <button type={rd.btnType} className={classes.btn}>{rd.btn}</button>}
                </form>
            </div>
        </div>
    );
}
 
export default AddImages;