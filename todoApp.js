var TodoApp = React.createClass({
  getInitialState: function() { return todolist; },
  render: function() {
    return (
      <div className='container-fluid'>
        <h1>make a todo list</h1>
        <button className="btn btn-primary" onClick={this._handleSort}>sort!</button><br/><br/>
        <button className="btn" onClick={this._handleDouble}>x2</button>
        <Todoadder onAdd={this._handleAdd} />
        <Displaytodos todos={this.state.todos} filterText={this.state.filterText} onDelete={this._handleDelete}/>
        <FilterForm todos={this.state.todos} onFilter={this._handleFilter}/>
      </div>
    );
  },
  _handleAdd: function(todo) {
    todolist.addtodo(todo);
    $("form#todoForm")[0].reset();
    return this.setState(todolist);
  },
  _handleSort: function() {
    todolist.todos = todolist.todos.sort();
    return this.setState(todolist);
  },
  _handleDelete: function(key) {
    todolist.removetodo(key);
    return this.setState(todolist);
  },
  _handleFilter: function(pattern) {//display list somehow
    if (pattern.length > 0) {
      todolist.filterText = pattern;
    } else {
      todolist.filterText = null;
    }
    return this.setState(todolist);
  },
  _handleDouble: function() {
    todolist.todos = _.map(todolist.todos, function(e) {return e+e;});
    return this.setState(todolist);
  }
});

var FilterForm = React.createClass( {
  propTypes: {
  todos: React.PropTypes.array.isRequired,
  onFilter: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <form onSubmit={this._handleSubmit}>
      filter: <input type="text" name="filter"  placeholder=""/>
      </form>
    );
  },
  _handleSubmit: function(event) {
    event.preventDefault();
    event.isDefaultPrevented();
    var tomatch = $(event.target).find("input[name=filter]").val();
    return this.props.onFilter(tomatch);
    }
  });

var Todoadder = React.createClass( {
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <form id="todoForm" onSubmit={this._handleSubmit}>
      add: <input type="text" name="todo" placeholder=""/>
      </form>
    );
  },
  _handleSubmit: function(event) {
    event.preventDefault();
    event.isDefaultPrevented();
    this.props.onAdd($(event.target).find("input[name=todo]").val());
  }
});
var todolist = {
  todos: [],
  filterText: null,
  addtodo: function(curritem) {
    this.todos.push(curritem);
  },
  removetodo: function(key) {
    this.todos.splice(key, 1);
  }
};

var Displaytodos = React.createClass( {
  propTypes: {
    todos: React.PropTypes.array.isRequired,
    filterText: React.PropTypes.string.isRequired,
    onDelete: React.PropTypes.func.isRequired,
  },
  render: function() {
    var filterText = this.props.filterText;
    var todos = (filterText == null) ? this.props.todos : _.filter(this.props.todos, function(elt) {
      return elt.indexOf(filterText) > -1;
    });

    listedtodos = [];
    for (var key in todos) {
      listedtodos.push(<li className="list-group-item" id={key} onClick={this._handleItemClick}>{todos[key]}</li>);
    }
    return <ul className="list-group">{listedtodos}</ul>;
  },
  _handleItemClick: function(event) {
    var key = event.target.id;
    this.props.onDelete(key);
  }
});

React.render(
  <TodoApp/>,
  document.body
);
