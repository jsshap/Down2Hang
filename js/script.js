    function alertNotSupported(){
      alert("This function is not supported in this application of Down2Hang. Logins allow for users to see events specific to them or a select group of interest. Check back later for updates. Thanks for your understanding!")
    }
    let config = {
      apiKey: "AIzaSyC8iaO8kb95S5mnUa2WLSCrCO-2Vq7RWiE",
      authDomain: "amherst-hangout.firebaseapp.com",
      projectId: "amherst-hangout",
      databaseURL: "https://amherst-hangout-default-rtdb.firebaseio.com/",
    };

    function createHangout(eventID, eventTitle, eventTime, eventLocation, eventMin, eventMax, eventDescription) {
      let config = {
        apiKey: "AIzaSyC8iaO8kb95S5mnUa2WLSCrCO-2Vq7RWiE",
        authDomain: "amherst-hangout.firebaseapp.com",
        projectId: "amherst-hangout",
        databaseURL: "https://amherst-hangout-default-rtdb.firebaseio.com/",
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }

      this.database = firebase.database();
      let userRef = this.database.ref('Events/');

      let emptylist = [];


      userRef.child(eventID).set({
        'EventID': eventID,
          'Time': eventTime,
          'Location': eventLocation,
          'Title' : eventTitle,
          'Description': eventDescription,
          'min': eventMin,
          'max': eventMax,
          'Participants' : emptylist
      });

      console.log('this method finished.')

    }

    // function getEventInfo() {
    //   var eventsData;
    //   if (!firebase.apps.length) {
    //     firebase.initializeApp(config);
    //   }

    //   this.database = firebase.database();//not desired JSON data

    //   let userRef = this.database.ref('Events/');//not desired JSON data 

    //   userRef.on("value", 
    //   function(snapshot) {
    //     eventsData=snapshot.val();
    //   },
    //   function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    //   }
    //   );
    //   return eventsData;
    // }

    function addParticipant(eventID,name,email) {
      let config = {
        apiKey: "AIzaSyC8iaO8kb95S5mnUa2WLSCrCO-2Vq7RWiE",
        authDomain: "amherst-hangout.firebaseapp.com",
        projectId: "amherst-hangout",
        databaseURL: "https://amherst-hangout-default-rtdb.firebaseio.com/",
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }

      this.database = firebase.database();


      let userRef = this.database.ref('Events/' + eventID);

      // emptylist = [];
      // //Create participants list
      // userRef.child('Participants').set(emptylist)

      // Update (push participant to list)
      userRef.child('Participants').push({'Name': name, 'Email':email})

      userRef.on("value", function(snapshot) {



        var requestData = snapshot.val(); 

        apicall(requestData);
        console.log(requestData.Participants);


      }



      , function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      });
        var requestData = {

        }
  

    }


    function go(){
      //event.preventDefault();
      var fname=document.getElementById("fname").value.toString();
      var lname=document.getElementById("lname").value.toString();
      var email=document.getElementById("email").value.toString();
      var minipart=document.getElementById("minipart").value.toString();
      var maxpart=document.getElementById("maxpart").value.toString();
      var ename=document.getElementById("ename").value.toString();
      var etime=document.getElementById("etime").value.toString();
      var elocation=document.getElementById("elocation").value.toString();
      var edesc=document.getElementById("edesc").value.toString();
      document.getElementById("newEventInfo").reset();
      var numEvents = Math.round(Math.random()*4206969);//EDIT THIS SHIT LATER!!
      createHangout(numEvents, ename, etime, elocation, minipart, maxpart, edesc);
      console.log(numEvents);
      addParticipant(numEvents,fname+' '+lname,email);
      alert("Your event has been submitted! You will receive an email when enough signups have occured.");
    }


    function joinEvent(){
      var eid=document.getElementById("joinEventSubmission").name;
      var fname=document.getElementById("fnameadd").value.toString();
      var lname=document.getElementById("lnameadd").value.toString();
      var email=document.getElementById("emailadd").value.toString();
      addParticipant(eid,fname+' '+lname,email);
      alert("You've been added to the event! You will receive an email when enough signups have occured.");
    }


    var allData;
    function displayEvents(){
      var eventsData;
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }

      this.database = firebase.database();//not desired JSON data

      let userRef = this.database.ref('Events/');//not desired JSON data 

      userRef.on("value", 
        function(snapshot) {
          document.getElementById("eDisplayBtns").innerHTML = "";
          eventsData=snapshot.val();
          dataMess=eventsData;
          for (event in eventsData){
            var eventButton = document.createElement('BUTTON');
            eventButton.innerHTML = eventsData[event].Title;
            eventButton.className = "btn btn-primary btn-lg btn-block rounded-lg border";
            eventButton.type = "button";
            eventButton.id = eventsData[event].EventID;
            eventButton.onmouseover = function showEvent(){
              var desc = document.createElement('h5');
              desc.innerHTML = "Description: " + dataMess[this.id].Description;
              var eTitle = document.createElement('h1');
              eTitle.innerHTML = dataMess[this.id].Title;
              eTitle.className = "display-4 text-center";
              var eTime = document.createElement('h5');
              eTime.innerHTML = "Time(military standard): @" + dataMess[this.id].Time;
              var eLocation = document.createElement('h5');
              eLocation.innerHTML = "Location: " + dataMess[this.id].Location;
              var numPpl = document.createElement('h5');
              numPpl.innerHTML = "Number of Participants: " + Object.keys(dataMess[this.id].Participants).length;
              var hr = document.createElement("hr");
              hr.className = "my-4";
              var eInfoSpace = document.getElementById("eInfoSpace");
              eInfoSpace.innerHTML= "";
              eInfoSpace.appendChild(eTitle);
              eInfoSpace.appendChild(hr);
              eInfoSpace.appendChild(desc);
              eInfoSpace.appendChild(eLocation);
              eInfoSpace.appendChild(eTime);
              eInfoSpace.appendChild(numPpl);
              //make join event btn visible
              var joinEBtn = document.getElementById("joinEventBtn");
              joinEBtn.innerHTML = "Join "+ eTitle.innerHTML+"!";
              joinEBtn.style.display = "initial";
              //store active event id in submit button's name
              document.getElementById("joinEventSubmission").name = this.id;
            }
            document.getElementById("eDisplayBtns").appendChild(eventButton);
          }
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
    }

    function displayHomePage(){
      displayEvents();
    }

    displayHomePage(); //Home page's content depends on data that is loaded through scripts, so better to show it after loading