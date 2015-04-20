"use strict";
/*global React*/

var TodoApp = React.createClass({
  getInitialState: function() { return todolist; },
  render: function() {
    return (
      <div className='container-fluid' style={{"textAlign":"center"}}>
        <FilterForm todos={this.state.todos} onFilter={this._handleFilter}/><br/>
        <div className="thing">
          <div className="page-header">
            <h1>Todo List</h1>
          </div>
          <Displaytodos todos={this.state.todos} filterText={this.state.filterText} onDelete={this._handleDelete}/>
          <Todoadder onAdd={this._handleAdd} />
          <button className="btn btn-primary" onClick={this._handleSort}>sort by deadline</button>
        </div>
      </div>
    );
  },
  _handleAdd: function(todo, deadline) {
    todolist.addtodo(todo, deadline);
    $("form#todoForm")[0].reset();
    return this.setState(todolist);
  },
  _handleSort: function() {
    todolist.todos = _.sortBy(todolist.todos, 'deadline');
    this.setState(todolist);
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
    this.setState(todolist);
  },
});

var FilterForm = React.createClass( {
  propTypes: {
    todos: React.PropTypes.array.isRequired,
    onFilter: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <form className="navbar-form navbar-left" role="search" onSubmit={this._handleSubmit}>
            <div className="form-group">
              <input type="text" name="filter" className="form-control" placeholder="check if it's in the list"/>
            </div>
          </form>
        </div>
      </nav>
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
        <form id="todoForm">
          <input type="text" ref="todo" placeholder="add a todo"/>
          <input id="datepicker" ref="datepicker" placeholder="set a deadline"/>
          <button className="btn btn-primary" onClick={this._handleSubmit}>submit</button>
        </form>
      </div>
    );
  },
  _handleSubmit: function(event) {
    event.preventDefault();
    var newTodo = this.refs.todo.getDOMNode().value.trim();
    var newDeadline = this.refs.datepicker.getDOMNode().value.trim();
    if (newTodo !== '' && newDeadline !== '') {
      this.props.onAdd(newTodo, newDeadline);
    }
  }
});
var todolist = {
  todos: [],
  filterText: null,
  addtodo: function(currTodo, currDeadline) {
    this.todos.push({'todo': currTodo, 'deadline':currDeadline});
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
    var todos = (filterText === null) ? this.props.todos : _.filter(this.props.todos, function(elt) {
      return elt.todo.indexOf(filterText) > -1;
    });

    var listedtodos = [];
    for (var key in todos) {
      listedtodos.push(<tr className="list-group-item">
                        <td className="dropdown"><a href="#" className="dropdown-toggle" data-toggle="dropdown">{todos[key].todo}</a>
                        &nbsp;&nbsp;&nbsp;<span className="label label-default">{todos[key].deadline}</span>
                         <ul className="dropdown-menu">
                          <li><a id={key} href="#" onClick={this._handleItemClick}>delete</a></li>
                         </ul>
                        </td>
                      </tr>);
    }
    return (
      <div className="todos">
      <table>
        <tbody className="list-group">
        </tbody>
          {listedtodos}
      </table>
      </div>
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
