import { useState, useEffect } from "react"
import {err, customFetcher, imgs} from "../../utils/data"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner } from '@fortawesome/free-solid-svg-icons'

const DelImages = ({flashFunc}) => {
    const [image, setImage] = useState({})
    const [status, setStatus] = useState(false)
    const navigate = useNavigate()
    const pathname = useLocation().pathname.split("/")[1]
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>
    const { id, page } = useParams()

    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "uImg": "h-16 w-16 sm:w-20 sm:h-20 md:w-24 md:h-24 m-auto mt-4",
        "cdCon": "bg-[#2D2D2D] w-8/12 sm:w-96 m-auto rounded-xl px-4 pb-3 pt-2",
        "btn1": "bg-blue-700 hover:bg-blue-900 p-1 text-xs rounded-md",
        "btn2": "bg-red-700 hover:bg-red-900 p-1 text-xs rounded-md",
        "btnCon": "w-full flex flex-row justify-center gap-3 mt-3",
        "failed": "text-9xl pt-10",
        "wN": "text-red-700 font-bold",
    }

    const rd = {
        "alt": "Background image",
        "li": `/images/${page}`,
        "btn1": "CANCEL",
        "btn2": "DELETE"
    }

    const txt = {
        "wnTxt": "Are you sure you want to delete this image?"
    }

    const getImage = async () => {
        try {
            var { res, data } = await customFetcher(`images/get/${id}`)
            setImage(data.images)
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
            const {res, data} = await customFetcher(`images/delete/${id}`, {method: "DELETE"})
            flashFunc(data.message, res.ok)
            if (res.ok) {
                navigate(`/images/${page == 1 ? page : page - 1}`, { replace: true })
            }
        }
        catch (e) {
            flashFunc(err.msg, err.val)
        }
    } 

    useEffect(() => {
        getImage()
        if (`${pathname}/${id}/${page}` != `delImages/${id}/${page}`) {
            navigate(`/delImages/${id}/${page}`, { replace: true });
        }
    }, [])

    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[13]} alt={rd.alt} className={classes.bgImg}/>
            {image?.id && <div className={classes.cdCon}>
                <h2 className={classes.wN}>{txt.wnTxt}</h2>
                <img src={image.link} alt={image.id} className={classes.uImg}/>
                <div className={classes.btnCon}>
                    <NavLink to={rd.li} className={classes.btn1}>{rd.btn1}</NavLink>
                    <button onClick={delFunc} className={classes.btn2}>{rd.btn2}</button>
                </div>
            </div>}
            {!image?.id && !status && <div>
                <h3 className={classes.failed}>{element}</h3>
            </div>}
        </div>
    );
}
 
export default DelImages;