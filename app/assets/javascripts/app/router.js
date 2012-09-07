define([
  // Application.
  "app",
  "modules/user",
  "modules/business",
  "modules/answer",
  "modules/navigation",
  "modules/fees/parking",
  "modules/location"
],

function(app, User, Business, Answer, Navigation, Parking, Location) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "requirement/city/parking":"parking",
      "info/business": "businessInfo",
      "location/check":"locationCheck",
      "*path":"panel"
    },
    index: function(e){
      console.log("index");
    },
    parking:function(){

      var panel = new (Answer.Views.Panel.extend(Parking.Views.Calculator.prototype))({
        collection:this.answers,
        useTemplate:"fees/parking-downtown"
      });

      app.layout.setView("div#content", panel);
      app.layout.render();
    },
    businessInfo: function(){
      var panel = new (Answer.Views.Panel.extend(Business.Views.Info.prototype))({
        collection:this.answers,
        useTemplate:"panels/info/business"
      });

      app.layout.setView("div#content", panel);
      app.layout.render();
    },
    locationCheck: function(){
      var panel = new (Answer.Views.Panel.extend(Location.Views.Check.prototype))({
        collection:this.answers
      });

      app.layout.setView("div#content", panel);
      app.layout.render();
    },
    panel: function(path){
      
      if(path == ""){path="intro";}
      app.layout.setView("div#content", new Answer.Views.Panel({
          collection:this.answers,
          useTemplate:"panels/"+path
      }));

      app.layout.render();
    },
    initialize: function(){
      this.user = new User.Model();
      this.business = new Business.Model();
      this.answers = new Answer.Collection();
      app.useLayout("main");

      var sidebar =  new Navigation.Views.Sidebar({  // this might make more sense as a view on user? - Mick
        business:this.business,
        answers:this.answers
      });

      app.layout.setViews({
        "div#profile": new Answer.Views.Profile({
          collection:this.answers
        }),
        "div#nav-main": sidebar
      });


    }});
  return Router;

});
