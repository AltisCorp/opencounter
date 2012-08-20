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
  
  });

  // Default collection.
  Navigation.Collection = Backbone.Collection.extend({
    model: Navigation.Model
  });

  Navigation.Views.Sidebar = Backbone.View.extend({
    
      tagName: "nav",
      
      className: "nav-main",
      
      template:"navigation",
      
      events: {
      },
      
      beforeRender: function(){
          console.log("template beforeRender:",this.template);
      },
      
      afterRender: function(){
          
          // Grab the navigation container and window.location
          var $nav = $(this.el),
              path = window.location.pathname.toLowerCase() || "";
          
          // Hide all submenus
          $nav.find("li[data-section]").hide();
          
          // For each link in the navigation
          $nav.find("a").each(function(i, el) {
              
              var $el = $(el),
                  href = $el.attr("href") || "",
                  dataSection = "";
              
              // Unset class="current" from parent <li>
              $el.parent().removeClass("current");
              
              // If the link's href matches the path:
              if (href === path) {
                  
                  // Set class="current" on parent <li>
                  $el.parent().addClass("current");
                  
                  // Figure out what section we're in
                  if ( $el.is(".section_heading") ) {
                      dataSection = href.slice(1);
                  } else {
                      dataSection = $el.parents("nav > ul > li").prev().find("a").attr("href").slice(1);
                  }
                  
                  // Show the nav links for this section
                  $nav.find("li[data-section=" + dataSection + "]").show();
              }
          });
      },
      
      cleanup: function() {
          this.model.off(null, null, this);
      },
      
      initialize: function(o) {
          this.business = o.business;
          this.business.on("change", this.render, this);
      }
      
  });

  // Return the module for AMD compliance.
  return Navigation;

});
