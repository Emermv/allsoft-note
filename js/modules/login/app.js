var app=angular.module("noteApp",['ngRoute','noteApp.services','ngProgress','toastr']);
app.config(function($routeProvider){
 $routeProvider
   .when("/",{controller:"loginController",templateUrl:"app/view/login/login.html"})
   .when("/log-In",{controller:"loginController",templateUrl:"app/view/login/login.html"})
   .when("/Sign-Up",{controller:"signUpController",templateUrl:"app/view/login/signUp.html"})
   .when("/loading",{controller:"loadingController",templateUrl:"app/view/login/loading.html"})
   .when("/Sign-Up-profile",{controller:"signUpNextProfileController",templateUrl:"app/view/login/signupNextProfile.html"})
   .when("/Sign-Up-next",{controller:"signUpNextController",templateUrl:"app/view/login/signupNext.html"})
   .when("/help",{templateUrl:"app/view/login/loading.html"})
   .otherwise({controller:"loginController",templateUrl:"app/view/login/login.html"});

});

app.factory("signupService",function(){
return {
   status:0,
   user:{}
};

});


app.controller("loginController",
	['$scope','fireService','ngProgressFactory','base64',function($scope,fireService,ngProgressFactory,base64){
	$scope.progressbar = ngProgressFactory.createInstance();   
    $scope.progressbar.setColor("#ef5350");  
    $scope.progressbar.setHeight("3px");   
	$scope.userok=false;
	$scope.passwordok=false;
	$scope.userstatus=false;
	$scope.passwordstatus=false;
	$scope.userms="";
	$scope.btnlogin=$("#btnlogin");
	$scope.passwordms="";
	var database=fireService.getInstance.database();
$scope.iniciarSesion=function(){
   	$scope.userstatus=false;
	$scope.passwordstatus=false;
	$scope.progressbar.start();
	$scope.btnlogin.button('loading');
	$scope.userok=false;
	$scope.passwordok=false;
    if($scope.username==undefined || $scope.username==""){
           $scope.userstatus=true;
           $scope.userms="Ingrese un usuario!";
    }
    if($scope.password==undefined || $scope.password=="" ){
       $scope.passwordstatus=true;
       $scope.passwordms="Ingrese tu contraseña!";
    }

    if($scope.userstatus==false && $scope.passwordstatus==false){

      database.ref("/Users").once("value").then(function(data){
	$scope.user=data.val();

   for(var i in $scope.user){
     if($scope.username==$scope.user[i].username){
       $scope.userok=true;
       if($scope.password===$scope.user[i].password){
     	$scope.passwordok=true;
     	break;
     }
     }
     
   }
   if(!$scope.userok){
      $scope.userms="El usuario "+$scope.username+" no existe!";
      $scope.userstatus=true;
   }
   if(!$scope.passwordok){
   	$scope.passwordms="La contraseña es incorrecta!";
   	$scope.passwordstatus=true;
   }
  setTimeout(function(){
     $scope.btnlogin.button('reset');
  },1000);
     $scope.progressbar.complete();
   if($scope.userok==true && $scope.passwordok==true){
   	 localStorage.setItem("dXNlcl9jcmVkZW50aWFscw",JSON.stringify($scope.user));
     $(location).attr("href","app/#/");

   }
  
});// end firebase

    }//end if
    else{
    	 setTimeout(function(){
    	 	$scope.btnlogin.button('reset');
     $scope.progressbar.complete();
  },500);
    	
    }

   
}
$scope.quitError=function(){
   	$scope.passwordstatus=false;
      $scope.userstatus=false;
}

}]);
app.controller("signUpController",
	['$scope','$location','signupService','ngProgressFactory',
	function($scope,$location,signupService,ngProgressFactory){
 $scope.progressbar = ngProgressFactory.createInstance();   
	  $scope.progressbar.setColor("#ef5350");  
	  $scope.progressbar.setHeight("3px");   

$('#birthdate').datepicker({
	 format: "dd-mm-yyyy",
    todayBtn: true,
    clearBtn: true,
    autoclose: true
});
$scope.getFecha=function(){
	$scope.birthdate=$("#birthdate").val();
}
$scope.error="";
$scope.status=false;

$scope.next=function(){
	$scope.progressbar.start();
	$scope.getFecha();
if($scope.validar($scope.name)){
  $scope.status=false;
}else{
$scope.error="Ingrese tu nombre!";
$scope.status=true;
$scope.focusname="has-error";
}
if($scope.validar($scope.lastname)){
    $scope.status=false;
}else{
$scope.error="Ingrese tus apellidos!";
$scope.status=true;
$scope.focuslastname="has-error";
}
if($scope.validar($scope.birthdate)){
	$scope.status=false;
}else{
$scope.error="Seleccione tu fecha de nacimiento!";
$scope.status=true;
$scope.focusbirthdate="has-error";
}

if($scope.validar($scope.gender)){
	$scope.status=false;
}else{
$scope.error="Seleccione tu genero!";
$scope.status=true;
$scope.focusgender="has-error";
}

if(!$scope.status){
	
	 signupService.user.name=$scope.name;
	 signupService.user.lastname=$scope.lastname;
	  signupService.user.birthdate=$scope.birthdate;
	   signupService.user.gender=$scope.gender;
	   signupService.status=1;
	  $location.url("Sign-Up-profile");
}
 setTimeout(function(){
   $scope.progressbar.complete();
 },100);
}
$scope.quitError=function(f){
$scope.status=false;
$scope.focusname="";
$scope.focuslastname="";
$scope.focusbirthdate="";
$scope.focusgender="";
$scope.error="";
}

$scope.validar=function(text){
	if(text=="" || text==undefined || text==null){
		return false;
	}
	return true;
}

}]);

app.controller("signUpNextController",
	['$scope','signupService','fireService','ngProgressFactory','$location','toastService',
	function($scope,signupService,fireService,ngProgressFactory,$location,toastService){
    if(signupService.status!==1){
      $location.url("Sign-Up");
     }

$scope.progressbar = ngProgressFactory.createInstance();   
$scope.progressbar.setColor("#ef5350");  
$scope.progressbar.setHeight("3px");   
$scope.status=false;
$scope.registrado=false;
$scope.message="";
$scope.error="";

$scope.registrar=function(){
	$scope.progressbar.start();
    $scope.registrado=false;
if($scope.validar($scope.email)){
$scope.status=false;
}else{
	$scope.status=true;
	$scope.error="Ingrese tu email!";
	$scope.focusemail="has-error";
}
if($scope.validar($scope.username)){
$scope.status=false;
}else{
	$scope.status=true;
	$scope.error="Ingrese un usuario";
	$scope.focususer="has-error";
}
if($scope.validar($scope.password)){
$scope.status=false;
}else{
	$scope.status=true;
	$scope.error="Ingrese una contraseña!";
	$scope.focuspassword="has-error";
}
if($scope.validar($scope.password2)){
$scope.status=false;
}else{
	$scope.status=true;
	$scope.error="Ingrese otra vez la contraseña!";
	$scope.focuspassword2="has-error";
}

if($scope.password===$scope.password2){
$scope.status=false;
}else{
	$scope.status=true;
	$scope.error="Las contraseñas no coinciden!";
	$scope.focuspassword="has-error";
	$scope.focuspassword2="has-error";
}
if($scope.status==false && signupService.status==1){
	$scope.user=signupService.user;
	$scope.user.email=$scope.email;
	$scope.user.username=$scope.username;
	$scope.user.password=$scope.password;
    var database=fireService.getInstance.database();
   var key=database.ref("Users/").push().key;
   $scope.user.id_user=key;
    database.ref("Users/"+key).set($scope.user).then(function(){
           $scope.registrado=true;
           $scope.message="Registrado correctamente !";
           setTimeout(function(){$scope.progressbar.complete();},1000);
    },function(error){
      console.error(error);
      toastService.fullTop();
      toastService.setTime(2000);
      toastService.error("Ocurrio un error al intentar registrarte !","Sin conexion a internet:");
      setTimeout(function(){$scope.progressbar.complete();},2000);
    });
}
}

$scope.quitError=function(){
$scope.status=false;
$scope.focusemail="";
$scope.focususer="";
$scope.focuspassword="";
$scope.focuspassword2="";
$scope.error="";
}

$scope.validar=function(text){
	if(text=="" || text==undefined || text==null){
		return false;
	}
	return true;
}
}]);

app.controller("signUpNextProfileController",
['$scope','$location','fileService','signupService','toastService','ngProgressFactory',
function($scope,$location,fileService,signupService,toastService,ngProgressFactory){
  if(signupService.status!==1){
      $location.url("Sign-Up");
     }
	$scope.status=false;
	$scope.error="";
	 $scope.progressbar = ngProgressFactory.createInstance();   
	  $scope.progressbar.setColor("#ef5350");  
	  $scope.progressbar.setHeight("3px");   
 var file=$("#file").fileinput({showUpload:false,maxFileSize:25600,minFileCount:1});
 file.on('fileloaded', function(event, file, previewId, index, reader) {
     $scope.file=file;
     $scope.selected=true;
     $scope.status=false;
     });

	file.on('fileclear', function(event) {
     $scope.selected=false;
      $scope.file=null;
      $scope.status=false;
      });

$scope.prev=function(){
	signupService.status=0;
	$location.url("Sign-Up");
}
 $scope.next=function(){
 	  $scope.progressbar.start();
       $scope.status=false;
 	   if(fileService.check()){
     if($scope.selected){
         if($scope.file.type==="image/png" || $scope.file.type==="image/jpg" || $scope.file.type==="image/jpeg"){
         	 fileService.toBase64($scope.file,function(response){
      	signupService.user.profile=response;
      	signupService.status=1;
          $scope.progressbar.complete();
        $location.url("Sign-Up-next");
      });
         	}else{
             $scope.status=true;
             $scope.error="El formato del archivo seleccionado no es valido, asegurate de que sea una imagen!";
         	}
     }else{
     	$scope.progressbar.complete();
     }
   }else{
   	toastService.fullTop();
   	toastService.setTime(2000);
    toastService.error("Lo sentimos, este navegador no soporta las caracteristicas de la api FileReader intentelo con otro!");
   }
   
 }

}]);

app.controller("loadingController",['$scope',function($scope){

}]);