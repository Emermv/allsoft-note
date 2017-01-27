var app=angular.module("noteApp",
  [
  'ngRoute',
  'ngProgress',
  'firebase',
  'noteApp.services',
  'noteApp.directives',
  'controllers.noteController',
  'controllers.homeController',
  'controllers.profileController',
  'controllers.settupController',
  'colorpicker.module',
  'toastr'
  ]);
app.config(function($routeProvider){
 $routeProvider
   .when("/",{controller:"homeController",templateUrl:"view/main/home.html"})
   .when("/home/All-notes",{controller:"homeController",templateUrl:"view/main/home.html"})
   .when("/home/texts",{controller:"home.textsController",templateUrl:"view/main/home/texts.html"})
   .when("/home/texts/:id",{controller:"home.texts.detailController",templateUrl:"view/main/home/text-detail.html"})
   .when("/home/links",{controller:"home.linksController",templateUrl:"view/main/home/links.html"})
   .when("/home/links/:id",{controller:"home.links.detailController",templateUrl:"view/main/home/link-detail.html"})
   .when("/home/files",{controller:"home.filesController",templateUrl:"view/main/home/files.html"})
   .when("/home/files/:id",{controller:"home.files.detailController",templateUrl:"view/main/home/file-detail.html"})
   .when("/note",{controller:"textController",templateUrl:"view/main/note.html"})
   .when("/note/text",{controller:"textController",templateUrl:"view/main/note.html"})
   .when("/note/link",{controller:"linkController",templateUrl:"view/main/note/link.html"})
   .when("/note/file",{controller:"fileController",templateUrl:"view/main/note/file.html"})
   .when("/note/audio",{controller:"audioController",templateUrl:"view/main/note/audio.html"})
   .when("/note/picture",{controller:"pictureController",templateUrl:"view/main/note/picture.html"})
   .when("/profile",{controller:"profileController",templateUrl:"view/main/profile.html"})
   .when("/profile/settup",{controller:"profile.settupController",templateUrl:"view/main/profile/settup.html"})
   .when("/profile/edit",{controller:"profile.editController",templateUrl:"view/main/profile/edit.html"})
   .when("/settup",{controller:"settup.generalController",templateUrl:"view/main/settup.html"})
   .when("/settup/general",{controller:"settup.generalController",templateUrl:"view/main/settup.html"})
   .when("/settup/navbar",{controller:"settup.navbarController",templateUrl:"view/main/settup/navbar.html"})
   .when("/settup/footer",{controller:"settup.footerController",templateUrl:"view/main/settup/footer.html"})
   .when("/settup/sidenav",{controller:"settup.sidenavController",templateUrl:"view/main/settup/sidenav.html"})
   .when("/refresh",{controller:"refreshController",templateUrl:"view/main/home.html"})
   .when("/exit",{controller:"exitController",templateUrl:"view/main/home.html"})
   .otherwise({controller:"homeController",templateUrl:"view/main/home.html"});

});

app.controller("refreshController",function(){
$(location).attr("href","./");
});

app.controller("exitController",function(){
  localStorage.clear();
$(location).attr("href","../");
});
app.controller("navbarController",['$scope','$firebaseObject','fireService',function($scope,$firebaseObject,fireService){
 var database=fireService.getInstance.database();
 $scope.settup=$firebaseObject(database.ref("Settup").child("ui").child("navbar"));
}]);

app.controller("footerController",['$scope','$firebaseObject','fireService',function($scope,$firebaseObject,fireService){
 var database=fireService.getInstance.database();
 $scope.settup=$firebaseObject(database.ref("Settup").child("ui").child("footer"));
}]);
app.controller("sidenavController",['$scope','$firebaseObject','fireService','userProfile','$location',
  function($scope,$firebaseObject,fireService,userProfile,$location){
    $scope.titulo="Allsoft Note";
userProfile.get(function(user){
  $scope.user=user;
});
 var database=fireService.getInstance.database();
 $scope.settupside=$firebaseObject(database.ref("Settup").child("ui").child("sidenav"));
}]);


