"use strict";
(function(root){
  var TodoStore = root.TodoStore = {};
  var _topics = [];
  var _todos = {};
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

  TodoStore.allTopics = function () {
    return _topics;
  };

  TodoStore.all = function () {
    return _todos;
  };

  TodoStore.fetch = function () {
    $.ajax({
      url: '/api/todos',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        data.forEach( function(obj) {
          if (typeof(_todos[obj.topic]) === "undefined") {
            (_todos[obj.topic] = [obj]);
          } else {
            _todos[obj.topic].push(obj);
          }


          if (_topics.indexOf(obj.topic) === -1) {
           _topics.push(obj.topic);
          }
        });
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
        if (typeof(_todos[data.topic]) === "undefined") {
          _todos[data.topic] = [];
        }

        _todos[data.topic].push(data);
        TodoStore.changed();
      }
    });
  };

  TodoStore.destroy = function (id) {
    var toRemove;
    _topics.forEach( function (topic) {
      var eachRemove = _todos[topic].filter( function(todo) {
        return todo.id === id;
      });

      if (eachRemove.length > 0) {
        toRemove = eachRemove;
      }
    });

    var toDo = toRemove[0];
    if (toRemove.length > 0) {
      $.ajax({
        url: '/api/todos/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
          var idx = _todos[data.topic].indexOf(toDo);
          _todos[data.topic].splice(idx, 1);
          TodoStore.changed();
        }
      });
    }
  };

  TodoStore.toggleDone = function(id) {
    var toUpdate;
    _topics.forEach( function (topic) {
      var eachUpdate = _todos[topic].filter( function(todo) {
        return todo.id === id;
      });

      if (eachUpdate.length > 0) {
        toUpdate = eachUpdate;
      }
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
