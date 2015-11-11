var SidebarView = React.createClass({

  render: function () {
    return(
      <section className="sidebar wrapper">
        <h1>To Do:</h1>
        <TopicLists />
        <h4>Add To Dos</h4>
        <TodoForm />
      </section>
    );
  }

});

var TopicLists = React.createClass({
  getInitialState: function () {
    return ({ todoList: TodoStore.all(), topics: TodoStore.allTopics() });
  },

  todoListChanged: function () {
    this.setState ({ todoList: TodoStore.all(), topics: TodoStore.allTopics() });
  },

  componentDidMount: function () {
    TodoStore.addChangedHandler(this.todoListChanged);
    TodoStore.fetch();
  },

  componentWillUnmount: function () {
    TodoStore.removeChangedHandler(this.todoListChanged);

  },

  render: function () {

    return(
      <div className="sidebar topic-list">
        {
          this.state.topics.map( function (topic) {
            return(
              <div key={topic}>
                <h2 className ="topic">{topic}</h2>
                <TodoList list={this.state.todoList[topic]} />
              </div>
            );
          }.bind(this))
        }
      </div>
    );
  }
});

var TodoList = React.createClass({

  render: function () {
    return (
      <div className="sidebar todo-list">
        {
          this.props.list.map( function (todo) {
            return <TodoListItem key={todo.id} todo={todo} />;
          })
        }
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
    var details, klass;
    klass = "list-item-title";
    if (this.state.detail) {
      details = <MainView todo={this.props.todo}/>;
      klass = "list-item-title details";
    }
    return(
      <div className="list-item">
        <div className={klass} onClick={this.changeDetails}>{this.props.todo.title}</div>
        <DoneButton obj={this.props.todo} objName={"todo"} />

        {details}
      </div>
    );
  }
});

var MainView = React.createClass({

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

  handleListItemDestroy: function (e) {
    e.preventDefault();
    TodoStore.destroy(this.props.todo.id);
  },

  render: function () {

    return(
      <div className="main">
        <article className="list-info">
          Goal:
          <div className="list-item-title" onClick={this.changeDetails}>{this.props.todo.title}</div>
          <div className="list-item-body">{this.props.todo.body}</div>
            <div>
              {
                this.state.stepList.map( function (step) {
                  return(
                      <span className="step-item-list group" key={step.id}>
                        <article className="step">
                          {step.content}
                        </article>
                        <DoneButton obj={step} className="step" objName="step" />
                      </span>
                  );
                })
              }
            </div>
        </article>
        <button onClick={this.handleListItemDestroy}>Delete Item</button>
        <DoneButton obj={this.props.todo} objName={"todo"} />

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
    return ({ title: "", body: "", topic: "" });

  },

  updateTopic: function (e) {
    e.preventDefault();
    this.setState({topic: e.currentTarget.value});
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
    this.setState({ title: "", body: "", topic: "" });
  },

  render: function () {
    return (
      <form className="sidebar todo-form" onSubmit={this.handleSubmit}>
        <label>
          Topic
          <input type="text" onChange={this.updateTopic} value={this.state.topic} placeholder="Groceries, Today, Homework..." />
        </label>
        <label>
          Title
          <input type="text" onChange={this.updateTitle} value={this.state.title} />
        </label>
        <label>
          Body
          <input type="text" onChange={this.updateBody} value={this.state.body} />
        </label>
        <button>Add</button>
      </form>
    );
  }
});


$(document).ready(function () {
  React.render(React.createElement(SidebarView), document.getElementById("to-do"));
});
