var array;
$(document).ready(function(){

  var href = document.location.href;
  var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
    
    if(lastPathSegment=="receptLista.html"){
      getResult(false);
    }
    search();

});
    function getResult(update){

             var  activity = sessionStorage.getItem("activity");
             var  sex =  sessionStorage.getItem("sex");
             var  weight = sessionStorage.getItem("weight");
             var  height =  sessionStorage.getItem("height");
             var  goal = sessionStorage.getItem("goal");
             var  age = sessionStorage.getItem("age");
             var  type = sessionStorage.getItem("mealtype");

            var resArray = ['vegan', 'vegetarian', 'gluten', 'laktos', 'milkprotein', 'nut'];
            var restriction = '';

        /* Hämtar alla restriktioner från SessionStorage
        och lagrar dom i en sträng (restrictions) */ 
        
        if(update){
                    
            restriction='';

              //for each - checkbutton som är ikryssad, 
                // lägg till i restrictions
                $(".cb").each(function(){
                    if($(this).is(':checked')){
                        restriction += $(this).attr("value")+",";
                    }
                                
              });
                console.log("update restr: " + restriction);

            }else{
                restriction='';
           
                 for (var i = 0; i <= resArray.length; i++) {
                   if(sessionStorage.getItem(resArray[i]) == 'true'){
                      restriction += resArray[i]+",";
                   }
                }
                
                console.log("dont update: " + restriction);
                
            }

            var baseUrl = "http://localhost:8080/api/1/"+activity+"/"+sex+"/"+weight+"/"+height+"/"+goal+"/"+age+"/"+type+"?restrictions="+restriction+"";
            
        console.log(baseUrl);
        
             $.ajax({
                 type: "GET",
                 url: baseUrl,
                 dataType: "JSON",
                 success: function (response) {
                    
                     console.log(response);

                     
                 //  var array=JSON.stringify(response);
               //    sessionStorage.setItem("array", array);
                  //   printRes(response);
                    console.log(response);
                 }, fail: function (response) {
                     console.log(response);
                 }

                });


                }

    function printRes(res){
                response = res;
                array=response;


                    $.each(response, function(index, item){
                    $.get("template/keycard.php", function(data){
                    var score = Math.round(response[index].scoreTot*100);

                    $(".row").append(replaceContent(data, [{"id":index ,"title": response[index].recipeName,"scoreTot":score}]));

                      });
                });

            }

            //Ersätt titel och beskrivning:
            function replaceContent(e,t){
                res=e;
                for(var n=0;n<t.length;n++){
                    res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){
                        return t[n][r]})}
                return res
            }

          function clickedCard(ref){
                                console.log(ref.id);
                               var clickedCard = JSON.stringify(array[ref.id]);
                               sessionStorage.setItem("card", clickedCard);
                }

                function search(){
                  /* KARRO LÄGGER TILL */
                    $("#updateSearch").on('click', function(){
                          console.log("update");
                        $( ".recept" ).remove();
                          getResult(true);
                      });
                      
                      /* Slut på test */   
                  
                    
                  $("#searchBtn").on('click', function() {

                 $('#searchField').keyup(function(e){
                   if(e.keyCode == 13){
                     $( ".recept" ).remove();
                     var array = JSON.parse(sessionStorage.getItem("array"));
                     var  substring =  sessionStorage.getItem("searchField");
                     var temp= new Array();
                     var counter=0;

                     $.each(array, function(index, item){
                       var x = array[index].recipeName.toLowerCase();
                        console.log(x);
                          if (x.indexOf(substring) != -1) {
                            temp[index] = array[index];
                            counter++;
                            }

                         });


                     if(counter>0){
                        console.log("TEMP ARRAY "+temp);
                        printRes(temp);
                     }

                   }
                        });
                      
                      
                     
                      
                     });
                    
                  
                    
                }
