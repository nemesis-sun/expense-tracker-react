import ActionTypes from './constants'


export function categories(state=[], action) {
    //console.log("categories reducer");
    switch(action.type){
        case ActionTypes.ADD_CATEGORY:
            //console.log(ActionTypes.ADD_CATEGORY);
            return addCategory(state, action.name);
        case ActionTypes.REMOVE_CATEGORY:
            //console.log(ActionTypes.REMOVE_CATEGORY);
            return deleteCategory(state, action.id);
        case ActionTypes.EDIT_CATEGORY:
            //console.log(ActionTypes.EDIT_CATEGORY);
            return editCategory(state, action.id, action.name);
        default:
            return state;
    }
}

export function categoryForm(state={editing: false, editId: null}, action){
    //console.log("categoryForm reducer");
    switch(action.type){
        case ActionTypes.EDIT_CATEGORY:
            //console.log(ActionTypes.EDIT_CATEGORY);
            return {editing: false, editId: null};
        case ActionTypes.START_EDIT_CATEGORY:
            //console.log(ActionTypes.START_EDIT_CATEGORY);
            return {editing: true, editId: action.id};
        default:
            return state;
    }
}

function addCategory(categories, name){
    let duplicate = categories.filter(category => category.name===name);
    if(duplicate.length === 0)
        return categories.concat([{name: name, id: Date.now().toString()}]);
    return categories;
}

function deleteCategory(categories, id){
    return categories.filter(category => (category.id!==id));
}

function editCategory(categories, id, newName){
    let index = categories.findIndex(category => (category.id===id));
    if(index>-1){
        categories[index].name = newName;
        categories = categories.concat([]);
    }
    return categories;
}

export function items(state=[], action){
    switch(action.type){
        case ActionTypes.ADD_ITEM:
            return addItem(state, action.name, action.price, action.category);
        case ActionTypes.REMOVE_ITEM:
            return removeItem(state, action.id);
        case ActionTypes.EDIT_ITEM:
            return editItem(state, action.id, action.name, action.price, action.category);
        case ActionTypes.REMOVE_CATEGORY:
            return state.filter(item => (item.category!==action.id));
        default:
            return state;
    }
}

export function itemForm(state={editing: false, editId: null}, action){
    switch(action.type){
        case ActionTypes.START_EDIT_ITEM:
            return {editing: true, editId: action.id};
        case ActionTypes.EDIT_ITEM:
            return {editing: false, editId: null};
        default:
            return state;
    }
}

function addItem(items, name, price, category) {
    return items.concat([{
        id: Date.now().toString(),
        name: name,
        price: price,
        category: category
    }]);
}

function removeItem(items, id){
    return items.filter(item => item.id!==id);
}

function editItem(items, id, name, price, category){
    const editIndex = items.findIndex(item => item.id===id);
    if(editIndex > -1){
        items[editIndex].name = name;
        items[editIndex].price = price;
        items[editIndex].category = category;
        return items.concat([]);
    }
    return items;
}

export function categoryFilter(state=null, action){
    switch(action.type){
        case ActionTypes.FILTER_CATEGORY:
            //console.log("categoryFilter reducer : %s", action.id);
            return action.id;
        case ActionTypes.REMOVE_CATEGORY:
            return null;
        default:
            return state;
    }
}