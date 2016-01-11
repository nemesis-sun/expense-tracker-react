import React from 'react';
import ReactDOM from 'react-dom';
import * as actions from './actions'
import ActionTypes from './constants'
import ExpenseTracker from './components'
import * as reducers from './reducers'
import {createStore, combineReducers} from 'redux'
import {connect, Provider} from 'react-redux'
import './style.css'

const initialState = {
    categories: [],
    items: [],
    categoryForm: {
        editing: false,
        editId: null
    },
    itemForm: {
        editing: false,
        editId: null
    }

}

const store = createStore(combineReducers(reducers));


function mapStateToProps(state=initialState){
    //console.log("mapStateToProps");
    //console.log(state);
    return state;
}

function mapDispatchToProps(dispatch){
    return {
        onAddCategory: (name) => {dispatch(actions.addCategory(name));},
        onRemoveCategory: (id) => {dispatch(actions.removeCategory(id));},
        onEditCategory: (id, name) => {dispatch(actions.editCategory(id, name));},
        onEditCategoryStart: (id) => {dispatch(actions.startEditCategory(id));},
        onAddItem: (name, price, categoryId) => {dispatch(actions.addItem(name, price, categoryId));},
        onRemoveItem: (id) => {dispatch(actions.removeItem(id));},
        onEditItemStart: (id) => {dispatch(actions.startEditItem(id));},
        onEditItem: (id, name, price, categoryId) => {dispatch(actions.editItem(id, name, price, categoryId));},
        onCategoryFilterChange: (id) => {dispatch(actions.filterCategory(id));},
    };
}

const App = connect(mapStateToProps, mapDispatchToProps)(ExpenseTracker);


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"));