import React from 'react';
import ReactDOM from 'react-dom';
import * as actions from './actions'
import ActionTypes from './constants'
import {createStore, combineReducers} from 'redux'
import {connect, Provider} from 'react-redux'
import './style.css'


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
                <div className="form-horizontal form-group-sm">
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Add/Edit Category</label>
                        <div className="col-sm-9">
                            <input type="text" ref='input' className="form-control" placeholder="Category Name" 
                            value={this.state.input} onChange={this.handleInputChange.bind(this)} onKeyUp={this.handleSubmit.bind(this)}/>
                        </div>                        
                    </div>
                </div>
            </div>
        );
    }

    handleInputChange(e){        
        this.setState({input: e.target.value});
    }

    handleSubmit(e){
        //console.log(e.keyCode);
        if(e.keyCode===13){
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
}

class CategoryList extends React.Component {
    render(){
        let list = this.props.data.map(category => {return(
            <div key={category.id}>
                <span className="fa fa-times" onClick={this.handleCategoryRemove.bind(this, category.id)}>&nbsp;&nbsp;</span>
                <span className="fa fa-pencil" onClick={this.handleStartEditCategory.bind(this, category.id)}>&nbsp;&nbsp;</span>
                <span>{category.name} - </span>
                <span>{category.count} items - </span>
                <span>${category.total} </span>
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
        const {categories, categoryForm: {editing: editing, editId: editId}} = this.props;
        return (
            <div>
                <CategoryAddForm categories={categories} editing={editing} editId={editId} 
                    onAddCategory={this.props.onAddCategory} onEditCategory={this.props.onEditCategory}/>
                <CategoryList data={categories} onRemoveCategory={this.props.onRemoveCategory} onEditStart={this.props.onEditCategoryStart}/>
            </div>
        );
    }
}

class ItemForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {selectedCategory: "", name: null, price: null};
    }

    render() {
        let {categories} = this.props;
        let categoryOptions = categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
        ));
        return (
            <div className="form-horizontal form-group-sm">
                <div className="form-group">
                    <label className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-9">
                        <input value={this.state.name} type="text" className="form-control" placeholder="Item Name" onChange={this.handleNameChange.bind(this)}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-3 control-label">Price</label>
                    <div className="col-sm-9">
                        <input value={this.state.price} type="text" className="form-control" placeholder="Item Price" onChange={this.handlePriceChange.bind(this)}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-3 control-label">Category</label>
                    <div className="col-sm-9">
                        <select className="form-control input-sm" value={this.state.selectedCategory} onChange={this.handleCategoryChange.bind(this)}>
                            <option value={""}>Select Category</option>
                            {categoryOptions}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-9 col-sm-offset-3">
                        <button type="text" className="btn btn-default btn-sm" onClick={this.handleItemSubmit.bind(this)}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }

    handleItemSubmit(e){
        const {onAddItem} = this.props;
        let price = 0.0;
        try{
            price = parseFloat(this.state.price);
        }catch(e){
            console.log("Error parsing!!!");
        }
        onAddItem(this.state.name, price, this.state.selectedCategory);
        this.resetForm();
        //console.log(this.state);
        //this.resetForm();
    }

    resetForm(){
        this.setState({
            selectedCategory: "",
            name: null,
            price: null
        });
    }

    handleCategoryChange(e){
        this.setState({selectedCategory: e.target.value});
    }

    handleNameChange(e){
        this.setState({name: e.target.value});
    }

    handlePriceChange(e){
        this.setState({price: e.target.value});   
    }
}

class ItemList extends React.Component {
    render() {
        const {items, categories} = this.props;
        const itemList = items.map(item => {
            let category = categories.filter(category => category.id===item.category);
            let categoryName = category.length>0?category[0].name:null;
            return (<tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{categoryName}</td>
            </tr>)});
        return (
            <div>
                <table className='table table-bordered table-hover item-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>{itemList}</tbody>
                </table>
            </div>
        );
    }
}

class Item extends React.Component {
    render() {
        return (
            <div>
                <ItemForm categories={this.props.categories} onAddItem={this.props.onAddItem}/>
                <ItemList items={this.props.items} categories={this.props.categories}/>
            </div>
        );
    }
}

class ExpenseTracker extends React.Component{
    render(){
        return (
            <div id="expense-tracker">
                <div>
                    <h4>Expense Category</h4>
                    <Category {...this.props}/>
                </div>
                <div>
                    <h4>Expenses</h4>
                    <Item {...this.props}/>
                </div>
            </div>
        );
    }
}

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

function categories(state=[], action) {
    console.log("categories reducer");
    switch(action.type){
        case ActionTypes.ADD_CATEGORY:
            console.log(ActionTypes.ADD_CATEGORY);
            return addCategory(state, action.name);
        case ActionTypes.REMOVE_CATEGORY:
            console.log(ActionTypes.REMOVE_CATEGORY);
            return deleteCategory(state, action.id);
        case ActionTypes.EDIT_CATEGORY:
            console.log(ActionTypes.EDIT_CATEGORY);
            return editCategory(state, action.id, action.name);
        case ActionTypes.ADD_ITEM:
            console.log(ActionTypes.ADD_ITEM);
            return incrementCategoryCount(state, action.category, action.price);
        default:
            return state;
    }   
}

function categoryForm(state={editing: false, editId: null}, action){
    console.log("categoryForm reducer");
    switch(action.type){
        case ActionTypes.EDIT_CATEGORY:
            console.log(ActionTypes.EDIT_CATEGORY);
            return {editing: false, editId: null};
        case ActionTypes.START_EDIT_CATEGORY:
            console.log(ActionTypes.START_EDIT_CATEGORY);
            return {editing: true, editId: action.id};        
        default:
            return state;
    }
}

function addCategory(categories, name){
    let duplicate = categories.filter(category => category.name===name);
    if(duplicate.length === 0)
        return categories.concat([{name: name, count: 0, id: Date.now().toString(), total: 0}]);
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

function incrementCategoryCount(categories, id, price){
    let category = categories.filter(category => category.id===id);
    if(category.length>0){
        category[0].count += 1;
        category[0].total += price;
    }
    return categories.concat([]); 
}

function items(state=[], action){
    switch(action.type){
        case ActionTypes.ADD_ITEM:
            return addItem(state, action.name, action.price, action.category);
        case ActionTypes.REMOVE_CATEGORY:
            return state.filter(item => (item.category!==action.id));
        default:
            return state;
    }
}

function itemForm(state={editing: false, editId: null}, action){
    return state;
}

function addItem(items, name, price, category) {
    return items.concat([{
        id: Date.now().toString(),
        name: name,
        price: price,
        category: category
    }]);
}

const store = createStore(combineReducers({
    categories,
    categoryForm,
    items,
    itemForm
}));


function mapStateToProps(state=initialState){
    console.log("mapStateToProps");
    console.log(state);
    return state;
}

function mapDispatchToProps(dispatch){
    return {
        onAddCategory: (name) => {dispatch(actions.addCategory(name));},
        onRemoveCategory: (id) => {dispatch(actions.removeCategory(id));},
        onEditCategory: (id, name) => {dispatch(actions.editCategory(id, name));},
        onEditCategoryStart: (id) => {dispatch(actions.startEditCategory(id));},
        onAddItem: (name, price, categoryId) => {dispatch(actions.addItem(name, price, categoryId));}
    };
}

const App = connect(mapStateToProps, mapDispatchToProps)(ExpenseTracker);


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"));