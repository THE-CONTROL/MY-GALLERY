import ErBg from "../assets/ErBg.jpg"
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

const PageNotFound = () => {
    const classes = {
        "container": "pt-[120px] text-white text-center",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-60 object-cover",
        "ex": "sm:text-8xl text-7xl md:text-9xl",
        "err": "text-2xl sm:text-3xl md:text-4xl font-bold",
        "info": "text-lg sm:text-xl md:text-2xl font-semibold mb-5 mt-1",
        "btn": "bg-blue-700 hover:bg-blue-900 p-1 text-lg rounded-md",
    }

    const rd = {
        "alt": "Background image",
        "btn": "BACK",
        "li": "/",
        "err": "404 Error!",
        "pnf": "Page Not Found!",
    }


    return ( 
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={ErBg} alt={rd.alt} className={classes.bgImg}/>
            <h2 className={classes.ex}><FontAwesomeIcon icon={faTriangleExclamation}/></h2>
            <h3 className={classes.err}>{rd.err}</h3>
            <h3 className={classes.info}>{rd.pnf}</h3>
            <NavLink to={rd.li} className={classes.btn}>{rd.btn}</NavLink>
        </div>
     );
}
 
export default PageNotFound;