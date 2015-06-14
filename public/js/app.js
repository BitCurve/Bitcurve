var app = angular.module('bitcurve', ['ui.router']);

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
    templateUrl: "./templates/whatIsBitcoinTmpl.html",
    controller: "whatIsBitcoinCtrl"
  })
  // USER ART
  .state('userArt', {
    url: "/userArt",
    templateUrl: "./templates/userArtTmpl.html",
    controller: "userArtCtrl"
  })
  .state('dashboard', {
    url: "/dashboard",
    templateUrl: "./templates/dashboard.html",
    controller: "dashBoardCtrl"
  })
  .state('dashboard2', {
    url: "/dashboard2",
    templateUrl: "./dashboard2.html",
    controller: "dashBoardCtrl"
  })
  .state('whitney', {
    url: "/whitney",
    templateUrl: "./templates/whitney.html",
    controller: "whitneyCtrl"
  })

  // LOGIN
  // .state('login', {
  //   url: "/login",
  //   templateUrl: "../templates/loginTmpl.html",
  //   controller: "loginCtrl"
  // })

}); // End app.config
