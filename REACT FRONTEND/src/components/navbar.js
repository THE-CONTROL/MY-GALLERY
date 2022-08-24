import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({loggedIn, logOut}) => {
    const [sideNav, setSideNav] = useState(false)
    const navigate = useNavigate()
    const pathname = useLocation().pathname.split("/")[1]
    const classes = {
        "container": "absolute top-0 left-0 text-white z-20 w-screen p-[20px] bg-[#00000070]",
        "logo": "text-2xl w-fit font-black md:text-3xl",
        "bsCon": "gap-5 pt-[27px] absolute top-0 right-[100px] h-[100px] flex-row font-medium hidden md:flex",
        "liTx": "hover:text-blue-900 h-fit",
        "liTx1": "text-blue-900 h-fit",
        "ssCon": "pt-[25px] absolute top-0 right-[25px] h-[100px] flex-row font-medium md:hidden",
        "bars1": "hover:text-base hover:font-normal text-xl font-bold",
        "bars2": "hover:text-xl hover:font-bold",
        "ssNav1": "h-screen w-6/12 sm:w-72 top-[72px] right-0 fixed md:hidden font-medium pt-5 text-center flex flex-col gap-2 bg-[#00000070]",
        "ssNav2": "hidden",
    }
    const lgOutTxs = [
        {"route": "/login", "text": "LOGIN", "name": "login"},
        {"route": "/register", "text": "REGISTER", "name": "register"}
    ]

    const lgInTxs = [
        {"route": "/profile", "text": "PROFILE", "name": "profile"},
        {"route": "/images/1", "text": "IMAGES", "name": "images"},
        {"route": `/videos/1`, "text": "VIDE0S", "name": "videos"},
        {"route": `/audios/1`, "text": "AUDIOS", "name": "audios"},
    ]

    const text = {
        "title": "GALLERY",
        "lO": "LOGOUT",
        "lOLi": "/login"
    }


    const changePath = (path) => {
        navigate(path, { replace: true });
    }


    return ( 
        <div className={classes.container}>
            <h1 className={classes.logo}>{text.title} <span><FontAwesomeIcon icon={faPhotoFilm} /></span></h1>
            {!loggedIn && <div className={classes.bsCon}>
                {lgOutTxs.map((liTx, index) => (<p key={index} to={liTx.route} 
                onClick={() => {changePath(liTx.route)}} className={pathname == liTx.name ? 
                classes.liTx1 : classes.liTx}>{liTx.text}</p>))}
            </div>}
            {loggedIn && <div className={classes.bsCon}>
                {lgInTxs.map((liTx, index) => (<p key={index} to={liTx.route} 
                onClick={() => {changePath(liTx.route)}} className={pathname == liTx.name ? 
                classes.liTx1 : classes.liTx}>{liTx.text}</p>))}
                <button onClick={() => {changePath(text.lOLi); logOut()}} className={classes.liTx}>{text.lO}</button>
            </div>}
            <div className={classes.ssCon}>
                <span onClick={() => {setSideNav(!sideNav)}}><FontAwesomeIcon icon={faBars} 
                className={sideNav ? classes.bars1 : classes.bars2}/></span>
            </div>
            {!loggedIn && <div className={sideNav ? classes.ssNav1 : classes.ssNav2}>
                {lgOutTxs.map((liTx, index) => (<p key={index} to={liTx.route} onClick={() => {setSideNav(false); 
                changePath(liTx.route)}} className={pathname == liTx.name ? classes.liTx1 : 
                classes.liTx}>{liTx.text}</p>))}
            </div>}
            {loggedIn && <div className={sideNav ? classes.ssNav1 : classes.ssNav2}>
                {lgInTxs.map((liTx, index) => (<p key={index} to={liTx.route} className={pathname == liTx.name 
                ? classes.liTx1 : classes.liTx} onClick={() => {setSideNav(false); changePath(liTx.route)} }>
                    {liTx.text}</p>))}
                <button onClick={() => {changePath(text.lOLi); logOut(); setSideNav(false)}} className={classes.liTx}>{text.lO}</button>
            </div>}
        </div>
     );
}
 
export default Navbar;