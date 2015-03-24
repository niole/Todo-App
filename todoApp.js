"use strict";
/*global React*/

var TodoApp = React.createClass({
  getInitialState: function() { return todolist; },
  render: function() {
    return (
      <div className='container-fluid' style={{'textAlign':'center'}}>
        <div className="page-header">
        <h1>Todo Lists..<small>...make one!</small></h1>
        </div>
        <Displaytodos todos={this.state.todos} filterText={this.state.filterText} onDelete={this._handleDelete}/>
        <Todoadder onAdd={this._handleAdd} />
        <FilterForm todos={this.state.todos} onFilter={this._handleFilter}/><br/>
        <button className="btn btn-primary" onClick={this._handleSort}>sort by deadline</button>
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
});

var FilterForm = React.createClass( {
  propTypes: {
    todos: React.PropTypes.array.isRequired,
    onFilter: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <form onSubmit={this._handleSubmit}>
        <input type="text" name="filter"  placeholder="check if it's in the list"/>
      </form>
    );
  },
  _handleSubmit: function(event) {
    event.preventDefault();
    var tomatch = $(event.target).find("input[name=filter]").val();
    return this.props.onFilter(tomatch);
    }
  });

//http://materializecss.com/forms.html
var Todoadder = React.createClass( {
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },
  componentDidMount: function() {
    $('#datepicker').datepicker();
  },
  render: function() {
    return (
      <div>
        <form id="todoForm" onSubmit={this._handleSubmit}>
          <input type="text" name="todo" placeholder="what's on your todo list?"/>
          <input id="datepicker" placeholder="set a deadline"/>
        </form>
      </div>
    );
  },
  _handleSubmit: function(event) {
    event.preventDefault();
    var newTodo = $(event.target).find("input[name=todo]").val();
    if (newTodo !== '') {
      this.props.onAdd(newTodo);
    }
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

    var listedtodos = [];
    for (var key in todos) {
      listedtodos.push(<tr >
                        <td id="todoitem" className="dropdown"><a href="#" className="dropdown-toggle" data-toggle="dropdown">{todos[key]}</a>
                         <ul className="dropdown-menu">
                          <li><a id={key} href="#" onClick={this._handleItemClick}>delete</a></li>
                         </ul>
                        </td>
                      </tr>);
    }
    return (
        <table className="table">
          <tbody>
            {listedtodos}
          </tbody>
        </table>
    );
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
