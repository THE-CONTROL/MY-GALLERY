import { useEffect } from "react"
import { err, imgs } from "../utils/data"

import { NavLink, useLocation, useNavigate } from "react-router-dom"

const LandingPage = ({flashFunc}) => {
    const pathname = useLocation().pathname.split("/")[1]
    const navigate = useNavigate()
    const texts = {
        "IntroTitle": "Store your media files online.",
        "IntroText": "Permanently store your images, audios and videos online for free.",
        "btnText": "Get Started",
        "imgAlt": "Background Image",
        "li": "/register"
    }
    const classes = {
        "container": "text-white bg-black h-screen w-screen select-none",
        "bgImg": "w-screen h-screen object-cover opacity-60",
        "introCon": "flex flex-col justify-start gap-[25px] absolute top-[150px] left-[0px] px-10",
        "introBlock": "md:w-[70px] md:h-[6px] bg-white sm:w-[50px] sm:h-[4px] w-[30px] h-[2px]",
        "introTitle": "text-2xl sm:text-3xl md:text-4xl",
        "btnCls": "rounded-lg border w-fit py-1 px-4 hover:text-black hover:bg-white"
    }


    useEffect(() => {
        if (pathname != "") {
            navigate("/", { replace: true });
            flashFunc(err.msg2, err.val1)
        }
    }, [])


    return ( 
        <div className={classes.container}>
            <img src={imgs[18]} alt={classes.imgAlt} className={classes.bgImg}/>
            <div className={classes.introCon}>
                <div className={classes.introBlock}></div>
                <h2 className={classes.introTitle}>{texts.IntroTitle}</h2>
                <p>{texts.IntroText}</p>
                <NavLink to={texts.li} className={classes.btnCls}>{texts.btnText}</NavLink>
            </div>
        </div>
     );
}

export default LandingPage;