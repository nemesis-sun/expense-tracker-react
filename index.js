import React from 'react';
import ReactDOM from 'react-dom';
import * as actions from './actions'
import ActionTypes from './constants'
import {createStore} from 'redux'
import {connect, Provider} from 'react-redux'


class CategoryAddForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {input: null};   
    }

    componentWillReceiveProps(nextProps){
        console.log("CategoryAddForm.componentWillReceiveProps");
        console.log(nextProps);
        const {categories, editId, editing} = nextProps;
        if(editing===true){
            let category = categories.filter(category => (category.id===editId));
            console.log(category);
            if(category.length > 0)
                this.setState({input: category[0].name});
        }
    }

    render(){
        return (
            <div>
                <input type='text' ref='input' value={this.state.input} onChange={this.handleInputChange.bind(this)}/>
                <button type='button' onClick={this.handleSubmit.bind(this)}>Add</button>
            </div>
        );
    }

    handleInputChange(e){
        this.setState({input: e.target.value});
    }

    handleSubmit(e){
        console.log("CategoryAddForm:handleSubmit");
        let {onAddCategory, onEditCategory} = this.props;
        let input = this.state.input.trim();
        this.setState({input: null});

        if(this.props.editing===true)
            onEditCategory(this.props.editId, input);
        else
            onAddCategory(input);
    }
}

class CategoryList extends React.Component {
    render(){
        let list = this.props.data.map(category => {return(
            <div key={category.id}>
                <span className="fa fa-times" onClick={this.handleCategoryRemove.bind(this, category.id)}>&nbsp;&nbsp;</span>
                <span className="fa fa-pencil" onClick={this.handleStartEditCategory.bind(this, category.id)}>&nbsp;&nbsp;</span>
                <span>{category.name} - </span>
                <span>{category.count} items</span>
            </div>
        )});
        return (
            <div>{list}</div>
        );
    }

    handleCategoryRemove(id){
        let {onRemoveCategory} = this.props;
        console.log("handleCategoryRemove %s", id);
        onRemoveCategory(id);
    }

    handleStartEditCategory(id){
        let {onEditStart} = this.props;
        onEditStart(id);
    }
}

class Category extends React.Component {
    render(){
        //const {categories} = this.props;
        //console.log(categories);
        return (
            <div>
                <CategoryAddForm categories={this.props.categories} editing={this.props.editing} editId={this.props.editId} onAddCategory={this.props.onAddCategory} onEditCategory={this.props.onEditCategory}/>
                <CategoryList data={this.props.categories} onRemoveCategory={this.props.onRemoveCategory} onEditStart={this.props.onEditStart}/>
            </div>
        );
    }
}



function category(state={categories: [], editing: false, editId: null}, action){
    console.log("category reducer");
    switch(action.type){
        case ActionTypes.ADD_CATEGORY:
            console.log(ActionTypes.ADD_CATEGORY);
            return Object.assign({}, state, {categories: addCategory(state.categories, action.name)});
        case ActionTypes.REMOVE_CATEGORY:
            console.log(ActionTypes.REMOVE_CATEGORY);
            return Object.assign({}, state, {categories: deleteCategory(state.categories, action.id)});
        case ActionTypes.EDIT_CATEGORY:
            console.log(ActionTypes.EDIT_CATEGORY);
            return Object.assign({}, state, {categories: editCategory(state.categories, action.id, action.name), editing: false, editId: null});
        case ActionTypes.START_EDIT_CATEGORY:
            console.log(ActionTypes.START_EDIT_CATEGORY);
            return Object.assign({}, state, {editing: true, editId: action.id});
        default:
            return state;
    }
}

function addCategory(categories, name){
    let duplicate = categories.filter(category => category.name===name);
    if(duplicate.length === 0)
        return categories.concat([{name: name, count: 0, id: Date.now()}]);
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

const store = createStore(category);

function mapStateToProps(state={categories:[], editing: false, editId: null}){
    console.log("mapStateToProps");
    console.log(state);
    return {
        categories: state.categories,
        editing: state.editing,
        editId: state.editId
    };
}

function mapDispatchToProps(dispatch){
    return {
        onAddCategory: (name) => {dispatch(actions.addCategory(name));},
        onRemoveCategory: (id) => {dispatch(actions.removeCategory(id));},
        onEditCategory: (id, name) => {dispatch(actions.editCategory(id, name));},
        onEditStart: (id) => {dispatch(actions.startEditCategory(id))}
    };
}

const App = connect(mapStateToProps, mapDispatchToProps)(Category);


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"));