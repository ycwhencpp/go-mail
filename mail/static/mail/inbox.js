document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#check_email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // posting the data through api after the form has been submitted.
  document.querySelector('#compose-form').onsubmit = ()=>{

    // getting all the value of the compose form.
    const subject = document.querySelector("#compose-subject").value;
    const body = document.querySelector("#compose-body").value;
    const recipients = document.querySelector("#compose-recipients").value;

    // fetching api but with POST method and adding data to the api.
    fetch('/emails',{
      method: "POST",
      body: JSON.stringify({
        recipients:recipients,
        subject:subject,
        body:body,
      })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
  // loading sent mailbox after submititng the form 
  load_mailbox('sent');

  };
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#check_email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // fetching emails from the api 
  fetch(`/emails/${mailbox}`)
  .then( response => response.json())
  .then( emails => {
    
    // creating master div that will contain all the email divs inside
    var div = document.createElement("div");
    div.classList="emails";

   // trasvering each email from the list of emails we got from api.
   emails.forEach(email => {

    // creating a email div that will conatin the info about that email
    var email_div=document.createElement("div");
    email_div.classList="email";

    // checking if email has been read or not 
    email.read ? email_div.style.background="#DCDCDC" : email_div.style.background="white"

    // creating data inside the email div.
    email_div.innerHTML=`<p class="email_basic"> <strong>${email.sender}</strong>
            <span class="subject"> ${email.subject.charAt(0).toUpperCase()+ email.subject.slice(1)} </span>
            <span class="date">${email.timestamp}</span>
            </p>`

    // appending the email_div to the master div.
    div.appendChild(email_div)

    // showing user info about email when they click on it
    email_div.onclick=() => {

      fetch(`/emails/${email.id}`,{
        method:"PUT",
        body:JSON.stringify({
          "read":true
        })
      });
      document.querySelector('#check_email').style.display = 'block';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#emails-view').style.display = 'none';

      fetch(`/emails/${email.id}`
      )
      .then(response => response.json())
      .then(email => {

        email.read=true;
        console.log(email);
        var view_email= `<p class="email_info"><strong>From:</strong> ${email.sender}</p>
                         <p class="email_info"><strong>To:</strong> ${email.recipients}</p>
                         <p class="email_info"><strong>Subject:</strong> ${email.subject}</p>
                         <p class="email_info"><strong>Timestamp:</strong> ${email.timestamp}</p>
                         <a href="#" class="btn btn-sm btn-outline-primary" role="button">Reply</a>
                         <hr>
                         <p class="email_info">${email.body}</p>`
                         

        document.querySelector('#check_email').innerHTML=view_email;
  
      })
  
    };
    });

    // now appending the master email to our main body div.
    document.querySelector("#emails-view").appendChild(div);
   });
 



};
