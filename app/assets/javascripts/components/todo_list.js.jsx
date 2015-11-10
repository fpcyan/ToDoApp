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

  getInitialState: function () {
    return { detail: false };
  },

  changeDetails: function () {
    this.setState({ detail: !this.state.detail });
  },

  render: function() {
    var details;
    if (this.state.detail) {
      details = <ItemDetailView todo={this.props.todo}/>;
    }
    return(
      <div className="list-item">
        <div className="list-item-title" onClick={this.changeDetails}>{this.props.todo.title}</div>
        <DoneButton obj={this.props.todo} objName={"todo"} />
        {details}
      </div>
    );
  }
});

var ItemDetailView = React.createClass({

  getInitialState: function () {

    return ({ stepList: StepStore.all(this.props.todo.id), stepContent: "" });
  },

  handleStepContentInput: function (e) {
    e.preventDefault();
    this.setState({ stepContent: e.currentTarget.value });
  },

  handleStepSubmit: function (e) {
    e.preventDefault();
    StepStore.create( { content: this.state.stepContent, done: false }, this.props.todo.id);
    this.setState({ stepContent: "" });
  },

  stepListChanged: function () {
    this.setState ({ stepList: StepStore.all(this.props.todo.id) });
  },

  componentDidMount: function () {
    StepStore.addChangedHandler(this.stepListChanged);
    StepStore.fetch(this.props.todo.id);
  },

  componentWillUnmount: function () {
    StepStore.removeChangedHandler(this.stepListChanged);
  },

  handleDestroy: function (e) {
    e.preventDefault();
    TodoStore.destroy(this.props.todo.id);
  },

  render: function () {

    return(
      <div>
        <div className="list-item-body">{this.props.todo.body}</div>
        <button onClick={this.handleDestroy}>Delete Item</button>

        <div className="step-list">
          {
            this.state.stepList.map( function (step) {
              return(
                <span key={step.id}>
                  <article className="step-item">
                    {step.content}
                  </article>
                  <DoneButton obj={step} objName="step" />
                </span>
              );
            })
          }
        </div>
        <form onSubmit={this.handleStepSubmit} className="step-form">
          <input type="text" onInput={this.handleStepContentInput} value={this.state.stepContent} />
          <button>Add Step</button>
        </form>
      </div>
    );
  }
});

var DoneButton = React.createClass({

  handleDone: function (e) {
    e.preventDefault();
    if (this.props.objName === "todo"){
      TodoStore.toggleDone(this.props.obj.id);
    } else {
      StepStore.toggleDone(this.props.obj.id, this.props.obj.todo_id);
    }

  },

  render: function () {
    var text = (this.props.obj.done) ? "Undo" : "Done";

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
