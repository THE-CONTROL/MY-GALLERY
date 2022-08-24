import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faImage, faRectangleXmark, faFaceFrown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from "react"
import upMed from "../../utils/media"
import {err, customFetcher, imgs} from "../../utils/data"
import { useLocation, useNavigate } from "react-router-dom"

const UpdateProfile = ({flashFunc,  logOut}) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [picture, setPicture] = useState("")
    const [loading, setLoading] = useState("")
    const [status, setStatus] = useState(false)
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>

    const inputs = [
        {"icon": faUser, "pH": "Username", "ty": "text", "getValue": setUsername, "val": username},
        {"icon": faEnvelope, "pH": "Email", "ty": "email", "getValue": setEmail, "val": email},
    ]

    const pic = {"icon": faImage, "ty": "file", "mediaType": "image"}

    const classes = {
        "container": "pt-[120px] text-white",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "form": "w-fit m-auto flex flex-col gap-5",
        "inCon": "md:w-[400px] w-[250px] sm:w-[325px] rounded-full flex flex-row bg-[#ffffff20] hover:bg-[#ffffff40]",
        "icon": "md:py-[12px] py-[5px] sm:py-[10px] w-2/12 bg-transparent text-xl sm:text-2xl md:text-3xl text-center rounded-full",
        "in": "w-10/12 rounded-full bg-transparent px-3 focus:bg-[#ffffff40] md:py-[17px] py-[10px] sm:py-[15px]",
        "btn": "md:w-[400px] py-2 w-[250px] sm:w-[325px]  md:py-[20px] py-[10px] sm:py-[15px] rounded-full bg-[#AE796D] hover:bg-[#8d6258] font-medium",
        "picCon": "w-full",
        "canBtnCon": "w-full flex justify-center",
        "canBtn": "text-red-600 ml-8 hover:text-red-800",
        "pic": "w-12 h-12 m-auto rounded-lg",
        "ld": "text-center font-semibold text-xs",
        "failed": "text-9xl pt-10 text-center"
    }

    const rd = {
        "alt": "Background image",
        "btn": "UPDATE PROFILE",
        "btnType": "submit"
    }

    const setValue = (val, setter) => {
        setter(val)
    }

    const setImg = async (e, mediaType, setter) => {
        setPicture("")
        setLoading("Loading...")
        try {
            upMed(e, mediaType, setter, setLoading)
        }
        catch (e) {
            flashFunc("An error occured, please check your network connection and try again!", false)
            setLoading("Failed!")
            classes.ld = "text-center font-semibold text-xs text-red-700"
        }
    }

    const getUser = async () => {
        try {
            var { res, data } = await customFetcher("user/get")
            setUsername(data.user.username)
            setEmail(data.user.email)
            setPicture(data.user.picture)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res)
        }
    }


    const remove = () => {
        setPicture("")
        setLoading("")
    }

    const submitfunc = async (e) => {
        e.preventDefault()
        const body = {
            username: username,
            email: email,
            picture: picture
        }
        try {
            const {res, data} = await customFetcher("user/update", {method: "PUT", body: JSON.stringify(body)})
            if (res.ok) {
                logOut(data.message)
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
        getUser()
        if (pathname != "updateProfile") {
            navigate("/updateProfile", { replace: true });
        }
    }, [])

    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[6]} alt={rd.alt} className={classes.bgImg}/>
            {username && <form className={classes.form} onSubmit={(e) => {submitfunc(e)}}>
                {inputs.map((input, index) => (<div key={index} className={classes.inCon}>
                    <div className={classes.icon}>
                        <FontAwesomeIcon icon={input.icon}/>
                    </div>
                    <input type={input.ty} placeholder={input.pH} value={input.val}
                    className={classes.in} onChange={(e) => {setValue(e.target.value, input.getValue)}}/>
                </div>))}
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
                <button type={rd.btnType} className={classes.btn}>{rd.btn}</button>
            </form>}
            {!username && !status && <div>
                <h3 className={classes.failed}><span>{element}</span></h3>
            </div>}
        </div>
    );
}

export default UpdateProfile;
