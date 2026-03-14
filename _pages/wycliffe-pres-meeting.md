---
layout: page
permalink: /wycliffe/
title: 
pretty_table: true
nav: false
nav_order: 0
---

<div class="container my-5">
  <div class="row align-items-center">
  <!-- Text Column -->
    <div class="col-md-8">
      <h1 class="display-4" style="font-variant: small-caps;">
        Wycliffe Presbytery Meeting
      </h1>
      <p class="lead mb-1" style="color: #2698ba;">
        Spring 2026
      </p>
      <br>
      <p>
        20-21 April 2026<br>
        <em><a href="https://gcov.org">Grace Covenant Presbyterian Church</a></em><br>
        Nacogdoches, Texas
      </p>
    </div>

  <!-- Image Column -->
    <div class="col-md-4 text-center">
     <img 
       src="/assets/img/gcpc-logo.jpg" 
       alt="Rev. Dr. Robbie Crouse" 
       class="img-fluid rounded-circle"
       style="max-width: 250px;"
     >
   </div>
 </div>
</div>

<hr style="border: none; border-top: 0.2px solid #ccc; margin: 2rem 0;" />

This year marks the 1700th anniversary of the Council of Nicea. To celebrate and commemorate this event, GCPC is hosting a time of learning and fellowship led by Rev. Dr. Robbie Crouse, who will be teaching on the place and importance of confessions, traditions, and the past, and then honing in on the Nicene Creed as a case study, with application to the Christian life. This is a rich opportunity to learn and grow. All are invited and encouraged to attend.

<br/>

<form id="rsvpForm" 
      class="p-4 rounded shadow-sm mx-auto" 
      style="max-width: 400px; background-color: var(--bs-body-bg);">
  <h3 style="text-align:center; color:#2698ba; margin-bottom:1rem;">Event Registration</h3>

  <div class="mb-3">
    <label for="name" class="form-label">Your name</label>
    <input type="text" class="form-control" id="name" name="name" required>
  </div>

  <div class="mb-3">
    <label for="phone" class="form-label">Phone number</label>
    <input type="tel" class="form-control" id="phone" name="phone" required>
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>

  <div class="mb-3">
    <label for="church" class="form-label">Name of your church</label>
    <input type="text" class="form-control" id="church" name="church" required>
  </div>

  <div class="mb-3">
    <label for="location" class="form-label">Location (City, State)</label>
    <input type="text" class="form-control" id="location" name="location" placeholder="e.g., Nacogdoches, TX" required>
  </div>

  <div class="mb-3">
    <label for="attendees" class="form-label">Number of attendees (delegates + wives/visitors)</label>
    <input type="number" class="form-control" id="attendees" name="attendees" min="1" required>
  </div>

  <div class="text-center">
    <button type="submit" class="btn px-4" id="submitBtn"
      style="background-color:#2698ba; border:none; color:white;">Submit</button>
  </div>
</form>

<div id="thankYou" class="text-center p-4 mx-auto" 
     style="display:none; opacity:0; transition:opacity 0.6s ease, transform 0.6s ease;
            background-color: rgba(38, 152, 186, 0.1);
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: scale(0.95);
            max-width: 500px;
            width: 100%;">
  <h5 style="color:#2698ba;">Thank you for your registration!</h5>
  <p>Your details have been recorded.</p>
</div>

<script>
  const form = document.getElementById("rsvpForm");
  const thankYou = document.getElementById("thankYou");
  const submitBtn = document.getElementById("submitBtn");

  if (localStorage.getItem("rsvpSubmitted_delegates") === "true") {
    form.style.display = "none";
    thankYou.style.display = "block";
    thankYou.style.opacity = 1;
    thankYou.style.transform = "scale(1)";
  }

  function handleSubmit(e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const formData = new FormData(form);

    // IMPORTANT: Replace this URL with your NEW Google Apps Script Web App URL
    fetch("https://script.google.com/macros/s/AKfycbyBKQOvT4O4uxn6hs6yzzOX3M9scfRH85Vt6EQgFVMJo5Wqv25U19TdIED6HWtN4F0yDw/exec", {
      method: "POST",
      body: formData
    })
    .then(response => {
      if (response.ok) {
        localStorage.setItem("rsvpSubmitted_delegates", "true"); 
        form.style.display = "none";
        thankYou.style.display = "block";
        setTimeout(() => {
          thankYou.style.opacity = 1;
          thankYou.style.transform = "scale(1)";
        }, 50);

        form.removeEventListener("submit", handleSubmit);
      } else {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
        alert("There was a problem submitting your RSVP. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error!", error.message);
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      alert("Network error. Please try again.");
    });
  }

  form.addEventListener("submit", handleSubmit);
</script>

<style>
.day-friday {
  background-color: #2698ba !important;
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;
}
.day-saturday {
  background-color: #2ca58d !important;
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;
}
.day-sunday {
  background-color: #d9822b !important;
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;
}
.row-alt {
  background-color: #f0f2f4;
}
@media (prefers-color-scheme: dark) {
  .row-alt {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>

<h2>Event Schedule</h2>
<div class="table-responsive">
  <table class="table">
    <tbody>
      <tr>
        <td rowspan="2" class="day-friday">Friday</td>
        <td>
          <div>Session 1</div>
          <small class="text-muted">7:00 PM – 7:50 PM</small>
        </td>
        <td>Why Church History?</td>
      </tr>
      <tr class="row-alt">
        <td>
          <div>Session 2</div>
          <small class="text-muted">8:00 PM – 9:00 PM</small>
        </td>
        <td>Why Creeds &amp; Confessions?</td>
      </tr>
      <tr>
        <td rowspan="3" class="day-saturday">Saturday</td>
        <td>
          <div>Fellowship</div>
          <small class="text-muted">8:00 AM – 8:30 AM</small>
        </td>
        <td>Coffee / light breakfast</td>
      </tr>
      <tr class="row-alt">
        <td>
          <div>Session 3</div>
          <small class="text-muted">8:30 AM – 9:45 AM</small>
        </td>
        <td>Why the Nicene Creed?: A Case Study</td>
      </tr>
      <tr>
        <td>
          <div>Session 4</div>
          <small class="text-muted">10:00 AM – 11:30 AM</small>
        </td>
        <td>Why "begotten, not made"?: The Christological Claim</td>
      </tr>
      <tr class="row-alt">
        <td rowspan="2" class="day-sunday">Sunday</td>
        <td>
          <div>Sunday School</div>
          <small class="text-muted">9:45 AM – 10:30 AM</small>
        </td>
        <td>Why "one holy, catholic, and apostolic church"?: The Ecclesiological Claim</td>
      </tr>
      <tr>
        <td>
          <div>Sermon</div>
          <small class="text-muted"></small>
        </td>
        <td><i>Confessing the Faith</i>—Deuteronomy 26:1-11</td>
      </tr>
    </tbody>
  </table>
</div>