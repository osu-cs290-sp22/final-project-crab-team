(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['fact'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<article class=\"crab-fact\">\r\n	<div class=\"factheader\">\r\n		<h3 class=\"fact-title\"> "
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":3,"column":26},"end":{"line":3,"column":35}}}) : helper)))
    + " </h3>\r\n	</div>\r\n	<div class=\"fact-content\">\r\n	  <p class=\"fact-text\"> "
    + alias4(((helper = (helper = lookupProperty(helpers,"text") || (depth0 != null ? lookupProperty(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":6,"column":25},"end":{"line":6,"column":33}}}) : helper)))
    + " </p>\r\n	  <p class=\"fact-author\"> "
    + alias4(((helper = (helper = lookupProperty(helpers,"author") || (depth0 != null ? lookupProperty(depth0,"author") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data,"loc":{"start":{"line":7,"column":27},"end":{"line":7,"column":37}}}) : helper)))
    + " </p>\r\n	</div>\r\n	<div class =\"tags\">\r\n	  <p class = \"tag-text\"> "
    + alias4(((helper = (helper = lookupProperty(helpers,"tags") || (depth0 != null ? lookupProperty(depth0,"tags") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tags","hash":{},"data":data,"loc":{"start":{"line":10,"column":26},"end":{"line":10,"column":34}}}) : helper)))
    + " </p>\r\n	</div>\r\n</article>";
},"useData":true});
})();