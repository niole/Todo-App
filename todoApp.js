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
        <form id="todoForm">
          <input type="text" ref="todo" placeholder="what's on your todo list?"/>
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
      return elt[0].indexOf(filterText) > -1;
    });

    var listedtodos = [];
    for (var key in todos) {
//      console.log('todo it');
//      console.log(todos[key]);
      listedtodos.push(<tr >
                        <td id="todoitem" className="dropdown"><a href="#" className="dropdown-toggle" data-toggle="dropdown">{todos[key].todo}</a>
                        &nbsp;&nbsp;&nbsp;<span className="label label-default">{todos[key].deadline}</span>
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
