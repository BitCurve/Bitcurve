var app = angular.module('bitcurve', ['ui.router', 'price.directives', 'dif.directives', 'circulation.directives', 'fees.directives', 'miners.directives', 'toaster']);

app.run(function($state, $rootScope){
  $rootScope.$state = $state;
});

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){
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
