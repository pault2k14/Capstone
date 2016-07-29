/**
 * CareWheels - Reminders Controller
 *
 */
angular.module('careWheels')

.controller('remindersController', ['$scope', '$controller', '$ionicPopup', '$state', function($scope, $controller, $ionicPopup, $state){

  var notifViewModel = $scope.$new();
  var restViewModel = $scope.$new();
  $controller('NotificationController',{$scope : notifViewModel });
  $controller('ReminderRestController',{$scope : restViewModel });

  $scope.reminders = [
    {/* Reminder 0 */
      hour: notifViewModel.data[0].hours,
      min: notifViewModel.data[0].minutes, //leading zeros will automatically be added
      amOrPm: 'AM',
      isOn: notifViewModel.data[0].on
    },
    {/* Reminder 1 */
      hour: notifViewModel.data[1].hours,
      min: notifViewModel.data[1].minutes,
      amOrPm: 'AM',
      isOn: notifViewModel.data[1].on

    },
    {/* Reminder 2 */
      hour: notifViewModel.data[2].hours,
      min: notifViewModel.data[2].minutes,
      amOrPm: 'AM',
      isOn: notifViewModel.data[2].on
    }
  ];

  for(i=0; i<3; ++i){
    if($scope.reminders[i].hour>12){
      $scope.reminders[i].hour -= 12;
      $scope.reminders[i].amOrPm = 'PM';
    }
  }
/**
   * PLEASE NOTE: these next 6 functions can be consolidated
   * into just two functions, by using an array of booleans
   * and passing an index as a parameter for the following
   * functions. I attempted to code this, however
   * I kept getting naming conflict errors with the toggle
   * booleans.
   * */

  /** REMINDER 0: ON/OFF toggle **/
  $scope.toggleOnOff_0 = function(){
    if ($scope.isOnOffToggled_0 == false) {
      $scope.reminders[0].isOn = false;
      $scope.isOnOffToggled_0 = true;
    } else{
      $scope.reminders[0].isOn = true;
      $scope.isOnOffToggled_0 = false;
    }
    console.log("Toggled: " + $scope.reminders[0].isOn);
  };
  /** REMINDER 0: AM/PM toggle **/
  $scope.toggleAmPm_0 = function(){
    if ($scope.isAmPmToggled_0 == false) {
      $scope.reminders[0].amOrPm = 'AM';
      $scope.isAmPmToggled_0 = true;
    } else{
      $scope.reminders[0].amOrPm = 'PM';
      $scope.isAmPmToggled_0 = false;
    }
    console.log("Toggled: " + $scope.reminders[0].amOrPm);
  };

  /** REMINDER 1: ON/OFF toggle **/
  $scope.toggleOnOff_1 = function(){
    if ($scope.isOnOffToggled_1 == false) {
      $scope.reminders[1].isOn = false;
      $scope.isOnOffToggled_1 = true;
    } else{
      $scope.reminders[1].isOn = true;
      $scope.isOnOffToggled_1 = false;
    }
    console.log("Toggled: " + $scope.reminders[1].isOn);
  };
  /** REMINDER 1: AM/PM toggle **/
  $scope.toggleAmPm_1 = function(){
    if ($scope.isAmPmToggled_1 == false) {
      $scope.reminders[1].amOrPm = 'AM';
      $scope.isAmPmToggled_1 = true;
    } else{
      $scope.reminders[1].amOrPm = 'PM';
      $scope.isAmPmToggled_1 = false;
    }
    console.log("Toggled: " + $scope.reminders[1].amOrPm);
  };

  /** REMINDER 2 : ON/OFF toggle **/
  $scope.toggleOnOff_2 = function(){
    if ($scope.isOnOffToggled_2 == false) {
      $scope.reminders[2].isOn = false;
      $scope.isOnOffToggled_2 = true;
    } else{
      $scope.reminders[2].isOn = true;
      $scope.isOnOffToggled_2 = false;
    }
    console.log("Toggled: " + $scope.reminders[2].isOn);
  };
  /** REMINDER 2: AM/PM toggle **/
  $scope.toggleAmPm_2 = function(){
    if ($scope.isAmPmToggled_2 == false) {
      $scope.reminders[2].amOrPm = 'AM';
      $scope.isAmPmToggled_2 = true;
    } else{
      $scope.reminders[2].amOrPm = 'PM';
      $scope.isAmPmToggled_2 = false;
    }
    console.log("Toggled: " + $scope.reminders[2].amOrPm);
  };


  /**
   * function for ng-checked, returns a true if set at PM
   * or a false if set to AM */
  $scope.isPM = function(element){
    return element == 'PM';
  };

  /**
   *  this function is used to one leading zero
   *  onto minutes that are less than 10
   * */
  $scope.padZero = function(input) {
    if (input < 10)
      return '0' + input;
    else
      return input
  };

  $scope.confirmReset = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Reset',
       template: 'Are you sure you want to reset all Reminders to their times?'
     });

     confirmPopup.then(function(res) {
       if(res) {
        //Delete old reminder files and reset to default
        notifViewModel.Delete_Reminders();
        notifViewModel.Init_Notifs();

        //Reset Cyclos fields to default
        var rem1 = notifViewModel.Reminder_As_String(0);
        var rem2 = notifViewModel.Reminder_As_String(1);
        var rem3 = notifViewModel.Reminder_As_String(2);
        var myUser = angular.fromJson(window.sessionStorage['user']);
        restViewModel.fetch(myUser.username, myUser.password, myUser.username, rem1, rem2, rem3);
        $state.go($state.current, {}, {reload: true});
       } else {
         console.log('Reset canceled!');
       }
     });
   };

  $scope.saveReminders = function() {
    //update Notification component's memory and local reminder times
    for(var index=0; index<3; ++index){
      var myHours = $scope.reminders[index].hour;
      if($scope.reminders[index].amOrPm == 'PM') myHours = parseInt(myHours)+12;
      notifViewModel.Create_Notif(myHours, $scope.reminders[index].min, 0, $scope.reminders[index].isOn, index+1);
      console.log(myHours + ":" + $scope.reminders[index].min + ":" + 0 + " " + $scope.reminders[index].isOn + index);
    }

    //update Cyclos server's reminder fields
    if($scope.reminders[0].isOn){
      var rem1 = notifViewModel.Reminder_As_String(0);
    } else rem1 = '';
    if($scope.reminders[0].isOn){
      var rem2 = notifViewModel.Reminder_As_String(1);
    } else rem2 = '';
    if($scope.reminders[0].isOn){
      var rem3 = notifViewModel.Reminder_As_String(2);
    } else rem3 = '';
    var myUser = angular.fromJson(window.sessionStorage['user']);
    console.log("rem1="+rem1+" rem2="+rem2+" rem3="+rem3);
    restViewModel.fetch(myUser.username, myUser.password, myUser.username, rem1, rem2, rem3);
  }
}])

//Notifications Component, as defined in design document. To be used to generate User Reminders and Red Alert tray notifications on Android.
.controller("NotificationController", function($scope, $log, $cordovaLocalNotification){
  var isAndroid = window.cordova!=undefined;    //checks to see if cordova is available on this platform; platform() erroneously returns 'android' on Chrome Canary so it won't work
  function Time() {this.hours=0; this.minutes=0; this.seconds=0; this.on=true;};
  //window.localStorage['Reminders'] = null;    //Turning this on simulates starting from fresh storage every time controller is called by view change
  $scope.data = angular.fromJson(window.localStorage['Reminders']);   //needs to be called outside the functions so it persists for all of them

  //To be called during app startup after login; retrieves saved alert times (if they exist) or creates default alerts (if they don't) 
  //and calls Create_Notif for each of them
  $scope.Init_Notifs = function() {
    //$scope.data = angular.fromJson(window.localStorage['Reminders']);
    if($scope.data==null){   //have notifications been initialized before?
      $log.log("Initializing Notifications from default");
      $scope.data = [];    //data param needs to be initialized before indices can be added
      $scope.data[0] = new Time();
      $scope.data[1] = new Time();
      $scope.data[2] = new Time();
      $scope.Create_Notif(10,0,0,true,1);  //these correspond to the pre-chosen default alarm times
      $scope.Create_Notif(14,0,0,true,2);
      $scope.Create_Notif(19,0,0,true,3);
    } else {    //need to check if each reminder, as any/all of them could be deleted by user
      $log.log("Initializing Notifications from memory");
      if($scope.data[0]) $scope.Create_Notif($scope.data[0].hours,$scope.data[0].minutes,$scope.data[0].seconds,$scope.data[0].on,1);
      if($scope.data[1]) $scope.Create_Notif($scope.data[1].hours,$scope.data[1].minutes,$scope.data[1].seconds,$scope.data[1].on,2);
      if($scope.data[2]) $scope.Create_Notif($scope.data[2].hours,$scope.data[2].minutes,$scope.data[2].seconds,$scope.data[2].on,3);
    }
  }

  //Schedules a local notification and, if it is a reminder, saves a record of it to local storage. reminderNum must be <4
  //or it will log an error and schedule no notifications.
  $scope.Create_Notif = function(hours, minutes, seconds, isOn, reminderNum){
    if(reminderNum==0){   //is notif a red alert?
      if(isAndroid){
        $cordovaLocalNotification.schedule({    //omitting 'at' and 'every' params means it occurs once, immediately
          id: reminderNum,
          message: "There are red alert(s) on your CareWheel!",
          title: "CareWheels",
          sound: null   //should be updated to freeware sound
        }).then(function() {
          $log.log("Alert notification has been set");
        });        
      } else $log.warn("Plugin disabled");
    } if(reminderNum>0 && reminderNum <4){    //is notif a user reminder?
      var time = new Date($scope.data[0].hours + ":" + $scope.data[0].minutes);    //defaults to current date/time
      time.setHours(hours);     //update 
      $scope.data[reminderNum-1].hours = hours;
      time.setMinutes(minutes);
      $scope.data[reminderNum-1].minutes = minutes;
      time.setSeconds(seconds);
      $scope.data[reminderNum-1].seconds = seconds;
      $scope.data[reminderNum-1].on = isOn;
      window.localStorage['Reminders'] = angular.toJson($scope.data);   //save $scope.data so new reminder is stored
      if(isAndroid){
        $cordovaLocalNotification.schedule({
          id: reminderNum,
          firstAt: time,
          every: "day",
          message: "Reminder " + reminderNum + ": Please check in with your CareWheel!",
          title: "CareWheels",
          sound: null   //same, hopefully a different sound than red alerts
        }).then(function() {
          $log.log("Notification" + reminderNum + "has been scheduled for " + time.getUTCTime() + ", daily");
        });    
      } else $log.warn("Plugin disabled"); 
    } else if(reminderNum >=4) $log.warn("Incorrect attempt to create notification for id #" + reminderNum);
  };

  //Unschedules all local reminders; clears its index if it is a user reminder (id 1-3).
  $scope.Delete_Reminders = function(){   //NOTE: id corresponds to $scope.data array indices so it is off by one
    //$scope.data = angular.fromJson(window.localStorage['Reminders']);
    if(isAndroid){
      for(i=1; i<4; ++i){
        $cordovaLocalNotification.clear(i, function() {
          $log.log(i + " is cleared");
        });
      }
    } else $log.warn("Plugin disabled"); 
    
    window.localStorage['Reminders'] = null;   //and delete Reminders array
    $scope.data = null;
  }

  //Unschedules a local notification as per Delete_Notif but does NOT clear storage or data index; to be used by User Reminder's Toggle()
  $scope.Toggle_Off_Notif = function(id){
    $scope.data = angular.fromJson(window.localStorage['Reminders']);
    if(id==1||id==2||id==3){
      $scope.data[id-1].on = false;
      window.localStorage['Reminders'] = angular.toJson($scope.data);   //and save $scope.data so toggle is remembered
    } 
    if(isAndroid){
      $cordovaLocalNotification.clear(id, function() {
        $log.log(id + " is cleared");
      });
    } else $log.warn("Plugin disabled"); 
  }

  //prints the in-memory and scheduled status of Reminders, for testing purposes
  $scope.Notifs_Status = function(){
    //$scope.data = angular.fromJson(window.localStorage['Reminders']);
    alert("In memory: \nReminder 1= (" +$scope.data[0].on +") "+ $scope.data[0].hours + ":" + $scope.data[0].minutes + ":" + $scope.data[0].seconds +
      "\nReminder 2= (" +$scope.data[0].on +") "+ $scope.data[1].hours + ":" + $scope.data[1].minutes + ":" + $scope.data[1].seconds +
      "\nReminder 3= (" +$scope.data[0].on +") "+ $scope.data[2].hours + ":" + $scope.data[2].minutes + ":" + $scope.data[2].seconds);
    if(isAndroid){
      cordova.plugins.notification.local.get([1, 2, 3], function (notifications) {
        alert("Scheduled: " + notifications);
      });      
    } else $log.warn("Plugin disabled");
  }

  //returns a reminder (id # = 0,1, or 2) as a string in the format HH:MM:SS
  $scope.Reminder_As_String = function(id){
    if(id>2){
      $log.error("Attempted to print Reminder id " + id + ", but there are only 3 reminders!");
    } else {
      var hour = $scope.data[id].hours;
      if(hour<10) hour = 0 + String(hour);
      var minute = $scope.data[id].minutes;
      if(minute<10) minute = 0 + String(minute);
      var second = $scope.data[id].minutes;
      if(second<10) second = 0 + String(second);
      return hour + ":" + minute + ":" + second;
    }
  }
});

