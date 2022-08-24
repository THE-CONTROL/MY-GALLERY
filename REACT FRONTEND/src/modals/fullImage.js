import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark, faSliders, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';

const FullImage = ({setFullImage, fullImage, images}) => {
    const [count, setCount] = useState()
    const [interval, setInt] = useState()
    const txt = {
        "imgAlt": "User Image"
    }
    const classes = {
        "container": "w-screen h-screen absolute top-0 left-0 pt-[120px] pb-11 px-5",
        "cnBtn": "text-xs sm:text-sm md:text-base text-red-600 hover:text-red-800",
        "slBtn": "text-xs sm:text-sm md:text-base text-teal-600 hover:text-teal-800",
        "sliCon1": "block w-full h-full",
        "sliCon2": "hidden",
        "sliImg": "max-w-full m-auto max-h-full",
        "images1": "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover hover:border-4 hover:border-blue-700",
        "images2": "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover hover:border-4 hover:border-blue-700 border-2 border-blue-700",
        "id": "absolute w-full top-[80px] left-0 flex-row flex justify-center gap-1",
        "arCon": "absolute top-[185px] left-0 px-6 sm:px-16 md:px-28 sm:top-[255px] md:top-[270px] flex flex-row justify-between w-full h-fit z-50",
        "arr": "text-gray-600 bg-white rounded-lg hover:bg-gray-400 hover:text-gray-800 sm:p-0.5 md:p-1",
        "cnCon": "absolute top-[80px] right-[20px] z-10 flex flex-col"
    } 

    const counter = () => {
        setCount(count => count == images.length - 1 ? 0 : count + 1)
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
        setFullImage(-1)
    }

    useEffect (() => {
        setCount(fullImage)
    }, [])

    return ( 
        <div className={classes.container}>
            <div className={classes.cnCon}>
                <button className={classes.cnBtn} onClick={remove}>
                    <FontAwesomeIcon icon={faRectangleXmark}/></button>
                <button className={classes.slBtn} onClick={slider}>
                    <FontAwesomeIcon icon={faSliders}/></button>
            </div>
            <div className={classes.id}>
                {images.map((img, index) => (<div key={img.id}>
                    <img src={img.link} alt={img.id} className={count == index ? 
                    classes.images2 : classes.images1} onClick={() => {setCount(index)}} />
                </div>))}
            </div>
            {images.map((img, index) => (<div key={img.id} className={count == index ?  classes.sliCon1 : 
            classes.sliCon2}>
                <div className={classes.arCon}>
                    <button className={classes.arr}><FontAwesomeIcon icon={faArrowLeft} 
                        onClick={() => {setCount(count => count == 0 ? images.length - 1 : count - 1)}}/></button>
                    <button className={classes.arr}><FontAwesomeIcon icon={faArrowRight} 
                        onClick={() => {setCount(count => count == images.length - 1 ? 0 : count + 1)}}/></button>
                </div>
                {<img src={img.link} alt={txt.imgAlt} className={classes.sliImg}/>}
            </div>))}
        </div>
     );
}
 
export default FullImage;