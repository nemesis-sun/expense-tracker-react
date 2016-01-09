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

export function addItem(name, price, categoryId){
    return {
        type: ActionTypes.ADD_ITEM,
        name: name,
        price: price,
        category: categoryId
    };
}