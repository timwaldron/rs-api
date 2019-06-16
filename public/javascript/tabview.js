const changeExample = (event, elementName) => {
  let tabContentQuery = document.querySelectorAll(".tabcontent");
  let tabLinksQuery = document.querySelectorAll(".tablinks");

  tabContentQuery.forEach((tab) => tab.style.display = "none");
  tabLinksQuery.forEach((link) => {
    console.log("replaced", link);
    // while(link.className.includes(" active")) {link.className.replace(" active", "");}
    
  });

  let tabTarget = document.querySelector("#" + elementName);
  tabTarget.style.display = "block";
  // event.currentTarget.className += " active";
}



// function openCity(evt, cityName) {
//   var i, tabcontent, tablinks;
//   tabcontent = document.getElementsByClassName("tabcontent");

//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }

//   tablinks = document.getElementsByClassName("tablinks");

//   for (i = 0; i < tablinks.length; i++) { 
//     tablinks[i].className = tablinks[i].className.replace(" active", "");
//   }

//   document.getElementById(cityName).style.display = "block";
//   evt.currentTarget.className += " active";
// }