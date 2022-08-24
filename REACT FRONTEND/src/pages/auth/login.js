import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import {unSecFetcher, err, imgs} from "../../utils/data"
import { useLocation, useNavigate } from "react-router-dom"

const Login = ({flashFunc, setLoggedIn}) => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const navigate = useNavigate()
    const pathname = useLocation().pathname.split("/")[1]

    const inputs = [
        {"icon": faEnvelope, "pH": "Email", "ty": "email", "getValue": setEmail},
        {"icon": faLock, "pH": "Password", "ty": "password", "getValue": setPass},
    ]

    const classes = {
        "container": "pt-[200px] text-white",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "form": "w-fit m-auto flex flex-col gap-5 overflow-auto p-4 h-96",
        "inCon": "md:w-[400px] w-[250px] sm:w-[325px] rounded-full flex flex-row bg-[#ffffff20] hover:bg-[#ffffff40]",
        "icon": "md:py-[12px] py-[5px] sm:py-[10px] w-2/12 bg-transparent text-xl sm:text-2xl md:text-3xl text-center rounded-full",
        "in": "w-10/12 rounded-full bg-transparent px-3 focus:bg-[#ffffff40] md:py-[17px] py-[10px] sm:py-[15px]",
        "btn": "md:w-[400px] py-2 w-[250px] sm:w-[325px]  md:py-[20px] py-[10px] sm:py-[15px] rounded-full bg-[#AE796D] hover:bg-[#8d6258] font-medium",
    }

    const rd = {
        "alt": "Background image",
        "btn": "SIGN IN",
        "btnType": "submit"
    }

    const setValue = (val, setter) => {
        setter(val)
    }

    const submitfunc = async (e) => {
        e.preventDefault()
        const body = {
            email: email.trim(),
            password: pass.trim()
        }
        try {
            const {res, data} = await unSecFetcher("/user/login", {method: "POST", body: JSON.stringify(body)})
            flashFunc(data.message, res.ok)
            localStorage.setItem("accessToken", data.access_token)
            localStorage.setItem("refreshToken", data.refresh_token)
            if (res.ok) {
                setLoggedIn(true)
                navigate("/profile", { replace: true });
            }
        }
        catch (e) {
            flashFunc(err.msg, err.val)
        }
    } 


    useEffect(() => {
        if (pathname != "login") {
            navigate("/login", { replace: true });
            flashFunc(err.msg2, err.val)
        }
    }, [])



    return (  
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[2]} alt={rd.alt} className={classes.bgImg}/>
            <form className={classes.form} onSubmit={(e) => {submitfunc(e)}}>
                {inputs.map((input, index) => (<div key={index} className={classes.inCon}>
                    <div className={classes.icon}>
                        <FontAwesomeIcon icon={input.icon}/>
                    </div>
                    <input type={input.ty} placeholder={input.pH} 
                    className={classes.in} onChange={(e) => {setValue(e.target.value, input.getValue)}}/>
                </div>))}
                <button type={rd.btnType} className={classes.btn}>{rd.btn}</button>
            </form>
        </div>
    );
}

export default Login;
