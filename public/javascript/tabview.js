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