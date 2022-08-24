import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const err = {
    "msg": "Hmm... Something went wrong, please check your network connection and try again!",
    "val": false,
    "msg1": "Already logged in!",
    "val1": true,
    "msg2": "Not logged in!",
}


const imgs = {
    "1": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298495/rmscpqtwh6qeomdxhdad.jpg",
    "2": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298533/sxpaiwzyn0z6skg3iyts.jpg",
    "3": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298568/balhf6zrhcbwvsbqnace.webp",
    "4": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298608/pbkhg807e7ov4peidqdu.jpg",
    "5": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298636/of34qrdw8nlku2kv1z3u.jpg",
    "6": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298674/piqh94hb86hfmrpjwwc3.jpg",
    "7": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298695/teqgadud6ofrpayldozo.jpg",
    "8": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298741/lzrimqyypc0ohrhveatr.jpg",
    "9": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298777/b87swsufg3xtnnxk96jt.jpg",
    "10": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298795/fxveqqxyqacnt6cq74sl.jpg",
    "11": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298946/n3zhmeyuaavnlwmoihlv.jpg",
    "12": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298963/wwtjnuetpvvq1zzjkgmy.jpg",
    "13": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298512/mew1bkngr2wac7bbe8hs.jpg",
    "14": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298504/ksgirkqlwulmp9cxvdle.jpg",
    "15": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298520/w2z3rdqvgfz5ica6badm.jpg",
    "16": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298979/qvqlfls2rwvj2idlds3v.jpg",
    "17": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298810/s1xpcx5i4xlexkgnmfuw.jpg",
    "18": "https://res.cloudinary.com/de49puo0s/image/upload/v1661298583/bcfq4g7qsocsyc6gajwt.jpg",
}


const Url = "UNKNOWN"

async function unSecFetcher(speUrl, config={}) {
    config["headers"] = {
        'Content-Type': 'application/json'
    }
    const res = await fetch(`${Url}${speUrl}`, config)
    const data = await res.json()

    return {res, data}
} 


async function secFetcher(speUrl, config) {
    const res = await fetch(`${Url}${speUrl}`, config)
    const data = await res.json()

    return {res, data}
} 


const refreshTokenFunc = async (refreshToken) => {
    let response = await fetch(`${Url}user/refresh`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`
        }
    })
    let data = await response.json()
    localStorage.setItem("accessToken", data.access_token)
    return data.access_token
}


const customFetcher = async (speUrl, config={}) => {
    let accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null

    const user = jwt_decode(accessToken)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

    if (isExpired) {
        accessToken = await refreshTokenFunc(localStorage.getItem('refreshToken'))
    }

    config["headers"] = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
    }

    let {res, data} = await secFetcher(speUrl, config)
    return { res, data }
}

export { unSecFetcher, customFetcher, err, imgs }
