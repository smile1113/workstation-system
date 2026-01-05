import request from "../utils/request";

export const setworkdata = (data) => {
    console.log(data);
    return request.post('http://127.0.0.1:3009/api/data/set', {
        data: data
    })
}

export const getworkdata = (floorNumber) => {
    return request.post('http://127.0.0.1:3009/api/data/get', {
        data: floorNumber
    })
}

export const delworkdata = (data) => {
    return request.post('http://127.0.0.1:3009/api/data/del', {
        data: data
    })
}

export const searchdata = (data) => {
    return request.post('http://127.0.0.1:3009/api/data/search', {
        data: data
    })
}

export const getUserListData = () => {
    return request.get('http://127.0.0.1:3009/api/data/user')
}
