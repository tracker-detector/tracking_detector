const EventManager = (function () {
  const events = {};

  return {
    subscribe: function (eventName, fn) {
      events[eventName] = events[eventName] || [];
      events[eventName].push(fn);
    },
    unsubscribe: function (eventName, fn) {
      if (events[eventName]) {
        const index = events[eventName].indexOf(fn);
        if (index > -1) {
          events[eventName].splice(index, 1);
        }
      }
    },
    fire: function (eventName, data) {
      if (events[eventName]) {
        events[eventName].forEach((fn) => {
          fn(data);
        });
      }
    },
  };
})();

export { EventManager };
