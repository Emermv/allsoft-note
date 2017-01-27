angular.module("controllers.homeController",[])
.controller("homeController",['$scope','fireService','toastService','$firebaseArray','historyService',
	function($scope,fireService,toastService,$firebaseArray,historyService){
var database=fireService.getInstance.database();
$scope.texts=$firebaseArray(database.ref("Note/text"));
$scope.links=$firebaseArray(database.ref("Note/link"));
$scope.files=$firebaseArray(database.ref("Note/file"));
$scope.changeHistory=function(e){
	historyService.href="#/home/All-notes";
}
}])
.controller("home.textsController",['$scope','fireService','toastService','$firebaseArray','historyService',
	function($scope,fireService,toastService,$firebaseArray,historyService){
var dialog = document.querySelector('dialog');
   if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
var database=fireService.getInstance.database();
$scope.notes=$firebaseArray(database.ref("Note/text"));
$scope.deleteNote=function(e,id){
	e.preventDefault();
	$scope.iddeletenote=id;
	dialog.showModal();
}
$scope.closeModal=function(){
  dialog.close();
};
$scope.okdelete=function(){
   if($scope.iddeletenote!==undefined || $scope.iddeletenote!==null || $scope.iddeletenote!==""){
     database.ref("Note").child("text").child($scope.iddeletenote).remove().then(function(){
        dialog.close();
     });
   }else{
   	dialog.close();
   	toastService.defaultPosition();
   	toastService.error("No se puede eliminar esta nota !","Error:");
   }

}
$scope.changeHistory=function(e){
	historyService.href="#/home/texts";
}
}])
.controller("home.linksController",['$scope','fireService','toastService','$firebaseArray','historyService',
	function($scope,fireService,toastService,$firebaseArray,historyService){
var database=fireService.getInstance.database();
$scope.notes=$firebaseArray(database.ref("Note/link"));
var dialog = document.querySelector('dialog');
   if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

$scope.deleteNote=function(e,id){
	e.preventDefault();
	$scope.iddeletenote=id;
	dialog.showModal();
}
$scope.closeModal=function(){
  dialog.close();
};
$scope.okdelete=function(){
   if($scope.iddeletenote!==undefined || $scope.iddeletenote!==null || $scope.iddeletenote!==""){
     database.ref("Note").child("link").child($scope.iddeletenote).remove().then(function(){
        dialog.close();
     });
   }else{
   	dialog.close();
   	toastService.defaultPosition();
   	toastService.error("No se puede eliminar esta nota !","Error:");
   }

}
$scope.changeHistory=function(e){
	historyService.href="#/home/links";
}

}])
.controller("home.filesController",['$scope','fireService','toastService','$firebaseArray','historyService',
	function($scope,fireService,toastService,$firebaseArray,historyService){
var database=fireService.getInstance.database();
var storage=fireService.getInstance.storage();
$scope.notes=$firebaseArray(database.ref("Note/file"));
var dialog = document.querySelector('dialog');
   if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

$scope.changeHistory=function(e){
	historyService.href="#/home/files";
}
$scope.deleteNote=function(e,id){
	e.preventDefault();
	$scope.iddeletenote=id;
	dialog.showModal();
}
$scope.closeModal=function(){
  dialog.close();
};
$scope.okdelete=function(){
   if($scope.iddeletenote!==undefined || $scope.iddeletenote!==null || $scope.iddeletenote!==""){
   	database.ref("Note").child("file").child($scope.iddeletenote).once("value").then(function(snapshot){
	    var filesarray=snapshot.val().files;
	    var i=0;
	    
	      for(var f in filesarray){
	      	
            storage.ref('Note/files/'+filesarray[f].name).delete().then(function() {
            	
            	 if(i==filesarray.length-1){
	      	  database.ref("Note").child("file").child($scope.iddeletenote).remove().then(function(){
                toastService.defaultPosition();
            	toastService.info('Los archivos fueron eliminado con exito !');
          });
	      	 
	      }
	       i++;
              }).catch(function(error) {
                toastService.fullTop();
               
            	toastService.error(error.message,filesarray[f].name+', no se pudo eliminar !');
           });
	      }  
	       dialog.close();        

	});

    

   }else{
   	dialog.close();
   	toastService.defaultPosition();
   	toastService.error("No se puede eliminar esta nota !","Error:");
   }

}

}])
.controller("home.texts.detailController",['$scope','fireService','toastService','$firebaseObject','$routeParams','historyService',
	function($scope,fireService,toastService,$firebaseObject,$routeParams,historyService){
		var database=fireService.getInstance.database();
		$scope.note=$firebaseObject(database.ref("Note").child("text").child($routeParams.id));
		$scope.zoomtext=16;
		$scope.zoomin=function(){
			$scope.zoomtext--;
			
		}
		$scope.zoomout=function(){
			$scope.zoomtext++;
		}
		$scope.historyhref=historyService.href;

}])
.controller("home.links.detailController",['$scope','fireService','toastService','$firebaseObject','$routeParams','historyService',
	function($scope,fireService,toastService,$firebaseObject,$routeParams,historyService){
		var database=fireService.getInstance.database();
		$scope.note=$firebaseObject(database.ref("Note").child("link").child($routeParams.id));
		$scope.historyhref=historyService.href;

}])
.controller("home.files.detailController",['$scope','fireService','toastService','$firebaseObject','$routeParams','historyService',
	function($scope,fireService,toastService,$firebaseObject,$routeParams,historyService){
		var database=fireService.getInstance.database();
		$scope.note=$firebaseObject(database.ref("Note").child("file").child($routeParams.id));
		$scope.contador=0;
      $scope.historyhref=historyService.href;
}]);


