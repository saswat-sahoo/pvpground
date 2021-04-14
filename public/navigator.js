let userName;

$("#play-form").submit(e => {
    e.preventDefault();
})

$("#play-button").click(function() {
    userName = $("#username").val();
    console.log(userName);
    
    $("#welcome-screen").remove();
    new p5();   
    // let script   = document.createElement("script");
    // script.type  = "text/javascript";
    // script.async = "true";
    // script.src   = "sketch.js";    // use this for linked script
    // document.body.appendChild(script);
    $.getScript('sketch.js');
});



