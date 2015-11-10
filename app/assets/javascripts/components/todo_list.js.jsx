var TodoList = React.createClass({

  getInitialState: function () {
    return ({ todoList: TodoStore.all() });
  },

  render: function () {
    return (
      <div>
        <ul>
          <h3 className="to-do-header">Todo List</h3>
          {this.state.todoList.map( function (todo) {
            return <TodoListItem key={todo.title} />;
          })}
        </ul>
      </div>
    );
  }

});


$(document).ready(function () {

  React.render(React.createElement(TodoList), document.getElementById("to-do"));
})
