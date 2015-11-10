var SidebarView = React.createClass({

  render: function () {
    return(
      <section className="sidebar wrapper">
        <TodoList />
        <TodoForm />
      </section>
    );
  }

});
