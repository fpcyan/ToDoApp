"use strict";
(function(root){
  var TodoStore = root.TodoStore = {};
  var _todos = [];
  var _callbacks = [];

  TodoStore.changed = function(){
    _callbacks.forEach(function(callback){
      callback();
    });
  };

  TodoStore.addChangedHandler = function (callback) {
    _callbacks.push(callback);
  };

  TodoStore.removeChangedHandler = function (callback) {
    _callbacks = _callbacks.filter(function(_callback){
      return _callback !== callback;
    });
  };

  TodoStore.all = function () {
    return _todos.slice();
  };

  TodoStore.fetch = function () {
    $.ajax({
      url: '/api/todos',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        _todos = data;
        TodoStore.changed();
      }
    });
  };

  TodoStore.create = function (todo) {
    // is data parsed already?
    $.ajax({
      url: '/api/todos',
      type: 'POST',
      dataType: 'json',
      data: { todo: todo },
      success: function (data) {
        _todos.push(data);
        TodoStore.changed();
      }
    });
  };

  TodoStore.destroy = function (id) {
    var toRemove = _todos.filter( function(todo) {
      return todo.id === id;
    });

    if (toRemove.length > 0) {
      $.ajax({
        url: '/api/todos/' + id,
        type: 'DELETE',
        dataType: 'json',
        data: { id: id },
        success: function (data) {
          var idx = _todos.indexOf(toRemove);
          _todos.splice(idx);
          TodoStore.changed();
        }
      });
    }
  };

  TodoStore.toggleDone = function(id) {
    // debugger;
    var toUpdate = _todos.filter( function(todo) {
      return todo.id === id;
    });
    $.ajax({
      url: '/api/todos/' + id,
      type: 'PATCH',
      dataType: 'json',
      data: { id: id, todo: { done: !toUpdate[0].done }},
      success: function (data) {
        TodoStore.changed();
      }
    });
  }


})(this);