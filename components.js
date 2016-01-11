import React from 'react'


class CategoryAddForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {input: null};
    }

    componentWillReceiveProps(nextProps){
        //console.log("CategoryAddForm.componentWillReceiveProps");
        //console.log(nextProps);
        const {categories, editId, editing} = nextProps;
        if(editing===true){
            let category = categories.filter(category => (category.id===editId));
            //console.log(category);
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
            //console.log("CategoryAddForm:handleSubmit");
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
        const items = this.props.items;
        let list = this.props.data.map(category => {
            let count=0, total=0;
            items.forEach(item => {
                if(item.category===category.id){
                    count++;
                    total+=item.price;
                }
            });
            return(
                <div key={category.id}>
                    <span className="fa fa-times" onClick={this.handleCategoryRemove.bind(this, category.id)}>&nbsp;&nbsp;</span>
                    <span className="fa fa-pencil" onClick={this.handleStartEditCategory.bind(this, category.id)}>&nbsp;&nbsp;</span>
                    <span>{category.name} - </span>
                    <span>{count} items - </span>
                    <span>${total} </span>
                </div>);
        });
        return (
            <div>{list}</div>
        );
    }

    handleCategoryRemove(id){
        let {onRemoveCategory} = this.props;
        //console.log("handleCategoryRemove %s", id);
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
        const {categories, categoryForm: {editing: editing, editId: editId}, items} = this.props;
        return (
            <div>
                <CategoryAddForm categories={categories} editing={editing} editId={editId}
                    onAddCategory={this.props.onAddCategory} onEditCategory={this.props.onEditCategory}/>
                <CategoryList data={categories} items={items} onRemoveCategory={this.props.onRemoveCategory} onEditStart={this.props.onEditCategoryStart}/>
            </div>
        );
    }
}

class ItemForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {selectedCategory: "", name: null, price: null};
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.editing===true){
            const editItem = this.props.items.filter(item => item.id===nextProps.editId);
            if(editItem.length>0){
                this.setState({
                    name: editItem[0].name,
                    price: editItem[0].price,
                    selectedCategory: editItem[0].category
                });
            }
        }
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
        const {onAddItem, onEditItem} = this.props;
        let price = 0.0;
        try{
            price = parseFloat(this.state.price);
        }catch(e){
            //console.log("Error parsing!!!");
        }

        if(this.props.editing===true)
            onEditItem(this.props.editId, this.state.name, price, this.state.selectedCategory);
        else
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
        const {items, categories, onRemoveItem, onEditItemStart, categoryFilter} = this.props;
        //console.log("categoryFilter : %s", categoryFilter);
        let filteredItems = items;
        if(categoryFilter!==null){
            filteredItems = filteredItems.filter(item => item.category===categoryFilter);
        }
        let itemList = filteredItems.map(item => {
            let category = categories.filter(category => category.id===item.category);
            let categoryName = category.length>0?category[0].name:null;
            return (<tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{categoryName}</td>
                <td>
                    <span className="fa fa-times" onClick={onRemoveItem.bind(null, item.id)}>&nbsp;&nbsp;</span>
                    <span className="fa fa-pencil" onClick={onEditItemStart.bind(null, item.id)}></span>
                </td>
            </tr>)});
        let hideTable = (items.length===0);
        let style = {display: hideTable?'none':'block'};
        return (
            <div style={style}>
                <table className='table table-bordered table-hover item-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{itemList}</tbody>
                </table>
            </div>
        );
    }
}

class ItemCategoryFilter extends React.Component {
    constructor(props){
        super(props);
        this.state={selectedCategory: null};
    }
    render() {
        const {categories, items} = this.props;
        const categoriesWithItems = categories.filter(category => {
            let categoryItems = items.filter(item => (item.category === category.id));
            return categoryItems.length > 0;
        });
        const filterOptions = categoriesWithItems.map(category => {
            return (
                <option value={category.id} key={category.id}>
                    {category.name}
                </option>
            );
        });
        let style = {display: items.length>0?"block":"none"};
        return (
            <div id='category-filter' style={style}>
                <select value={this.state.selectedCategory} onChange={this.handleFilterChange.bind(this)}>
                    <option value="">All</option>
                    {filterOptions}
                </select>
            </div>
        );
    }

    handleFilterChange(e){
        //console.log("ItemCategoryFilter change: %s", e.target.value);
        let filterValue = e.target.value
        if(filterValue==="")
            filterValue = null;

        this.setState({selectedCategory: filterValue});
        this.props.onCategoryFilterChange(filterValue);
    }
}

class Item extends React.Component {
    render() {
        return (
            <div>
                <ItemForm categories={this.props.categories} onAddItem={this.props.onAddItem} onEditItem={this.props.onEditItem} editing={this.props.itemForm.editing} editId={this.props.itemForm.editId} items={this.props.items}/>
                <ItemCategoryFilter categories={this.props.categories} items={this.props.items} onCategoryFilterChange={this.props.onCategoryFilterChange}/>
                <ItemList items={this.props.items} categories={this.props.categories} onRemoveItem={this.props.onRemoveItem} onEditItemStart={this.props.onEditItemStart} categoryFilter={this.props.categoryFilter}/>
            </div>
        );
    }
}

export default class ExpenseTracker extends React.Component{
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