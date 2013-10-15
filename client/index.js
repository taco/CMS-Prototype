MeteorMixin = {
  componentWillMount: function() {
    var component = this;
    component._meteorComputation = Deps.autorun(function() {
      component.setState(component.getMeteorState());
    });
  },

  componentWillUnmount: function() {
    this._meteorComputation.stop();
    delete this._meteorComputation;
  }
};

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to Cms.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}
