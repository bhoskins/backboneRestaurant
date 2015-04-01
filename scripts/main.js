(function(){
  'use strict';

  window.App = window.App || {};

  var results;
  var templateAppetizers = {};
  var templateEntrees = {};
  var templateSides = {};
  var templateSalads = {};
  var templateKids = {};
  /*****************************************
    Models/Collections
******************************************/
var MenuModel = Backbone.Model.extend({
  idAttribute: 'objectId',
  // url: 'https://api.parse.com/1/r360',
  defaults: {
    itemName: '',
    itemDesc: '',
    hasOrderExtra: 'false',
    itemPrice: '',
    itemtype: '',
    itemAllergens: ''
  },

});

var MenuCollection = Backbone.Collection.extend({
  url: "https://api.parse.com/1/classes/r360",
  parse: function(response){
    response.results;
  },
initialize: function() {
  this.fetch().done(function(data) {
    window.App.menuData = data.results;
    results = data.results;
    console.log("Got the data! It's here:");
    console.log(data);
    _.each(data.results, function(item, index){
      if(item.itemtype === 'appetizer'){
        console.log('name is ' + item.itemName);
        var itemName = item.itemName;
        var itemPrice = item.itemPrice;
        var itemDesc = item.itemDesc;
        templateAppetizers = templateAppetizers + {
          itemName: itemName,
          itemPrice: itemPrice,
          itemDesc: itemDesc
        }

      }else{
        return;
      }
      });
    });
}

  });


var Session = Backbone.Model.extend({
  defaults: {
    token: ''
  },
  isLoggedIn: function(){
    return !!this.get('token');
  },
  initialize: function(){
    this.listenTo(this, 'change:token', this.setHeader);
    this.listenTo(App.vent, 'logout', this.logout);
  },
  login: function(email, password){
    var self = this;
    return $.ajax({
      url: "https://api.parse.com/1/login",
      data: {
        username: email,
        password: password
      }
    }).then(function(data){
      var userData = _.omit(data, 'sessionToken');
      self.set('currentUser', new User(userData));
      self.set('token', data.sessionToken);
      return data;
    }, function(jqXHR, textStatus, errorThrown){
      alert(jqXHR.responseJSON.error);
      return jqXHR;
    });
  },
  setHeader: function(){
  var token = this.get('token');
  $.ajaxSetup({
    headers: {
      "X-Parse-Session-Token": token
    }
  });
  },
  logout: function(){
    this.set('token', '');
  }
});

/*****************************************
    Views
******************************************/
var IndexView = Backbone.View.extend({
  initialize: function(){
    console.log('first indexView fired');
    this.appetizersView = new AppetizersView({collection: this.collection});
    this.entreesView = new EntreesView({collection: this.collection});
    this.saladsView = new SaladsView({collection: this.collection});
    this.sidesView = new SidesView({collection: this.collection});
    this.kidsView = new KidsView({collection: this.collection});

    this.customerOrderView = new CustomerOrderView({collection: this.collection});

    this.appetizersView.render();

  },
  render: function(){
    $('.js-appetizers').css('visibility', 'visible');
    $('.js-customer-order-wrap').css('visibility', 'visible');
    $('.js-cook-order-wrap').css('visibility', 'hidden');
    $('.js-entrees', '.js-salads', '.js-sides',
      '.js-kids').css('visibility', 'hidden');

    this.appetizersView.render();
    $('.js-appetizers-div').append(this.appetizersView.el)

    this.customerOrderView.render();
    $('.js-customer-order-ul').append(this.customerOrderView.el);

  }

});

var AppetizersView = Backbone.View.extend({
  tagName: 'ul',

  initialize: function(){
    // this.listenTo(this.collection, 'sync', this.render);

    var menu = new MenuCollection();
    this.$el.empty();
    var self = this;

    menu.fetch().done(function(data) {

      _.each(data.results, function(item){
        if( item.itemtype === 'appetizer'){
        console.log('the appetizer name is ' + item.itemName);
        console.log('itemPrice ' + item.itemPrice);
        var appetizerItemView = new AppetizerItemView();
        var templateObject = {itemName: 'wings'};

        // {itemName: item.itemName,
        //   itemPrice: item.itemPrice,
        //   itemDesc: item.itemDesc};

        appetizerItemView.render((templateObject));

        self.$el.append(self.$el);
        }else {
        return;
        }
      });
    });

  },
  events: {
    "click .js-appetizers-tab": "tabOn",
  },
  tabOn: function(){
        $('.js-appetizer-tab').css({
      'border-top': '3px solid $tab-on-border-color',
      'border-right': '3px solid $tab-on-border-color',
      'border-left': '3px solid $tab-on-border-color',
      'background-color': '$tab-on-background-color'
    });
    $('.js-entrees-tab, .js-salads-tab, .js-sides-tab, .js-desserts-tab, .js-kids-tab').css({
      'border-top': '3px solid #06fffa',
      'border-right': '3px solid $tab-off-border-color',
      'border-left': '3px solid $tab-off-border-color',
      'border-bottom': '3px solid teal',
      'background-color': '$tab-off-background-color'
    });
  },
  render: function(){

    // this.$el.empty();
    this.$el.html(this.template(templateObject));


    $('.js-appetizer-tab').css({
      'border-top': '3px solid $tab-on-border-color',
      'border-right': '3px solid $tab-on-border-color',
      'border-left': '3px solid $tab-on-border-color',
      'background-color': '$tab-on-background-color'
    });
    $('.js-entrees-tab, .js-salads-tab, .js-sides-tab, .js-desserts-tab, .js-kids-tab').css({
      'border-top': '3px solid #06fffa',
      'border-right': '3px solid $tab-off-border-color',
      'border-left': '3px solid $tab-off-border-color',
      'border-bottom': '3px solid teal',
      'background-color': '$tab-off-background-color'
    });
  }
});

var EntreesView = Backbone.View.extend({
  tagName: 'ul'
});

var SaladsView = Backbone.View.extend({
  tagName: 'ul'
});

var SidesView = Backbone.View.extend({
  tagName: 'ul'
});

var KidsView = Backbone.View.extend({
  tagName: 'ul'
});

var AppetizerItemView = Backbone.View.extend({
  tagName: 'li',
  template:  _.template( $(".menu-item-template").text() ),
  render: function(){
    this.$el.html(this.template({itemName: "Wings", itemPrice: 8, itemDesc: "Great wings"}));
    return this;
  }
});

var CustomerOrderView = Backbone.View.extend({
  el: 'ul',
  template: _.template( $('#customer-order-template').text() )
  // render: function(){
  //   this.$el.append(this.template());
  //   console.log('customer order view just fired');

  //   return this;
  // }
});

var CustomerOrderListView = Backbone.View.extend({
  //el: 'li',
});

var CookOrderView = Backbone.View.extend({
  template: _.template( $('#cook-order-template').text() ),
  render: function(){
    this.$el.append(template());
    console.log('cook order view just fired');
  }
});

/*****************************************
    Router
******************************************/
var AppRouter = Backbone.Router.extend({
  routes: {
    "": 'index',
    "cookOrder": "cookOrder",
    "admin": "admin"
  },
  initialize: function(){
    this.menu = new MenuCollection({model: MenuModel});
    // this.indexView = new IndexView({
    //   collection: this.menu});

  },
  index: function(){
    this.menu.fetch();
    this.currentView = new IndexView({collection: MenuCollection});
    this.currentView.render();


    var customerOrderView = new CustomerOrderView();
    customerOrderView.render({el: '.js-customer-order-ul'});
    //$('.js-menu-ul').html???




},
  cookOrder: function(){
    var template = _.template( $('#cook-order-template').text() );
    $('.js-cook-order-ul').append(template());
    $('.js-menu-wrap').css('visibility', 'hidden');
      $('.js-customer-order-wrap').css('visibility', 'hidden');
      $('.js-cook-order-wrap').css('visibility', 'visible');

  },
  admin: function(){


  }
});

$.ajaxSetup({
  headers: {
    "X-Parse-Application-Id": "Cg7ixMBSyHJ7SsGTqXxUkE27s6PwNevbovd1RaG1",
    "X-Parse-REST-API-Key": "JzKJm6qSleHdYUXIiAMetmC6ruZYHoqsiHrm4Z8y"
  }
});

/*********************************************
  Glue Code
  *******************************************/
$(document).ready(function(){
  // console.log('ready');
  window.router = new AppRouter();
  Backbone.history.start();

  });
})();
