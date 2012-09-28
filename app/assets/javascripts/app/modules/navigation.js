define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Navigation = app.module();

  // Default model.
  Navigation.Model = Backbone.Model.extend({
    name: 'navigation'
  
  });

  // Default collection.
  Navigation.Collection = Backbone.Collection.extend({
    model: Navigation.Model
  });

  // Main nav view
  Navigation.Views.Main = Backbone.View.extend({
    
    template: "navigation",
    className: "offset1 span11",
    events: {},
    afterRender: function(){
          
      // Grab the navigation container and window.location
      var $nav = $(this.el),
          path = window.location.pathname.toLowerCase() || "";
      
      // For each link in the navigation
      $nav.find("a").each(function(i, el) {
        
        var $el = $(el),
            href = $el.attr("href") || "",
            dataSection = href.slice(1).split('/')[0] || "",
            pathSection = path.slice(1).split('/')[0] || "";
        
        console.log('dataSection: ' + dataSection);
        console.log('pathSection: ' + pathSection);
        console.log('path: ' + path);
        
        // Unset class="current" from parent <li>
        $el.parent().removeClass("current");
        
        // If the link's href matches the path:
        if (dataSection === pathSection) {
          
          // Set class="current" on parent <li>
          $el.parent().addClass("current");
          
        }
      });
    },
    cleanup: function() {
      this.business.off(null, null, this);
      this.answers.off(null, null, this);
    }, 
    initialize: function(o) {
      this.business = o.business;
      this.business.on("change", this.render, this);
      this.answers = o.answers;
      this.answers.on("add", this.render, this);
      this.answers.on("change", this.render, this);
    }  
  });
  
  // Sub nav view
  Navigation.Views.Sub = Backbone.View.extend({
    
    template: "subnavigation",
    events: {},
    afterRender: function(){
          
      // Grab the navigation container and window.location
      var $nav = $(this.el),
          path = window.location.pathname.toLowerCase() || "";
      
      // Hide all submenus
      $nav.find("ol[data-section]").hide();
      
      // Remove all class="current
      $nav.find("a").removeClass("current");
      
      // For each link in the navigation
      $nav.find("a").each(function(i, el) {
        
        var $el = $(el),
            href = $el.attr("href") || "",
            dataSection = href.slice(1).split('/')[0] || "",
            pathSection = path.slice(1).split('/')[0] || "";
        
        // If the link's href matches the path:
        if (path === href) {
          // Set class="current" on the current link
          $el.addClass("current");
        }

        // If the link's href matches the path:
        if (dataSection === pathSection) {
          
          // Show the nav links for this section
          $nav.find("ol[data-section=" + dataSection + "]").show();
        }
      });
      this.updateNavByAnswers();
    },
    updateNavByAnswers: function(){
      this.$el.find("[data-show]").show();

      // show or hide based on home occ.
      if (this.answers.getAnswer("location_type", "") == "home") {
        this.$el.find("[data-show=commercial]").hide();
        this.$el.find("[data-show=food]").hide();
        this.$el.find("[data-show=retail]").hide();
        this.$el.find("[data-show=bid]").hide();
      } else if (this.answers.getAnswer("location_type", "") == "commercial") {
        this.$el.find("[data-show=home]").hide();
      }

      // Show BID
      if (this.answers.getAnswer("bid", "") == "") {
        this.$el.find("[data-show=bid]").hide();
      }
      
    },
    cleanup: function() {
      this.business.off(null, null, this);
      this.answers.off(null, null, this);
    }, 
    initialize: function(o) {
      this.business = o.business;
      this.business.on("change", this.render, this);
      this.answers = o.answers;
      this.answers.on("add", this.render, this);
      this.answers.on("change", this.render, this);
    }  
  });

  
  // Return the module for AMD compliance.
  return Navigation;

});
