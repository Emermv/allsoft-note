angular.module("controllers.profileController",[])
.controller("profileController",['$scope','userProfile','fireService','$firebaseObject',
  function($scope,userProfile,fireService,$firebaseObject){
     $scope.hidepassword="";
  userProfile.get(function(response){

      $scope.user=response;

for(var i=0;i<$scope.user.password.length;i++){
  $scope.hidepassword+="*";
}
  });
$scope.settup={};
var database=fireService.getInstance.database();
var settupProfile=$firebaseObject(database.ref("Settup").child("user").child("profile"));
settupProfile.$bindTo($scope,"settup");

}])
.controller("profile.settupController",
	['$scope','$location','toastService','ngProgressFactory','settupProfile','fireService','$firebaseObject',
	function($scope,$location,toastService,ngProgressFactory,settupProfile,fireService,$firebaseObject){
	settupProfile.get(function(data){
    $scope.settup=data;
  });
  var database=fireService.getInstance.database();
  var progressbar=ngProgressFactory.createInstance();
   progressbar.setColor("#ef5350");  
   progressbar.setHeight("3px");  
	$scope.change=function(){
    progressbar.start();
    var savesettup=$firebaseObject(database.ref("Settup/user"));
     savesettup.profile=$scope.settup;
     savesettup.$save().then(function(response){
        toastService.fullBottom();
        toastService.setTime(2000);
        toastService.info("Los cambios se aplicaron correctamente!");
        setTimeout(function(){progressbar.complete();$location.url("profile");},2000);
     },function(error){
      toastService.fullBottom();
      toastService.setTime(2000);
      toastService.error("Hubo un error al intentar realizar los cambios :"+error,"Sin conexion a internet");
      console.error(error);
       setTimeout(function(){progressbar.complete();$location.url("profile");},2000);
     });
    
	}
	$scope.cancel=function(){
     $location.url("profile");
	}

}])
.controller("profile.editController",
	['$scope','$location','fileService','toastService','ngProgressFactory','$firebaseObject','fireService','userProfile',
	function($scope,$location,fileService,toastService,ngProgressFactory,$firebaseObject,fireService,userProfile){
	var file=$("#profile").fileinput({showUpload:false,maxFileSize:25600,minFileCount:1,showPreview:false});
  var birthdate=$("#birthdate").datepicker({
    format: "dd-mm-yyyy",
    todayBtn: false,
    clearBtn: true,
    autoclose: true
  });
  var database=fireService.getInstance.database();
  var progressbar = ngProgressFactory.createInstance();   
      progressbar.setColor("#ef5350");  
      progressbar.setHeight("3px");  
  var save;
  userProfile.get(function(response){
    $scope.user=response;
  });

   file.on('fileloaded', function(event, file, previewId, index, reader) {
     $scope.file=file;
     $scope.selected=true;
     });

	file.on('fileclear', function(event) {
     $scope.selected=false;
      $scope.file=null;
      });

   $scope.errors={
      name:false,
      lastname:false,
      birthdate:false,
      gender:false,
      email:false,
      username:false,
      password:false
   };

	$scope.cancel=function(){
		$location.url("profile");
	}
$scope.saveUser=function(){
        progressbar.start();
       $scope.status=false;
       if($scope.validUser($scope.user)){
           if(fileService.check()){
            
     if($scope.selected){
         if($scope.file.type==="image/png" || $scope.file.type==="image/jpeg" || $scope.file.type==="image/jpg"){
           fileService.toBase64($scope.file,function(response){
         $scope.user.profile=response;
          database.ref("Users/"+$scope.user.id_user).set($scope.user).then(function(){
                      $scope.saveuser=true;
                      $scope.successmessage="Tus datos fueron modificados satisfactoriamente !";
                       setTimeout(function(){progressbar.complete();},1000);
          },function(err){
            $scope.status=true;
             $scope.error="No es posible modificar tus datos debido a problemas de conexion! :(";
            console.error(err);
             setTimeout(function(){progressbar.complete();},1000);
          });
         setTimeout(function(){progressbar.complete();},1000);
      });
          }else{
             $scope.status=true;
             setTimeout(function(){progressbar.complete();},1000);
             $scope.error="El formato del archivo seleccionado no es valido, asegurate de que sea una imagen!";
          }
     }else{
      toastService.warning("Seleccione una foto para tu perfil !");
      setTimeout(function(){progressbar.complete();},1000);
     }
   }else{
    toastService.fullTop();
    toastService.setTime(2000);
    toastService.error("Lo sentimos, este navegador no soporta las caracteristicas de la api FileReader intentelo con otro!");
    setTimeout(function(){progressbar.complete();},1000);
   }
       }else{
        toastService.warning("Complete los campos necesarios !");
         setTimeout(function(){progressbar.complete();},1000);
       }
 	  
   
}

  $scope.validUser=function(user){
    var valid=false;
        if(user.name===undefined || user.name===null ||user.name===""){
           $scope.errors.name=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.name=false;
        }
          if(user.lastname===undefined || user.lastname===null || user.lastname===""){
           $scope.errors.lastname=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.lastname=false;
        }
        
       if(user.birthdate===undefined || user.birthdate===null || user.birthdate===""){
           $scope.errors.birthdate=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.birthdate=false;
        }
        if(user.gender===undefined || user.gender===null || user.gender===""){
           $scope.errors.gender=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.gender=false;
        }
        if(user.email===undefined || user.email===null || user.email===""){
           $scope.errors.email=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.email=false;
        }

        if(user.username===undefined || user.username===null || user.username===""){
           $scope.errors.username=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.username=false;
        }
         if(user.password===undefined || user.password===null || user.password===""){
           $scope.errors.password=true;
           valid=false;
        }else{
          valid=true;
          $scope.errors.password=false;
        }
       return valid;
  }

  $scope.quitError=function(){
    $scope.errors={};
  }

}]);