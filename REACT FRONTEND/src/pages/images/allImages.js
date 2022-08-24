import { customFetcher, err, imgs } from "../../utils/data";
import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faSpinner, faTrash, faArrowLeft, faArrowRight, faDownload } from '@fortawesome/free-solid-svg-icons'
import FullImage from "../../modals/fullImage";

const Images = ({flashFunc}) => {
    const [images, setImages] = useState([])
    const [fullImage, setFullImage] = useState(-1)
    const [status, setStatus] = useState(false)
    const [meta, setMeta] = useState({})
    const { page } = useParams()
    const navigate = useNavigate()
    const pathname = useLocation().pathname.split("/")[1]
    const element = <FontAwesomeIcon icon={status == false ? faSpinner : faFaceFrown}/>
    const classes = {
        "container": "pt-[120px] text-white text-center overflow-auto h-screen pb-10",
        "bg": "bg-black absolute -z-20 h-screen w-screen top-0 left-0",
        "bgImg": "w-screen h-screen absolute left-0 top-0 -z-10 opacity-30 object-cover",
        "btn": "bg-blue-700 hover:bg-blue-900 p-1 text-sm rounded-md",
        "empty": "text-3xl mb-3",
        "failed": "text-9xl pt-10",
        "images": "w-64 h-40 object-cover hover:border-4 hover:border-blue-700 lg:w-72 lg:h-52",
        "imagesCon": "w-full h-full px-2 sm:px-4 flex flex-wrap gap-8 justify-center overflow-auto",
        "pgCon": "bg-slate-700 opacity-70 mt-6 w-fit flex flex-row m-auto mb-7",
        "pg1": "w-fit py-1 px-2 border hover:bg-slate-900",
        "pg2": "w-fit py-1 px-2 border bg-slate-900",
        "delImg": "text-xs font-bold hover:text-base mx-1"
    }

    const rd = {
        "alt": "Background image",
        "btn": "ADD",
        "li": "/addImages",
        "li2": "/delImages/",
        "nF": "No images yet!",
        "dl": "image",
        "tg": "_blank"
    }

    const getImages = async (pg=page) => {
        try {
            var { res, data } = await customFetcher(`images/get/all/${pg}`)
            setImages(data.images.items)
            setMeta(data.images.meta)
            console.log(data.images.items)
        }
        catch (e) {
            flashFunc( err.msg, err.val)
        }
        finally {
            setStatus(res.ok)
        }
    }

    useEffect(() => {
        getImages()
        if (`${pathname}/${page}` != `images/${page}`) {
            navigate(`/images/${page}`, { replace: true });
        }
    }, [])

    return ( 
        <div className={classes.container}>
            <div className={classes.bg}></div>
            <img src={imgs[5]} alt={rd.alt} className={classes.bgImg}/>
            {fullImage < 0 && <div>
                {status && <div>
                    {images.length > 0 && <div> 
                        <div className={classes.imagesCon}>
                            {images.map((img, index) => ( <div key={img.id}>
                                <img src={img.link} alt={img.id} className={classes.images}
                                onClick={() => {setFullImage(index)}} />
                                <a href={img.link} target={rd.tg} download={rd.dl} className={classes.delImg}>
                                    <FontAwesomeIcon icon={faDownload}/>
                                </a> 
                                <NavLink to={`${rd.li2}${img.id}/${page}`} className={classes.delImg}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </NavLink>
                            </div>))}
                        </div>
                        <div className={classes.pgCon}>
                            {meta.prev_page && <h6 className={classes.pg1}
                            onClick={() => {getImages(meta.prev_page)}}><FontAwesomeIcon icon={faArrowLeft}/></h6>}
                            {meta.pages.map((page, index) => (<h6 key={index} onClick={() => {getImages(page)}}
                                className={page == meta.page ? classes.pg2 : classes.pg1}>{page}</h6>))}
                            {meta.next_page && <h6 className={classes.pg1}
                            onClick={() => {getImages(meta.next_page)}}><FontAwesomeIcon icon={faArrowRight}/></h6>}
                    </div>
                    </div>}
                    {!images.length && <div>
                        <h3 className={classes.empty}>{rd.nF}</h3>
                    </div>}
                    <NavLink to={rd.li} className={classes.btn}>{rd.btn}</NavLink>
                </div>}
                {!images.length && !status && <div>
                    <h3 className={classes.failed}><span>{element}</span></h3>
                </div>}
            </div>}
            {fullImage > -1 && <FullImage setFullImage={setFullImage} fullImage={fullImage} 
            images={images}/>}
        </div>
     );
}
 
export default Images;