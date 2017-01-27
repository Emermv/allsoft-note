angular.module("controllers.noteController",[])
.controller("textController",['$scope','fireService','dateService','ngProgressFactory','$firebaseArray',
	function($scope,fireService,dateService,ngProgressFactory,$firebaseArray){
	$scope.note={};
	$scope.status=false;
	$scope.error={
		ok:false,
		fail:false,
		message:'',
		title:false,
		category:false,
		text:false
	};
    $scope.progressbar = ngProgressFactory.createInstance();
  	var database=fireService.getInstance.database();

	$scope.saveNote=function(){
		$scope.error.fail=false;
		$scope.error.message="";
         $scope.error.ok=false;
		 $scope.progressbar.start();
		
     if($scope.validate($scope.note.title)){
        $scope.status=true;
	}else{
     $scope.error.fail=true;
      $scope.error.title=true;
     $scope.error.message+="Ingrese un título, ";
	}
	 if($scope.validate($scope.note.category)){
        $scope.status=true;
	}else{
     $scope.error.fail=true;
         $scope.error.category=true;
     $scope.error.message+="Seleccione una categoria,";
	}

	 if($scope.validate($scope.note.text)){
        $scope.status=true;
	}else{
     $scope.error.fail=true;
         $scope.error.text=true;
     $scope.error.message+=" Ingrese una nota de texto !";
	}
  
var addnote;
   if($scope.status ==true && $scope.error.fail==false){
      $scope.note.fecha=dateService.getDate();
		$scope.note.hora=dateService.getTime();
		addnote=$firebaseArray(database.ref("Note/text")).$add($scope.note);
		 if(addnote.$$state.status==0){
		 	 $scope.error.ok=true;
         $scope.error.message="Tu nota de texto se ha guardado correctamente!";
         
     }else{
     	$scope.error.fail=true;
     	 $scope.error.message="Sin conexión a internet :(";
     }
     setTimeout(function(){$scope.progressbar.complete();},1000);
     }

	}
	$scope.quitError=function(){
		$scope.error={
		ok:false,
		fail:false,
		message:'',
		title:false,
		category:false,
		text:false
	};
	}

$scope.validate=function(text){
	if(text===undefined || text===null || text===""){
		$scope.progressbar.complete();
		return false;
	}
	return true;
}

}])

.controller("linkController",['$scope','fireService','dateService','$firebaseArray','ngProgressFactory',
	function($scope,fireService,dateService,$firebaseArray,ngProgressFactory){
	var progressbar=ngProgressFactory.createInstance();
	   progressbar.setColor("#ef5350");  
       progressbar.setHeight("3px");   
	var database=fireService.getInstance.database();
	var addnote;
$scope.note={};
$scope.errors={
	title:{
		status:false,
		message:""
	},
	category:{
		status:false,
		message:""
	},
	link:{
		status:false,
		message:""
	}
};

	$scope.saveNote=function(){
		$scope.statussend=false;
		progressbar.start();
		$scope.note.fecha=dateService.getDate();
		$scope.note.hora=dateService.getTime();
		
		if($scope.validNote($scope.note)){
           addnote=$firebaseArray(database.ref("Note/link")).$add($scope.note);
           $scope.statussend=true;
           if(addnote.$$state.status===0){
		 	 $scope.message="Guardado correctamente !";
		 	 $scope.typemessage=true;
               }else{
     	       $scope.message="Sin conexión a internet !";
     	       $scope.typemessage=false;
               }
           setTimeout(function(){ progressbar.complete();},1000);
		}else{
         setTimeout(function(){
            progressbar.complete();
         },1000);
		}
	}
	$scope.validNote=function(note){
		var valid=false;
        if(note.title===undefined || note.title===null ||note.title===""){
           $scope.errors.title.status=true;
           $scope.errors.title.message="Ingrese un título !";
           valid=false;
        }else{
        	valid=true;
        	$scope.errors.title={};
        }
          if(note.category===undefined || note.category===null || note.category===""){
           $scope.errors.category.status=true;
           $scope.errors.category.message="Seleccione una categoria !";
           valid=false;
        }else{
        	valid=true;
        	$scope.errors.category={};
        }
        
       if(note.link===undefined || note.link===null || note.link===""){
           $scope.errors.link.status=true;
           $scope.errors.link.message="Pegue o escriba un link!";
           valid=false;
        }else{
        	valid=true;
        	$scope.errors.link={};
        }
        
       return valid;
	}

  $scope.quitError=function(){
  	$scope.errors.link={};
  	$scope.errors.category={};
  	$scope.errors.title={};
  }

}])
.controller("fileController",
	['$scope','fireService','fileService','toastService','dateService','$firebaseArray','ngProgressFactory',
	function($scope,fireService,fileService,toastService,dateService,$firebaseArray,ngProgressFactory){
  var database= fireService.getInstance.database();
  var storage=fireService.getInstance.storage();
  var file=$("#file").fileinput({showUpload:false,maxFileSize:25600,minFileCount:1});
  var progressbar=ngProgressFactory.createInstance();
  var filesnote=new Array();
  progressbar.setColor("#ef5350");  
  progressbar.setHeight("3px");   
  var save;
  var i=0;
  var len=0;
	$scope.note={};
	$scope.errors={
		title:false,
		category:false,
		file:false
	};
	$scope.fileSelected=false;
	file.on('fileloaded', function(event, fil, previewId, index, reader) {
     filesnote.push(fil);
     $scope.fileSelected=true;
     $scope.statussave=false;
     });

	file.on('fileclear', function(event) {
      filesnote=new Array();
      $scope.fileSelected=false;
      $scope.statussave=false;
      });

	$scope.note.files=new Array();


     $scope.uploadfile=function(){
     if(i<len){
     	var uploadTask=storage.ref().child("Note").child("files/"+filesnote[i].name).put(filesnote[i]);
     uploadTask.on('state_changed', function(snapshot){
      console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressbar.set((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
}, function(error) {
  console.error(error);
}, function() {
	$scope.note.files.push({
		url:uploadTask.snapshot.downloadURL,
		type:filesnote[i].type,
		size:filesnote[i].size,
		name:filesnote[i].name
	});
	 progressbar.set(1);
	i++;
	$scope.uploadallfiles=true;
	 $scope.uploadfile();
});

     }else{
     	if($scope.uploadallfiles){
     		$scope.note.fecha=dateService.getDate();
	    $scope.note.hora=dateService.getTime();
	    save=$firebaseArray(database.ref("Note/file")).$add($scope.note);
                 $scope.statussave=true;
                 if(save.$$state.status===0){
                  $scope.typemessage=true;
                  filesnote=new Array();
                  $scope.fileSelected=false;
                  i=0;
                  $scope.messagesave="Guardado correctamente !";
                 }else{
                     $scope.statussave=false;
                     $scope.messagesave="Sin conexión a internet :(";
                 }
           
       }else{
          $scope.statussave=false;
          $scope.messagesave="Sin conexión a internet :(";
       }
       setTimeout(function(){progressbar.complete();},1000);
     	
     }

     }

	$scope.saveNote=function(){
		progressbar.set(1);
           len=filesnote.length;
		$scope.statussave=false;
		if($scope.validNote($scope.note)){
			if($scope.fileSelected){
				 $scope.uploadfile();
            
			}else{
				console.log("seleccione archivos!");
			}

			}else{
				 setTimeout(function(){progressbar.complete();},1000);
			}
    
	}
	$scope.validNote=function(note){
		var valid=false;
        if(note.title===undefined || note.title===null ||note.title===""){
           $scope.errors.title=true;
           valid=false;
        }else{
        	valid=true;
        	$scope.errors.title=false;
        }
          if(note.category===undefined || note.category===null || note.category===""){
           $scope.errors.category=true;
           valid=false;
        }else{
        	valid=true;
        	$scope.errors.category=false;
        }
        
        
       return valid;
	}

  $scope.quitError=function(){
  	$scope.errors.category=false;
  	$scope.errors.title=false;
  }

}])
.controller("audioController",['$scope','dateService',function($scope,dateService){
$scope.note={};
	$scope.saveNote=function(){
		$scope.note.fecha=dateService.getDate();
		$scope.note.hora=dateService.getTime();
		console.log($scope.note);
	}

}])
.controller("pictureController",['$scope',function($scope){
$scope.note={};
	$scope.saveNote=function(){
		console.log($scope.note);
	}

}]);