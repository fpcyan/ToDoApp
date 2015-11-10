"use strict";
(function(root){
  var StepStore = root.StepStore = {};
  var _steps = {};
  var _callbacks = [];

  StepStore.changed = function () {
    _callbacks.forEach(function(callback){
      callback();
    });
  };

  StepStore.addChangedHandler = function (callback) {
    _callbacks.push(callback);
  };

  StepStore.removeChangedHandler = function (callback) {
    _callbacks = _callbacks.filter(function(_callback){
      return _callback !== callback;
    });
  };

  StepStore.all = function (todoId) {
    if (typeof(_steps[todoId]) === "undefined") {
      _steps[todoId] = [];
    }
    return _steps[todoId];
  };

  StepStore.fetch = function (todoId) {
    $.ajax({
      url: '/api/todos/' + todoId + '/steps',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        _steps[todoId] = data;
        StepStore.changed();
      }
    });
  };

  StepStore.create = function (step, todoId) {
    $.ajax({
      url: '/api/todos/' + todoId + '/steps',
      type: 'POST',
      dataType: 'json',
      data: { step: step },
      success: function (data) {
        _steps[todoId].push(data);
        StepStore.changed();
      }
    });
  };

  // StepStore.destroy = function (id) {
  //   var toRemove = _steps.filter( function(step) {
  //     return step.id === id;
  //   });
  //   var toDo = toRemove[0];
  //   if (toRemove.length > 0) {
  //     $.ajax({
  //       url: '/api/steps/' + id,
  //       type: 'DELETE',
  //       dataType: 'json',
  //       success: function (data) {
  //         var idx = _steps.indexOf(toDo);
  //         _steps.splice(idx, 1);
  //         StepStore.changed();
  //       }
  //     });
  //   }
  // };

  StepStore.toggleDone = function(id, todoId) {
    var toUpdate = _steps[todoId].filter( function(step) {
      return step.id === id;
    });
    var toDo = toUpdate[0];
    $.ajax({
      url: '/api/steps/' + id,
      type: 'PATCH',
      dataType: 'json',
      data: { step: { done: !toDo.done }},
      success: function (data) {
        toDo.done = !toDo.done;
        StepStore.changed();
      }
    });
  };


})(this);
