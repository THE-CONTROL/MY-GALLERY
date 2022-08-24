import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark, faSliders, faArrowLeft, faArrowRight, faPlay, faPause, faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';

const FullVideo = ({setFullVideo, fullVideo, videos}) => {
    const [count, setCount] = useState()
    const [interval, setInt] = useState()
    const txt = {
        "vidAlt": "User video",
        "nS": "Your browser does not support the video tag.",
        "btnType": "button"
    }
    const classes = {
        "container": "w-screen h-screen absolute top-0 left-0 pt-[120px] pb-11 px-1",
        "cnBtn": "text-xs sm:text-sm md:text-base text-red-600 hover:text-red-800",
        "slBtn": "text-xs sm:text-sm md:text-base text-teal-600 hover:text-teal-800",
        "sliCon1": "block w-full h-full",
        "sliCon2": "hidden",
        "sliVid": "max-w-full m-auto max-h-full",
        "videos1": "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover hover:border-2 hover:border-blue-700",
        "videos2": "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-blue-700",
        "id": "absolute w-full top-[80px] left-0 flex-row flex justify-center gap-1",
        "arCon": "absolute top-[185px] left-0 px-14 sm:px-20 md:px-28 sm:top-[255px] md:top-[270px] flex flex-row justify-between w-full h-fit z-50",
        "arr": "text-gray-600 bg-white rounded-lg hover:bg-gray-400 hover:text-gray-800 sm:p-0.5 md:p-1",
        "cnCon": "absolute top-[80px] right-[20px] z-10 flex flex-col",
        "ctBtn": "hover:text-gray-400",
        "vidTxt": "text-xs overflow-auto"
    } 

    const counter = () => {
        pauseAll()
        setCount(count => count === videos.length - 1 ? 0 : count + 1)
    }

    const slider = () => {
        if (!interval) {
            setInt(setInterval(counter, 1000))
        }
        else {
            clearInterval(interval)
            setInt(undefined)
        }
    }
    
    const remove = () => {
        clearInterval(interval)
        setFullVideo(-1)
    }

    const pauseAll = () => {
        for (let item in videos) {
            pauseFunc(item, classes.videos1, classes.sliVid)
        }
    }

    const playFunc = (id) => {
        pauseAll()
        var vid = document.getElementById(`${id}`);
        var vid1 = document.getElementById(`#${id}`);
        
        vid.classList = ["w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-green-700"]
        vid1.classList = ["max-w-full m-auto max-h-full border-4 border-green-700"]

        vid.currentTime = 0;
        vid1.currentTime = 0;

        vid.play();
        vid1.play();
    }

    const inc = () => {
        pauseAll()
        setCount(count => count === videos.length - 1 ? 0 : count + 1)
    }

    const dec = () => {
        pauseAll()
        setCount(count => count === 0 ? videos.length - 1 : count - 1)
    }

    const forFunc = (id) => {
        var vid = document.getElementById(`${id}`);
        var vid1 = document.getElementById(`#${id}`);

        vid.currentTime = vid.currentTime + 5 >= vid.duration ? vid.currentTime : vid.currentTime + 5 
        vid1.currentTime = vid.currentTime + 5 >= vid.duration ? vid.currentTime : vid.currentTime + 5 
    }

    const backFunc = (id) => {
        var vid = document.getElementById(`${id}`);
        var vid1 = document.getElementById(`#${id}`);

        vid.currentTime = vid.currentTime - 5 <= 0 ? 0 : vid.currentTime - 5 
        vid1.currentTime = vid.currentTime + 5 >= vid.duration ? vid.currentTime : vid.currentTime + 5 
    }

    const pauseFunc = (id, class1, class2) => {
        var vid = document.getElementById(`${id}`);
        var vid1 = document.getElementById(`#${id}`);

        vid.classList = [class1]
        vid1.classList = [class2]

        vid.pause();
        vid1.pause();
    }

    const setVid = (id) => {
        pauseAll()
        setCount(id)
    }

    useEffect (() => {
        setCount(fullVideo)
    }, [fullVideo])

    return ( 
        <div className={classes.container}>
            <div className={classes.cnCon}>
                <button className={classes.cnBtn} onClick={remove}>
                    <FontAwesomeIcon icon={faRectangleXmark}/></button>
                <button className={classes.slBtn} onClick={slider}>
                    <FontAwesomeIcon icon={faSliders}/></button>
                <button type={txt.btnType} onClick={() => {pauseFunc(count, classes.videos2, classes.sliVid)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faPause}/></button>
                <button type={txt.btnType} onClick={() => {playFunc(count)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faPlay}/></button>
                <button type={txt.btnType} onClick={() => {backFunc(count)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faBackwardFast}/></button>
                <button type={txt.btnType} onClick={() => {forFunc(count)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faForwardFast}/></button>
            </div>
            <div className={classes.id}>
                {videos.map((vid, index) => (<div key={vid.id}>
                    <video muted className={count === index ? classes.videos2 : 
                        classes.videos1} onClick={() => {setVid(index)}} id={`${index}`}>
                        <source src={vid.link}/>
                        <h4>{txt.nS}</h4>
                    </video>
                </div>))}
            </div>
            {videos.map((vid, index) => (<div key={vid.id} className={count === index ?  classes.sliCon1 : 
            classes.sliCon2}>
                <div className={classes.arCon}>
                    <button className={classes.arr}><FontAwesomeIcon icon={faArrowLeft} 
                    onClick={dec}/></button>
                    <button className={classes.arr}><FontAwesomeIcon icon={faArrowRight} 
                    onClick={inc}/></button>
                </div>
                <video className={classes.sliVid} id={`#${index}`}>
                    <source src={vid.link}/>
                    <h4>{txt.nS}</h4>
                </video>
                <p className={classes.vidTxt}>{vid.name}</p>
            </div>))}
        </div>
     );
}
 
export default FullVideo;