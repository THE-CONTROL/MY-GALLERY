import { customFetcher, err, imgs } from "../../utils/data";
import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner } from '@fortawesome/free-solid-svg-icons'

const Profile = ({flashFunc}) => {
    const [user, setUser] = useState({})
    const [status, setStatus] = useState(false)
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()
    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "uImg": "rounded-full border-8  h-32 w-32 sm:w-40 sm:h-40 md:w-52 md:h-52 m-auto",
        "uName": "mt-1 sm:mt-2 sm:text-xl md:mt-3 md:text-2xl text-lg font-bold",
        "uEmail": "sm:mt-1 sm:text-lg md:mt-2 md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4",
        "btn": "bg-blue-700 hover:bg-blue-900 p-1 text-xs rounded-md",
        "failed": "text-9xl pt-10"
    }

    const rd = {
        "alt": "Background image",
        "btn": "UPDATE",
        "li": "/updateProfile"
    }

    const getUser = async () => {
        try {
            var { res, data } = await customFetcher("user/get")
            setUser(data.user)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res)
        }
    }

    useEffect(() => {
        getUser()
        if (pathname != "profile") {
            navigate("/profile", { replace: true });
            flashFunc(err.msg1, err.val1)
        }
    }, [])

    return ( 
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[4]} alt={rd.alt} className={classes.bgImg}/>
            {user?.id && <div>
                <img src={user.picture} alt={user.username} className={classes.uImg}/>
                <h3 className={classes.uName}>{user.username}</h3>
                <h4 className={classes.uEmail}>{user.email}</h4>
                <NavLink to={rd.li} className={classes.btn}>{rd.btn}</NavLink>
            </div>}
            {!user?.id && !status && <div>
                <h3 className={classes.failed}><span>{element}</span></h3>
            </div>}
        </div>
     );
}
 
export default Profile;