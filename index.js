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
        let {onAddCategory} = this.props;
        let input = this.state.input.trim();
        this.setState({input: null});
        onAddCategory(input);
    }
}

class CategoryList extends React.Component {
    render(){
        let list = this.props.data.map(category => {return(
            <div key={category.id}>
                <span className="fa fa-times" onClick={this.handleCategoryRemove.bind(this, category.id)}></span>
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
}

class Category extends React.Component {
    render(){
        const {categories} = this.props;
        console.log(categories);
        return (
            <div>
                <CategoryAddForm onAddCategory={this.props.onAddCategory} />
                <CategoryList data={categories} onRemoveCategory={this.props.onRemoveCategory}/>
            </div>
        );
    }
}



function category(state={categories: []}, action){
    console.log("category reducer");
    switch(action.type){
        case ActionTypes.ADD_CATEGORY:
            console.log(ActionTypes.ADD_CATEGORY);
            return Object.assign({}, state, {categories: addCategory(state.categories, action.name)});
        case ActionTypes.REMOVE_CATEGORY:
            console.log(ActionTypes.REMOVE_CATEGORY);
            return Object.assign({}, state, {categories: deleteCategory(state.categories, action.id)});
        case ActionTypes.EDIT_CATEGORY:
            return Object.assign({}, state, {categories: addCategory(state.categories, action.id, action.name)});
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
    let index = -1;
    categories.forEach( (category, i) => { if(category.id===id) index=i; });
    if(index > -1)
        categories[index].name = newName;
    return categories;
}

const store = createStore(category);

function mapStateToProps(state){
    console.log("mapStateToProps");
    console.log(state);
    return {
        categories: state.categories
    };
}

function mapDispatchToProps(dispatch){
    return {
        onAddCategory: (name) => {dispatch(actions.addCategory(name));},
        onRemoveCategory: (id) => {dispatch(actions.removeCategory(id))}
    };
}

const App = connect(mapStateToProps, mapDispatchToProps)(Category);


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"));