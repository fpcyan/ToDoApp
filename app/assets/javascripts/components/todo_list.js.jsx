var TodoList = React.createClass({

  getInitialState: function () {
    return ({ todoList: TodoStore.all() });
  },

  todoListChanged: function () {
    this.setState ({ todoList: TodoStore.all() });
  },

  componentDidMount: function () {
    TodoStore.addChangedHandler(this.todoListChanged);
    TodoStore.fetch();
  },

  componentWillUnmount: function () {
    TodoStore.removeChangedHandler(this.todoListChanged);

  },

  render: function () {
    return (
      <div>
        <TodoForm />
        <div>
          {
            this.state.todoList.map( function (todo) {
              return <TodoListItem key={todo.title} todo={todo} />;
            })
          }
        </div>
      </div>
    );
  }

});

var TodoListItem = React.createClass({

  handleDestroy: function (e) {
    e.preventDefault();
    TodoStore.destroy(this.props.todo.id);
  },

  render: function() {
    return(
      <div className="list-item">
        <div className="list-item-title">{this.props.todo.title}</div>
        <div className="list-item-body">{this.props.todo.body}</div>
        <button onClick={this.handleDestroy} >Delete Item</button>
        <DoneButton todo={this.props.todo} />
      </div>
    );
  }
});

var DoneButton = React.createClass({

  handleDone: function (e) {
    e.preventDefault();
    TodoStore.toggleDone(this.props.todo.id);

  },

  render: function () {

    var text = (this.props.todo.done) ? "Undo" : "Done";
    return (
      <div>
        <button onClick={this.handleDone}>{ text }</button>
      </div>
    );
  }
});

var TodoForm = React.createClass({

  getInitialState: function () {
    return ({ title: "", body: "" });

  },

  updateTitle: function (e) {
    e.preventDefault();
    this.setState({title: e.currentTarget.value});
  },

  updateBody: function (e) {
    e.preventDefault();
    this.setState({body: e.currentTarget.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    TodoStore.create({title: this.state.title, body: this.state.body, done: false});
    this.setState({ title: "", body: "" });
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title
          <input type="text" onChange={this.updateTitle} value={this.state.title} />
        </label>
        <label>
          Body
          <input type="text" onChange={this.updateBody} value={this.state.body} />
        </label>
        <button>Submit</button>
      </form>
    );
  }
});

$(document).ready(function () {
  React.render(React.createElement(TodoList), document.getElementById("to-do"));
});
