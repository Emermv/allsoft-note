'use trict';
angular.module('controllers.settupController',[])

.controller("settup.generalController",
	['$scope','fireService','toastService',
	function($scope,fireService,toastService){
    var database=fireService.getInstance.database();
  var dialog = document.querySelector('dialog');
   if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
$scope.errors={
  name:false,
  color:false
};
$scope.category={};
$scope.addCategory=function(){
  dialog.showModal();
}
$scope.closeModal=function(){
  dialog.close();
}
  
$scope.saveCategory=function(category){
  if($scope.validCategory(category)){
    var key=database.ref("Note/categories").push().key;
    category.id_cat=key;
    database.ref("Note/categories/"+key).set(category).then(function(){
           $scope.success=true;
           setTimeout(function(){dialog.close();},2000);
    },function(err){
       console.error(err);
       dialog.close();
    });
  }
}

$scope.validCategory=function(category){
  var valid=false;
  if(category.name===undefined || category.name===null || category.name===""){
     valid=false;
     $scope.errors.name=true;
  }else{
    valid=true;
    $scope.errors.name=false;
  }
  if(category.color===undefined || category.color===null || category.color===""){
     valid=false;
     $scope.errors.color=true;
  }else{
    valid=true;
    $scope.errors.color=false;
  }
  return valid;

}

database.ref("Note").child("categories").on("value",function(snap){
    $scope.categories=snap.val();
});
$scope.delete=function(){
database.ref("Note").child("categories").child($scope.deletecategory).remove().then(function(){
  toastService.defaultPosition();
  toastService.info("Eliminado correctamente !");
});
}

}])
.controller("settup.navbarController",
	['$scope','fireService','settupService','ngProgressFactory','toastService',
	function($scope,fireService,settupService,ngProgressFactory,toastService){
	$scope.settup={};
	var database=fireService.getInstance.database();
	  settupService.get("navbar",function(data){
       $scope.settup=data;
	});
   var progressbar=ngProgressFactory.createInstance();
   progressbar.setColor("#ef5350");  
   progressbar.setHeight("3px");  
  
   $scope.save=function(){
   	progressbar.start();
   database.ref("Settup").child("ui").child("navbar").set($scope.settup).then(function(){
   	toastService.setTime(2000);
   	toastService.defaultPosition();
   	toastService.success("Los cambios se aplicaron correctamente !");
   	setTimeout(function(){progressbar.complete();},2000);
   },function(err){
   console.error(err);
   toastService.setTime(2000);
   	toastService.defaultPosition();
   	toastService.error("Error, no se pudo aplicar los cambios !","Sin conexion");
   	setTimeout(function(){progressbar.complete();},2000);
   });

   }
   $scope.cancel=function(){
    $scope.settup={
                navbarbackgroundcolor:"#3949ab",
                navbariconscolor: "#ffffff",
                navbartextcolor: "#ffffff"
    };
  $scope.save();
   	
   }
}]) 
.controller("settup.footerController",
	['$scope','fireService','settupService','ngProgressFactory','toastService',
	function($scope,fireService,settupService,ngProgressFactory,toastService){
	$scope.settup={};
	var database=fireService.getInstance.database();
	  settupService.get("footer",function(data){
       $scope.settup=data;
	});
   var progressbar=ngProgressFactory.createInstance();
   progressbar.setColor("#ef5350");  
   progressbar.setHeight("3px");  
  
   $scope.save=function(){
   	progressbar.start();
   database.ref("Settup").child("ui").child("footer").set($scope.settup).then(function(){
   	toastService.setTime(2000);
   	toastService.defaultPosition();
   	toastService.success("Los cambios se aplicaron correctamente !");
   	setTimeout(function(){progressbar.complete();},2000);
   },function(err){
   console.error(err);
   toastService.setTime(2000);
   	toastService.defaultPosition();
   	toastService.error("Error, no se pudo aplicar los cambios !","Sin conexion");
   	setTimeout(function(){progressbar.complete();},2000);
   });

   }
   $scope.cancel=function(){
   	$scope.settup={
 footerbackgroundcolor: "#424242",
 footericonscolor: "rgba(42,134,133,1)",
 footertextcolor: "rgba(32,32,161,1)"
    };
    $scope.save();
   }
}])
.controller("settup.sidenavController",
	['$scope','fireService','settupService','ngProgressFactory','toastService',
	function($scope,fireService,settupService,ngProgressFactory,toastService){
	$scope.settup={};
	var database=fireService.getInstance.database();
	  settupService.get("sidenav",function(data){
       $scope.settup=data;
	});
   var progressbar=ngProgressFactory.createInstance();
   progressbar.setColor("#ef5350");  
   progressbar.setHeight("3px");  
  
   $scope.save=function(){
   	progressbar.start();
   database.ref("Settup").child("ui").child("sidenav").set($scope.settup).then(function(){
   	toastService.setTime(2000);
   	toastService.defaultPosition();
   	toastService.success("Los cambios se aplicaron correctamente !");
   	setTimeout(function(){progressbar.complete();},2000);
   },function(err){
   console.error(err);
   toastService.setTime(2000);
   	toastService.defaultPosition();
   	toastService.error("Error, no se pudo aplicar los cambios !","Sin conexion");
   	setTimeout(function(){progressbar.complete();},2000);
   });

   }
   $scope.cancel=function(){
   	$scope.settup={
      sidenavbackgroundcolor:'#fafafa',
      sidenavtitlecolor:'#000000',
      sidenavuserinfocolor:'#000000',
      sidenavuseremailcolor:'#0d47a1',
      sidenavemailbackgroundcolor:'white',
      sidenavprofilebackgroundcolor:'#eeeeee',
      sidenaviconhomecolor:'#2196f3',
      sidenaviconnotecolor:'#ffff00',
      sidenaviconprofilecolor:'#00e676',
      sidenaviconsettupcolor:'#000000'
   	};
   $scope.save();
   }
}])