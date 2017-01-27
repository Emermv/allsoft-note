angular.module("noteApp.directives",[])
.directive("noteList",function() {
	return{
		restrict:'E',
		templateUrl:'view/templates/noteList.html',
		link:function(scope){
         console.log(scope.notes);
         console.log(scope.categories);
         var json=JSON.stringify(scope.notes);
        console.log(JSON.parse(json));
    },
		scope:{
			notes:"=notes",
      categories:"=categories"
		}


	};//end return
 
})
.directive("cardUser",function(){
return {
  restrict:'E',
  templateUrl:'view/templates/cardUser.html',
  scope:{
   user:"="
  }
};

})
.directive('uploaderModel', ["$parse", function ($parse) { 
    return { 
      restrict: 'A',
     link: function (scope, iElement, iAttrs) { 
      iElement.on("change", function(e) { 
        $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]); 
      }); 
     } 
    }; 
  }])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
 
            element.bind('change', function(){
              console.log(element[0]);
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.directive("noteCategory",['$firebaseArray','fireService',function($firebaseArray,fireService){
  return {
    restrict:'E',
    template:'<div  ng-class="ngclassobject">'+
             '<label for="category" ng-show="{{showlabel}}">Categoria</label>'+
             '<select id="category"  ng-model="modelname" class="form-control" ng-focus="callback()">'+
             '<option ng-repeat="cat in categories" value="{{cat.color}}">{{cat.name}}</option>'+
             '</select>'+
             '<span  ng-show="{{showbutton}}" class="input-group-btn">'+
             '<button class="btn btn-default" type="button" ng-click="buttonclick()">'+
             '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'+
             '</button>'+
             ' </span>'+
             '</div>',
      link:function(scope){
     var database=fireService.getInstance.database();
     scope.categories=$firebaseArray(database.ref("Note/categories"));
    },
      scope:{
       callback:"&",
       ngclassobject:"=",
       modelname:"=",
       showlabel:"@",
       showbutton:"@",
       buttonclick:"&"
      }


  };

}])
.directive("searchBar",['fireService','$location',function(fireService,$location){
   return {
     restrict:'E',
     template:'<form ng-submit="search()"><div class="input-group padding">'+
      '<input type="text" class="form-control" placeholder="Buscar..." ng-model="searchtext">'+
      '<span class="input-group-btn">'+
        '<button class="btn btn-default" type="submit">'+
           '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>'+
        '</button>'+
      '</span>'+
    '</div></form>',
     link:function(scope,element){
        scope.searchtext="";
       
        var databaseref=fireService.getInstance.database().ref("Note");
        scope.search=function(){
           scope.results=new Array();
           databaseref.child("text").once("value").then(function(data){
                var texts=data.val();
                for(var i in texts){
                  if(texts[i].title.toUpperCase().includes(scope.searchtext.toUpperCase())){
                    scope.results.push({type:'text',note:texts[i]});
                  }
                }
           }, function(error){
                console.log(error);
           });

             databaseref.child("link").once("value").then(function(data){
                var links=data.val();
                for(var i in links){
                  if(links[i].title.toUpperCase().includes(scope.searchtext.toUpperCase())){
                    scope.results.push({type:'link',note:links[i]});
                  }
                }
           }, function(error){
                console.log(error);
           });

           databaseref.child("file").once("value").then(function(data){
                var files=data.val();
                for(var i in files){
                  if(files[i].title.toUpperCase().includes(scope.searchtext.toUpperCase())){
                    scope.results.push({type:'file',note:files[i]});
                  }
                }
                $location.url("search/results");
               console.log(scope.results);
           }, function(error){
                console.log(error);
           });


        }

     }

   };

}]);

/*
var pop=$('#basic-url').popover({
      template:'<div class="popover red" role="tooltip">'+
      '<div class="arrow"></div>'+
      '<div class="popover-content"></div></div>',
      trigger:'manual',
      title:'pop',
      content:'Ingrese un titulo',
      container:document.getElementById('pop'),
      placement:'bottom'
    });
pop.popover('show');

*/