OC.routing = {};

OC.routing.handleClick = function(){


    $(document).on("click", "a:not([data-bypass])", function(evt) {
        // Get the absolute anchor href.
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";

        // Ensure the protocol is not part of URL, meaning it's relative.
        if (href && href.slice(0, protocol.length) !== protocol &&
            href.indexOf("javascript:") !== 0  &&
            href.indexOf("mailto:") !== 0) {

            hash = href.replace(/^[#|\/]/, "")
            evt.preventDefault();
            OC.routing.handleLinkData(this);
            OC.routing.findPlaceInNav(hash);
            OC.routing.navigate(hash, true);
        }
    });
}

OC.routing.init = function(){
    OC.routing.reloadState();
    OC.routing.handleClick();
    window.onpopstate = function(event){
        if(window.location.hash == ""){
            // we are home. show welcome
            OC.routing.showPanel("intro");
        }else{
            var hash = window.location.hash.replace(/^\#/, "");
            OC.routing.showPanel(hash);
        }
    }
}

OC.routing.findPlaceInNav = function(hash){
    $("nav.nav-main li[data-section]").hide();
    $("nav.nav-main a").each(function(c, el){
        if($(el).attr("href") && $(el).attr("href").substr(1) == hash){
            if($(el).is(".section_heading")){
                $("li[data-section="+$(el).attr("href").substr(1)+"]").show();
            }else{
                $("li[data-section="+$(el).parents("nav>ul>li").prev().find("a").attr("href").substr(1)+"]").show();
            }
        }

    });
}

OC.routing.dataAttrs = ["data-occupancy", "data-zoning-status", "data-parking-district", "data-section"];

OC.routing.handleLinkData = function(el){
    for(d in OC.routing.dataAttrs){
        var attr = OC.routing.dataAttrs[d];
        if($(el).is("["+attr+"]")){
            var val = $(el).attr(attr);
            OC.state.set(attr.substr(5), $(el).attr(attr));
            $("["+attr+"]:not(["+attr+"="+val+"]):not(a)").hide();
            $("["+attr+"="+val+"]").show();
        }
    }
}
OC.routing.reloadState = function(){
    var state = OC.state.get();
    console.log("state:", state);
    for(s in state){
        $("[data-"+s+"]:not([data-"+s+"="+state[s]+"]):not(a)").hide();
        $("[data-"+s+"="+state[s]+"]").show();
    }
}



OC.routing.showPanel = function(panelId){
    $("section.content > div").hide();
    $("div#"+panelId).show();
}
OC.routing.navigate = function(hash, addToHistory){
    OC.routing.showPanel(hash);
    // add to history
    history.pushState({"page":hash}, hash, "#"+hash);
}