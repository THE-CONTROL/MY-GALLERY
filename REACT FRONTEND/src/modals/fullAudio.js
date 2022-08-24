import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark, faSliders, faArrowLeft, faArrowRight, faPlay, faPause, faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import adPlIm from "../assets/adPlIm.jpg"

const FullAudio = ({setFullAudio, fullAudio, audios}) => {
    const [count, setCount] = useState()
    const [interval, setInt] = useState()
    const txt = {
        "adAlt": "User audio",
        "nS": "Your browser does not support the audio tag.",
        "btnType": "button"
    }
    const classes = {
        "container": "w-screen h-screen absolute top-0 left-0 pt-[120px] pb-11 px-1",
        "cnBtn": "text-xs sm:text-sm md:text-base text-red-600 hover:text-red-800",
        "slBtn": "text-xs sm:text-sm md:text-base text-teal-600 hover:text-teal-800",
        "sliCon1": "block w-full h-full",
        "sliCon2": "hidden",
        "sliAd": "max-w-full m-auto max-h-full",
        "audios1": "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover hover:border-2 hover:border-blue-700",
        "audios2": "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-blue-700",
        "id": "absolute w-full top-[80px] left-0 flex-row flex justify-center gap-1",
        "arCon":  "absolute top-[185px] left-0 px-14 sm:px-20 md:px-28 sm:top-[255px] md:top-[270px] flex flex-row justify-between w-full h-fit z-50",
        "arr": "text-gray-600 bg-white rounded-lg hover:bg-gray-400 hover:text-gray-800 sm:p-0.5 md:p-1",
        "cnCon": "absolute top-[80px] right-[20px] z-10 flex flex-col",
        "ctBtn": "hover:text-gray-400",
        "adTxt": "text-xs overflow-auto"
    } 

    const counter = () => {
        pauseAll()
        setCount(count => count === audios.length - 1 ? 0 : count + 1)
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
        setFullAudio(-1)
    }

    const pauseAll = () => {
        for (let item in audios) {
            pauseFunc(item, classes.audios1, classes.sliAd)
        }
    }

    const playFunc = (id) => {
        pauseAll()
        var ad = document.getElementById(`${id}`);
        var ad1 = document.getElementById(`#${id}`);
        var adImg = document.getElementById(`*${id}`);
        var adImg1 = document.getElementById(`*#${id}`);
        
        adImg.classList = ["w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-green-700"]
        adImg1.classList = ["max-w-full m-auto max-h-full border-4 border-green-700"]

        ad.currentTime = 0;
        ad1.currentTime = 0;

        ad.play();
        ad1.play();
    }

    const inc = () => {
        pauseAll()
        setCount(count => count === audios.length - 1 ? 0 : count + 1)
    }

    const dec = () => {
        pauseAll()
        setCount(count => count === 0 ? audios.length - 1  : count - 1)
    }

    const forFunc = (id) => {
        var ad = document.getElementById(`${id}`);
        var ad1 = document.getElementById(`#${id}`);

        ad.currentTime = ad.currentTime + 5 >= ad.duration ? ad.currentTime : ad.currentTime + 5 
        ad1.currentTime = ad.currentTime + 5 >= ad.duration ? ad.currentTime : ad.currentTime + 5 
    }

    const backFunc = (id) => {
        var ad = document.getElementById(`${id}`);
        var ad1 = document.getElementById(`#${id}`);

        ad.currentTime = ad.currentTime - 5 <= 0 ? 0 : ad.currentTime - 5 
        ad1.currentTime = ad.currentTime + 5 >= ad.duration ? ad.currentTime : ad.currentTime + 5 
    }

    const pauseFunc = (id, class1, class2) => {
        var ad = document.getElementById(`${id}`);
        var ad1 = document.getElementById(`#${id}`);
        var adImg = document.getElementById(`*${id}`);
        var adImg1 = document.getElementById(`*#${id}`);

        adImg.classList = [class1]
        adImg1.classList = [class2]

        ad.pause();
        ad1.pause();
    }

    const setAd = (id) => {
        pauseAll()
        setCount(id)
    }

    useEffect (() => {
        setCount(fullAudio)
    }, [fullAudio])

    return ( 
        <div className={classes.container}>
            <div className={classes.cnCon}>
                <button className={classes.cnBtn} onClick={remove}>
                    <FontAwesomeIcon icon={faRectangleXmark}/></button>
                <button className={classes.slBtn} onClick={slider}>
                    <FontAwesomeIcon icon={faSliders}/></button>
                <button type={txt.btnType} onClick={() => {pauseFunc(count, classes.audios2, classes.sliAd)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faPause}/></button>
                <button type={txt.btnType} onClick={() => {playFunc(count)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faPlay}/></button>
                <button type={txt.btnType} onClick={() => {backFunc(count)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faBackwardFast}/></button>
                <button type={txt.btnType} onClick={() => {forFunc(count)}} 
                    className={classes.ctBtn}><FontAwesomeIcon icon={faForwardFast}/></button>
            </div>
            <div className={classes.id}>
                {audios.map((ad, index) => (<div key={ad.id}>
                    <img src={adPlIm} alt={txt.alt}  className={count === index ? classes.audios2 : 
                        classes.audios1} id={`*${index}`} onClick={() => {setAd(index)}} />
                    <audio muted id={`${index}`}>
                        <source src={ad.link}/>
                        <h4>{txt.nS}</h4>
                    </audio>
                </div>))}
            </div>
            {audios.map((ad, index) => (<div key={ad.id} className={count === index ?  classes.sliCon1 : 
            classes.sliCon2}>
                <div className={classes.arCon}>
                    <button className={classes.arr}><FontAwesomeIcon icon={faArrowLeft} 
                    onClick={dec}/></button>
                    <button className={classes.arr}><FontAwesomeIcon icon={faArrowRight} 
                    onClick={inc}/></button>
                </div>
                <img src={adPlIm} alt={txt.alt} id={`*#${index}`} className={classes.sliAd}/>
                <audio id={`#${index}`}>
                    <source src={ad.link}/>
                    <h4>{txt.nS}</h4>
                </audio>
                <p className={classes.adTxt}>{ad.name}</p>
            </div>))}
        </div>
     );
}
 
export default FullAudio;