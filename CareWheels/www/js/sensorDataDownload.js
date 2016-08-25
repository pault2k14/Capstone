angular.module('careWheels')

.factory('Download', function($http, $httpParamSerializerJQLike, WorkerService, GroupInfo, User, notifications) {
  var DownloadService = {};

//this is the main function called after login
DownloadService.DownloadData = function () {

  var getData = function (member) {

  var usernametofind = member.username; //.toLowerCase();//for each group member
  var user = User.credentials();//from login
  var password = user.password;//credentials of logged in user, from USER service
  var username = user.username;

  //get variable values from groupinfo
  var medsInterval2 = GroupInfo.getMedsInterval2(usernametofind)
  var medsInterval3 = GroupInfo.getMedsInterval3(usernametofind)
  var medsInterval4 = GroupInfo.getMedsInterval4(usernametofind)
  var onVacation = GroupInfo.getOnVacation(usernametofind)

    if(medsInterval2) {
      medsInterval2 = 'True';
    }
    else {
      medsInterval2 = 'False';
    }

    if(medsInterval3) {
      medsInterval3 = 'True';
    }
    else {
      medsInterval3 = 'False';
    }

    if(medsInterval4) {
      medsInterval4 = 'True';
    }
    else {
      medsInterval4 = 'False';
    }

    if(onVacation) {
      onVacation = 'True';
    }
    else {
      onVacation = 'False';
    }


  //http request to carebank /getfeeds/ endpoint
  var dataUrl = "https://carewheels.cecs.pdx.edu:8443/analysis.php";//get page of nodes for this user
    return $http({
      url:dataUrl,
      method:'POST',
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects
        usernametofind:usernametofind,
        username:username,
        password:password,
        medsinterval2:medsInterval2,
        medsinterval3:medsInterval3,
        medsinterval4:medsInterval4,
        onvacation:onVacation
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {

        console.log("cecs data server", response);

        GroupInfo.setAnalysisData(usernametofind, response.data);//add new analysis data to group member

        if(response.data.medsAlertLevel >= 2) { //handle red alert notifications
          notifications.Create_Notif(0, 0, 0, false, 0);
          console.log("Meds notification created!");
        }

        if(response.data.fridgeAlertLevel >= 2) {  //handle *red alert* notifications
          notifications.Create_Notif(0, 0, 0, false, 0);
          console.log("Fridge notification created!")
        }

      console.log("Group after downloading sensor data: ", GroupInfo.groupInfo());

    }, function error(response) {
        console.log("request failed ", response);
        //log appropriate error
      })

};

var theseMembers = GroupInfo.groupInfo();//returns all five group members with carebank data after login

for (var i = 0; i < theseMembers.length; i++){//this is where we loop over each group member, check for keys, and download data
  theseMembers[i].index = i;
  if (theseMembers[i].customValues[1].stringValue == "000" || theseMembers[i].customValues[1].stringValue == "" ||
    theseMembers[i].customValues[2].stringValue == "000" || theseMembers[i].customValues[2].stringValue == "")
    {
      //theseMembers[i].sensorData = null;
      console.log("error, please obtain valid sen.se keys!");
    }
  else{
    getData(theseMembers[i]);
    };
};
};
return DownloadService;
});


