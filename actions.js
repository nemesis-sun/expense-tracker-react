import ActionTypes from "./constants"

export function addCategory(name){
    return {
        type: ActionTypes.ADD_CATEGORY,
        name: name
    };
}

export function removeCategory(id){
    return {
        type: ActionTypes.REMOVE_CATEGORY,
        id: id
    };
}

export function editCategory(id, newName){
    return {
        type: ActionTypes.EDIT_CATEGORY,
        id: id,
        name: newName
    };
}

export function startEditCategory(id){
    return {
        type: ActionTypes.START_EDIT_CATEGORY,
        id: id
    };
}

export function addItem(name, price, time, categoryId){
    return {
        type: ActionTypes.ADD_ITEM,
        name: name,
        price: price,
        time: time,
        category: categoryId
    };
}

export function removeItem(id){
    return {
        type: ActionTypes.REMOVE_ITEM,
        id: id
    };
}

export function editItem(id, name, price, time, categoryId){
    return {
        type: ActionTypes.EDIT_ITEM,
        id: id,
        name: name,
        price: price,
        time: time,
        category: categoryId
    };
}

export function startEditItem(id){
    return {
        type: ActionTypes.START_EDIT_ITEM,
        id: id
    };
}

export function filterCategory(id){
    return {
        type: ActionTypes.FILTER_CATEGORY,
        id: id
    };
}