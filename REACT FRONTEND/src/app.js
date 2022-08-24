import LandingPage from './pages/landingPage';
import Register from './pages/auth/register';
import Navbar from './components/navbar';
import {BrowserRouter, Routes, Route,} from "react-router-dom";
import Login from './pages/auth/login';
import Flash from './components/flash';
import { useEffect, useState } from 'react';
import Profile from './pages/user/profile';
import UpdateProfile from './pages/user/updateProfile';
import Footer from './components/footer';
import Del from './pages/user/del';
import Images from './pages/images/allImages';
import AddImages from './pages/images/addImages';
import DelImages from './pages/images/delImages';
import Videos from './pages/videos/allVideos';
import AddVideos from './pages/videos/addVideos';
import DelVideos from './pages/videos/delVideos';
import Audios from './pages/audios/allAudios';
import AddAudios from './pages/audios/addAudios';
import DelAudios from './pages/audios/delAudios';
import logo from './assets/logo.jpg'
import PageNotFound from './pages/PageNotFound';

const App = () => {
    const [flashMsg, setFlashMsg] = useState("")
    const [flashStatus, setFlashStatus] = useState(true)
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("accessToken") ? true : false)
    const [showApp, setShowApp] = useState(false)
    const classes = {
        "lgCon": "w-screen h-screen bg-[#2D2D2D] select-none",
        "apCon": "relative select-none",
        "sbLgCon": "w-fit mx-auto text-white pt-52",
        "con": "font-semibold text-2xl p-1 text-center border-4 border-white rounded-lg",
        "img": "h-8 w-8 mr-2 float-left rounded-lg "
    }
    const txt = {
        "alt": "Logo",
        "lg": "CONTROL"
    }

    const flashFunc = (msg, status) => {
        setFlashMsg(msg)
        setFlashStatus(status)
    }

    const clearFlash = () => {
        setFlashMsg("")
    }

    const logOut = (msg="Logout successful") => {
        localStorage.clear()
        setLoggedIn(false)
        flashFunc(msg, true)
    }

    useEffect(() => {
        setTimeout(() => {setShowApp(true)}, 5000)
    }, [])


    return ( 
        <BrowserRouter>
            {!showApp && <div className={classes.lgCon}>
                <div className={classes.sbLgCon}>
                    <div className={classes.con}>
                    <img src={logo} className={classes.img} alt={txt.alt}/>
                    <span>{txt.lg}</span>
                    </div>
                </div>
            </div>}
            {showApp && <div className={classes.apCon}>
                <Navbar loggedIn={loggedIn} logOut={logOut}/>
                {flashMsg && <Flash flashMsg={flashMsg} flashStatus={flashStatus} clearFlash={clearFlash}/>}
                <Routes>
                    <Route path="/" element={!loggedIn ? <LandingPage flashFunc={flashFunc}/> : 
                     <Profile flashFunc={flashFunc}/>} />
                    <Route path="/register" element={!loggedIn ? <Register flashFunc={flashFunc}/> : 
                    <Profile flashFunc={flashFunc}/>} />
                    <Route path="/login" element={!loggedIn ? <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/> 
                    : <Profile flashFunc={flashFunc}/>} />
                    <Route path="/profile" element={loggedIn ? <Profile flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/updateProfile" element={loggedIn ? <UpdateProfile flashFunc={flashFunc}  logOut={logOut}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/deleteProfile" element={loggedIn ? <Del flashFunc={flashFunc}  logOut={logOut}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/images/:page" element={loggedIn ? <Images flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/addImages" element={loggedIn ? <AddImages flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/delImages/:id/:page" element={loggedIn ? <DelImages flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/videos/:page" element={loggedIn ? <Videos flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/addVideos" element={loggedIn ? <AddVideos flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/delVideos/:id/:page" element={loggedIn ? <DelVideos flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/audios/:page" element={loggedIn ? <Audios flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/addAudios" element={loggedIn ? <AddAudios flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/delAudios/:id/:page" element={loggedIn ? <DelAudios flashFunc={flashFunc}/> : 
                    <Login flashFunc={flashFunc} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="*" element={<PageNotFound/>} />
                </Routes>
                <Footer loggedIn={loggedIn} logOut={logOut}/>
            </div>}
        </BrowserRouter>
     );
}
 
export default App;