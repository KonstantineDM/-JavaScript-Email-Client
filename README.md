# [JavaScript] Email Client
An email client created only with JavaScript (and a tiny bit of CSS). 

The API for sending and receivin email was pre-created with django.


Created as part of my learning JavaScript according to Specification of "Project 3" of Harvard's course "CS50’s Web Programming with Python and JavaScript".
Intended for educational purposes only, as a personal perspective on a solution to this course's project (do not use this code if you are currently trying to figure the solution out, first try to solve everything yourself!).

`Mind that this is my first JavaScript project and thus is subject to contain bugs and/or ineffective code (probably a lot of). Although during my manual testing no bugs were revealed.`


Of course it is all client-side, no real emails are being sent. All users and their emails are stored in a django's database.

### Email cliet is able to:

Send Mail: When a user submits the email composition form, JavaScript 'sends' the email.

Mailbox: When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.

> Each email is rendered in its own div element, containing necessary email information. 
> Color of this div depends on wether the email was read or not (CSS is used to change style).

View Email: When a user clicks on an email, they are taken to a view with the content of that email.

> The view shows the email’s sender, recipients, subject, timestamp, and body.

Archive and Unarchive: Allow users to archive and unarchive emails that they have received.

> When viewing an Inbox email, the user is presented with a button that lets them archive the email. 
> When viewing an Archive email, the user is presented with a button that lets them unarchive the email. 
> This requirement does not apply to emails in the Sent mailbox.

Reply: Allow users to reply to an email.

> When viewing an Inbox or Archive email, the user is presented with a 'Reply' button that lets them reply to the email.
> When the user clicks the 'Reply' button, they are taken to the email composition form.
> The composition form is prefixed with 'Re:' and is pre-filled with the original email's data: sender/recipiets, subject, body.

P.S. All of the project's accompanying django code was created by course's authors and thus is irrelevant fot this JavaScript/CSS project (so I did not push it to repo). inbox.html template was added to help better understand the workings of inbox.js.
