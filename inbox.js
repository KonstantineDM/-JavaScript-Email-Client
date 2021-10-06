document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // By default, load the inbox and click its button, to request and show all inbox emails
  load_mailbox('inbox');
  document.getElementById('inbox').click();

})

// Show a 'compose email' view and a button to send composed email
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Send email
  document.querySelector('#compose-view form').onsubmit = function() {
    send_email();
    // After sending email, display 'sent' mailbox
    load_mailbox('sent');
    // Request the database for 'sent' contents
    function click_1() {document.getElementById('sent').click()};
    setTimeout(function() {
      click_1();
    }, 200);

    return false
  };

}

// Show a 'mailbox's view (inbox, sent or archive)
function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Display all emails in mailbox (inbox, sent, archive)
  document.querySelectorAll('.container button').forEach(mailbox_type => {
    document.querySelector(`#${mailbox_type.id}`).onclick = function() {
      fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
        emails.forEach(email => {

          // Create HTML elements for email (wrapper) and email's attributes
          const email_wrapper = document.createElement('div');
          email_wrapper.setAttribute('class', 'email-wrapper');

          const sender = document.createElement('div');
          sender.setAttribute('class', 'email-sender');

          const subject = document.createElement('div');
          subject.setAttribute('class', 'email-subject');

          const timestamp = document.createElement('div');
          timestamp.setAttribute('class', 'email-timestamp');

          subject.innerHTML = `${email.subject}`;
          timestamp.innerHTML = `${email.timestamp}`;

          // mailbox type defines whether sender or recipient will be displayed
          // in each row of mailbox view
          if (mailbox === 'sent') {
            sender.innerHTML = `${email.recipients}`;
          } else {
            sender.innerHTML = `${email.sender}`;
          }

          email_wrapper.appendChild(sender)
          email_wrapper.appendChild(subject)
          email_wrapper.appendChild(timestamp)
          document.querySelector('#emails-view').append(email_wrapper);

          // If email was read - add 'read' to its class list (css will change the color accordingly)
          if (email.read) {
            email_wrapper.classList.add('read');
          }
               
          // open an email when clicked on
          email_wrapper.addEventListener('click', function() {
            view_email(email.id, mailbox);
            // Mark email as 'read'
            mark_read(email);

          });

        });
      });
    };
    
  });

}

// Show contents of one chosen email
function view_email(email_id, mailbox) {

  // Remove previous content of #emails-view
  document.querySelectorAll('#emails-view *').forEach(e => e.remove());
  
  // Create a 'reply' and 'archive/unarchive' buttons, if not in the 'sent' mailbox
  if (mailbox !== 'sent') {
    // reply
    var reply = document.createElement('button');
    reply.setAttribute('class', 'btn btn-sm btn-outline-primary');
    reply.setAttribute('id', 'reply');
    reply.innerHTML = 'Reply';

    // archive
    var archive = document.createElement('button');
    archive.setAttribute('class', 'btn btn-sm btn-outline-warning archive');
    archive.setAttribute('id', 'to-from-archive');

  } else {
    var reply = '';
    var archive = '';
  }
  
  // Fetch contents of single email
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {

    // Create all new html elements for the chosen email
    const email_wrapper = document.createElement('div');
    email_wrapper.setAttribute('class', 'email-single-wrapper');

    const sender = document.createElement('div');
    const recipients = document.createElement('div');
    const subject = document.createElement('div');
    const timestamp = document.createElement('div');
    const divider = document.createElement('hr'); // horizontal dividing line between emails
    const body = document.createElement('div');

    sender.innerHTML = `From: ${email.sender}`;
    recipients.innerHTML = `To: ${email.recipients}`;
    subject.innerHTML = `Subject: ${email.subject}`;
    timestamp.innerHTML = `Timestamp: ${email.timestamp}`;
    body.innerHTML = `${email.body}`;
    
    // Text inside "archive/unarchive" button
    if (email.archived) {
        archive.innerHTML = 'Unarchive';
      } else {
        archive.innerHTML = 'Archive';
    }
    

    // Place 'reply' and 'archive/unarchive' buttons on screen
    if (reply, archive) {
      email_wrapper.append(sender, recipients, subject, timestamp, reply, archive, divider, body);
    } else {
      email_wrapper.append(sender, recipients, subject, timestamp, divider, body);
    }

    // Display chosen email
    document.querySelector('#emails-view').append(email_wrapper);

    // functionality of 'reply' button inside email
    if (reply) {
      reply.onclick = function() {
        compose_email();
        document.querySelector('#compose-recipients').value = `${email.sender}`;
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
      };
    }

    // functionality of 'archive/unarchive' button inside email
    if (archive) {
      archive.onclick = function() {
        mark_archived(email);
        load_mailbox('inbox');
        document.getElementById('inbox').click();
      };
    }
  });
}

// Make request to "send" composed email
function send_email () {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value,
    })
  });
}

// Mark email as "read"
function mark_read(email) {
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
}

// Mark email as "archived" or "unarchived"
function mark_archived(email) {
  if (!email.archived) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  } else {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
  }
}
