var app = angular.module('bitcurve', ['ui.router', 'price.directives', 'dif.directives', 'circulation.directives', 'fees.directives', 'miners.directives']);

app.run(function($state, $rootScope){
  $rootScope.$state = $state;
});

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider
  .otherwise("/");

// ROUTERS
  $stateProvider
  // HOMEPAGE
  .state('home', {
    url: '/',
    templateUrl: "./templates/homeTmpl.html",
    controller: "homeCtrl"
  })
  // ABOUT BITCURVE
  .state('about', {
    url: "/about",
    templateUrl: "./templates/aboutTmpl.html",
    controller: "aboutCtrl"
  })
  // WHAT IS BITCOIN
  .state('whatIsBitcoin', {
    url: "/whatIsBitcoin",
    templateUrl: "./templates/whatIsBitcoin.html",
    controller: "whatIsBitcoinCtrl"
  })
  // ART DASHBOARD
  .state('artDashboard', {
    url: "/art-dashboard",
    templateUrl: "./templates/artDashboardTmpl.html",
    controller: "artDashboardCtrl"
  })
    // ART DASHBOARD CHILDREN
    .state('artDashboard.miners', {
      url: "/miners",
      templateUrl: "./templates/miners.html",
      controller: "artDashboardCtrl",
      parent: 'artDashboard'
    })
    .state('artDashboard.dif', {
      url: "/difficulty",
      templateUrl: "./templates/dif.html",
      controller: "artDashboardCtrl",
      parent: 'artDashboard'
    })
    .state('artDashboard.price', {
      url: "/price",
      templateUrl: "./templates/price.html",
      controller: "artDashboardCtrl",
      parent: 'artDashboard'
    })
    .state('artDashboard.circulation', {
      url: "/circulation",
      templateUrl: "./templates/circulation.html",
      controller: "artDashboardCtrl",
      parent: 'artDashboard'
    })
    .state('artDashboard.fees', {
      url: "/fees",
      templateUrl: "./templates/fees.html",
      controller: "artDashboardCtrl",
      parent: 'artDashboard'
    })
  // ANALYTICS DASHBOARD
  .state('analyticsDashboard', {
    url: "/analyticsDashboard",
    templateUrl: "./WhatIsBitcurve/whatIsBitcoin.html",
    controller: "analyticsDashboardCtrl"
  })
    //LOGIN
    .state('login', {
      url: "/login",
      templateUrl: "../templates/loginTmpl.html",
      controller: "loginCtrl"
    })
    //REGISTER
    .state('register', {
      url: "/register",
      templateUrl: "../templates/createAccountTmpl.html",
      controller: "createAccountCtrl"
    })


}); // End app.config
