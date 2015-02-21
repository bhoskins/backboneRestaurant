(function(){
  'use strict';

  window.App = window.App || {};

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
  }

});

var MenuCollection = Backbone.Collection.extend({
  url: "https://api.parse.com/1/classes/r360",
  parse: function(response){
    response.results;
  },
  initialize: function(){
    var data = this.fetch();
    console.log("menucollection: " + data )
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
var MenuView = Backbone.View.extend({
  initialize: function(){
    // this.menuView = new MenuView({collection: this.collection});

  },
  template: _.template( $('#menu-template').text() ),
  render: function(){
    this.$el.append(this.template());
     console.log('menu view just fired');
    return this;
  }
});

var CustomerOrderView = Backbone.View.extend({
  template: _.template( $('#customer-order-template').text() ),
  render: function(){
    this.$el.append(this.template());
    console.log('customer order view just fired');


    return this;
  }
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
    "customerOrder": "customerOrder",
    "cookOrder": "cookOrder",
    "admin": "admin"
  },
  initialize: function(){
    var menuCollection = new MenuCollection({model: MenuModel});
    var data = menuCollection.fetch();
    // _.each(data, function(item, index){
    //   console.log(item + " " + index);
    // });

    console.log("the item is: " + data );

  },
  index: function(){
    this.currentView = new MenuView();
    this.currentView.render({el: '.js-menu-ul'});
    var customerOrderView = new CustomerOrderView();
    customerOrderView.render({el: '.js-customer-order-ul'});
    //$('.js-menu-ul').html???
    $('.js-menu-wrap').css('visibility', 'visible');
    $('.js-customer-order-wrap').css('visibility', 'visible');
    $('.js-cook-order-wrap').css('visibility', 'hidden');



},
  customerOrder: function(){
    // var template = _.template( $('#customer-order-template').text() );
    // $('.js-customer-order-ul').append(template());
    $('.js-menu-wrap').css('visibility', 'visible');
      $('.js-customer-order-wrap').css('visibility', 'visible');
      $('.js-cook-order-wrap').css('visibility', 'hidden');
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
