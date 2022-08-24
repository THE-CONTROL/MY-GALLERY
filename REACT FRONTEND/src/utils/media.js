const upload_preset = "UNKNOWN"
const Url = "https://api.cloudinary.com/v1_1/de49puo0s/upload"


async function getCloudLink(newPic, setter, run) {
    const formData = new FormData()
    formData.append("upload_preset", upload_preset)
    formData.append("file", newPic)

    let res = await fetch (`${Url}`, {method: "POST", body: formData})
    let data = await res.json()
    let secure_url = await data.secure_url
    setter(secure_url)
    run("")
}


async function upImg(e, setter, run) {
    const fileList = e.target.files || e.dataTransfer.files
    const file = fileList[0]
    if (file) {
        var fileType = file.type
    }
    if (fileType) {
        var fileGroup = fileType.split("/")[0]
    }
    if (fileGroup !== "image") {
        run("Not an image!")
    }
    else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            try {
                getCloudLink(e.target.result, setter, run)
            }
            catch(e) {
                run("Failed...")
            }
        }
    }
} 


async function upVid(e, setter, run, func) {
    const fileList = e.target.files || e.dataTransfer.files
    const file = fileList[0]
    if (file) {
        var fileType = file.type
    }
    if (fileType) {
        var fileGroup = fileType.split("/")[0]
    }
    if (fileGroup !== "video") {
        run("Not a video!")
    }
    else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            getCloudLink(e.target.result, setter, run)
            func(file.name)
        }
    }
} 


async function upAd(e, setter, run, func) {
    const fileList = e.target.files || e.dataTransfer.files
    const file = fileList[0]
    if (file) {
        var fileType = file.type
    }
    if (fileType) {
        var fileGroup = fileType.split("/")[0]
    }
    if (fileGroup !== "audio") {
        run("Not an audio!")
    }
    else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            getCloudLink(e.target.result, setter, run)
            func(file.name)
        }
    }
} 


async function upMed(e, mediaType, setter, run, func=null) {
    if (mediaType === "image") {
        upImg(e, setter, run)
    }
    else if (mediaType === "video") {
        upVid(e, setter, run, func)
    }
    else if (mediaType === "audio") {
        upAd(e, setter, run, func)
    }
} 

export default upMed