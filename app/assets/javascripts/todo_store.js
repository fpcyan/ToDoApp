"use strict";
(function(root){
  var TodoStore = root.TodoStore = {};
  var _todos = [];
  var _callbacks = [];

  TodoStore.changed = function () {
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
    var toDo = toRemove[0];
    if (toRemove.length > 0) {
      $.ajax({
        url: '/api/todos/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
          var idx = _todos.indexOf(toDo);
          _todos.splice(idx, 1);
          TodoStore.changed();
        }
      });
    }
  };

  TodoStore.toggleDone = function(id) {
    var toUpdate = _todos.filter( function(todo) {
      return todo.id === id;
    });
    var toDo = toUpdate[0];
    $.ajax({
      url: '/api/todos/' + id,
      type: 'PATCH',
      dataType: 'json',
      data: { todo: { done: !toDo.done }},
      success: function (data) {
        toDo.done = !toDo.done;
        TodoStore.changed();
      }
    });
  };


})(this);
