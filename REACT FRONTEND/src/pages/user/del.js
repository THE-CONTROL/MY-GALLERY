import { useState, useEffect } from "react"
import {err, customFetcher, imgs } from "../../utils/data"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner } from '@fortawesome/free-solid-svg-icons'

const Del = ({flashFunc,  logOut}) => {
    const [user, setUser] = useState({})
    const [status, setStatus] = useState(false)
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()
    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "uImg": "rounded-full border-8  h-16 w-16 sm:w-20 sm:h-20 md:w-24 md:h-24 m-auto mt-4",
        "uName": "sm:text-base md:mt-1 md:text-lg text-sm font-bold",
        "cdCon": "bg-[#2D2D2D] w-8/12 sm:w-96 m-auto rounded-xl px-4 pb-3 pt-2",
        "wN": "text-red-700 font-bold",
        "btn1": "bg-blue-700 hover:bg-blue-900 p-1 text-xs rounded-md",
        "btn2": "bg-red-700 hover:bg-red-900 p-1 text-xs rounded-md",
        "btnCon": "w-full flex flex-row justify-center gap-3 mt-3",
        "failed": "text-9xl pt-10"
    }

    const rd = {
        "alt": "Background image",
        "li": "/profile",
        "btn1": "CANCEL",
        "btn2": "DELETE"
    }

    const txt = {
        "wnTxt1": "Deleting this user will result in loss of all associated data.",
        "wnTxt2": "Are you sure you want to delete this user?"
    }

    const getUser = async () => {
        try {
            var { res, data } = await customFetcher("user/get")
            setUser(data.user)
            setStatus(res.ok)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res)
        }
    }

    const delFunc = async () => {
        try {
            const {res, data} = await customFetcher("user/delete", {method: "DELETE"})
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
        if (pathname != "deleteProfile") {
            navigate("/deleteProfile", { replace: true });
        }
    }, [])

    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[11]} alt={rd.alt} className={classes.bgImg}/>
            {user?.id && <div className={classes.cdCon}>
                <h2 className={classes.wN}>{txt.wnTxt1}</h2>
                <h2 className={classes.wN}>{txt.wnTxt2}</h2>
                <img src={user.picture} alt={user.username} className={classes.uImg}/>
                <h3 className={classes.uName}>{user.username}</h3>
                <div className={classes.btnCon}>
                    <NavLink to={rd.li} className={classes.btn1}>{rd.btn1}</NavLink>
                    <button onClick={delFunc} className={classes.btn2}>{rd.btn2}</button>
                </div>
            </div>}
            {!user?.id && !status && <div>
                <h3 className={classes.failed}>{element}</h3>
            </div>}
        </div>
    );
}
 
export default Del;