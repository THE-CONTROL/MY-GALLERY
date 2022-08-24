import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


const Flash = ({flashMsg, flashStatus, clearFlash}) => {
    const classes = {
        "con1": "absolute z-20 top-[72px] md:top-[76px] left-0 text-green-200 w-screen bg-[#15803050] px-[20px] py-[5px] flex flex-row justify-between gap-4",
        "con2": "absolute z-20 top-[72px] md:top-[76px] left-0 text-red-200 w-screen bg-[#80151550] px-[20px] py-[5px] flex flex-row justify-between gap-4",
        "btn1": "hover:text-green-400",
        "btn2": "hover:text-red-400"
    }
    
    return ( 
        <div className={flashStatus ? classes.con1 : classes.con2}>
            <h3>{flashMsg}</h3>
            <button onClick={clearFlash} 
            className={flashStatus ? classes.btn1 : classes.btn2}><FontAwesomeIcon icon={faXmark}/></button>
        </div>
     );
}
 
export default Flash;