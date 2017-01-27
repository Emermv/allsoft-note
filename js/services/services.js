angular.module("noteApp.services",[])
.factory("toastService",['toastr','toastrConfig',function(toastr,toastrConfig){
    toastrConfig.closeButton=true;
return {
  error:function(msj,title=false){
    if(!title){
      toastr.error(msj);
    }else{
      toastr.error(msj,title);
    }
  },
  warning:function(msj,title=false){
    if(!title){
      toastr.warning(msj);
    }else{
      toastr.warning(msj,title);
    }
  },
  success:function(msj,title=false){
    if(!title){
      toastr.success(msj);
    }else{
      toastr.success(msj,title);
    }
  },
  info:function(msj,title=false){
    if(!title){
      toastr.info(msj);
    }else{
      toastr.info(msj,title);
    }
  },
  clear:function(){
    toastr.clear();
  },
  setTime:function(time){
    toastrConfig.timeOut=time;
  },
  setPosition:function(pos){
    toastrConfig.positionClass=pos;
  },
  defaultPosition:function(){
    toastrConfig.positionClass="toast-top-center";
  },
  bottomCenter:function(){
    toastrConfig.positionClass="toast-bottom-center";
  },
  fullTop:function(){
    toastrConfig.positionClass="toast-top-full-width";
  },
  fullBottom:function(){
    toastrConfig.positionClass="toast-bottom-full-width";
  }


};

}])
.service("fireService",function(){
	
var config = {
    apiKey: "AIzaSyATHNnSrkDso1I97TjkGouNnkRs1wddbks",
    authDomain: "allsoft-note.firebaseapp.com",
    databaseURL: "https://allsoft-note.firebaseio.com",
    storageBucket: "allsoft-note.appspot.com",
    messagingSenderId: "28069443312"
  };

 this.getInstance=firebase.initializeApp(config);

})
.factory("fileService",function(){

    return {
      check:function(){
      	if( ! window.FileReader ) {
	      return false;
             }
             return true;
      },
     toBase64:function(file,callback,isArray=false){
     var reader = new FileReader();
     var urlBase64=new Array();
     var i=0;
     var finish=false;
     if(isArray){
     	reader.onload = function(){
     		i++;
            urlBase64.push(reader.result);
            if(i==file.length){
            	finish=true;
            	callback(urlBase64);
               }
                   
          if(!finish){
          	 reader.readAsDataURL(file[i]);
          }

	    }

         reader.readAsDataURL(file[0]);

      }else{
        reader.onload=function(){
        	callback(reader.result);
        }
         reader.readAsDataURL(file);
      }//end if
      
     }//end function

    };
})
.factory("dateService",function(){
    return {
      getTime:function(){
  var date=new Date();
     return date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
     },
     getDate:function(){
     	return new Date().toLocaleDateString();
     }
    };
}).service("base64",function(){
  var Base64={
    _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode:function(e){
      var t="";var n,r,i,s,o,u,a;var f=0;
      e=Base64._utf8_encode(e);
      while(f<e.length){
        n=e.charCodeAt(f++);
        r=e.charCodeAt(f++);
        i=e.charCodeAt(f++);
        s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;
        a=i&63;
        if(isNaN(r)){
          u=a=64
        }else if(isNaN(i)){
          a=64
        }
          t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}
          return t;
        },
          decode:function(e){
            var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");
            while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));
              o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));
              a=this._keyStr.indexOf(e.charAt(f++));
              n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);
              if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}
                t=Base64._utf8_decode(t);
              return t},
              _utf8_encode:function(e){
                e=e.replace(/rn/g,"n");var t="";
                for(var n=0;n<e.length;n++){
                  var r=e.charCodeAt(n);
                  if(r<128){
                    t+=String.fromCharCode(r)
                  }else if(r>127&&r<2048){
                    t+=String.fromCharCode(r>>6|192);
                    t+=String.fromCharCode(r&63|128);
                  }else{
                    t+=String.fromCharCode(r>>12|224);
                    t+=String.fromCharCode(r>>6&63|128);
                    t+=String.fromCharCode(r&63|128)}}
                    return t
                  },
                    _utf8_decode:function(e){
                      var t="";var n=0;var r=c1=c2=0;
                      while(n<e.length){
                      r=e.charCodeAt(n);
                      if(r<128){
                        t+=String.fromCharCode(r);
                        n++
                      }
                      else if(r>191&&r<224){
                        c2=e.charCodeAt(n+1);
                        t+=String.fromCharCode((r&31)<<6|c2&63);
                        n+=2
                      }else{
                        c2=e.charCodeAt(n+1);
                        c3=e.charCodeAt(n+2);
                          t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
                          n+=3}}return t}
                        };
  return Base64;

})
.service("storageService",function(){
     return{
       data:{
        count:0

       }
     };
})
.service("userProfile",['$location',function($location){
return {
    status:false,
    get:function(callback){
       try{
    var userjson=JSON.parse(localStorage.getItem("dXNlcl9jcmVkZW50aWFscw"));
         for(var i in userjson){
           callback(userjson[i]);
         }
       }catch(err){
        $location.url("exit");
       }
    }
};

}])
.service("settupProfile",['fireService',function(fireService){
 var database=fireService.getInstance.database();

return{
 get:function(callback){
  database.ref("Settup").child("user").child("profile").on("value",function(snapshot){
     callback(snapshot.val());
  });

 }
};

}])
.service("settupService",['fireService',function(fireService){
    var database=fireService.getInstance.database();
    return {
    get:function(childname,callback){
      database.ref("Settup").child("ui").child(childname).on("value",function(snapshot){
         callback(snapshot.val());
      });
    }
    };

}])
.service("historyService",function(){
return{
  href:""
};
});





