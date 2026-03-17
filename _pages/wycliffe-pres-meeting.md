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
        20-21 April<br>
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

<!-- Alert -->
<div class="text-center my-4">
  <div class="alert alert-danger d-inline-block mb-0" role="alert text-left">
    Please submit only ONE registration form per church.
  </div>
</div>

<!-- Form -->
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
    <input type="text" class="form-control" id="location" name="location" placeholder="e.g., Nacogdoches, Texas" required>
  </div>

  <div class="mb-3">
    <label for="attendees" class="form-label">Total number of attendees (delegates + wives/visitors)</label>
    <input type="number" class="form-control" id="attendees" name="attendees" min="1" required>
  </div>

  <div class="mb-3">
    <label for="notes" class="form-label">Notes</label>
    <textarea class="form-control" id="additional_info" name="notes" rows="4" placeholder="Include any additional information you would like us to know (e.g., names of attendees, etc.)."></textarea>
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
    fetch("https://script.google.com/macros/s/AKfycbwqRzLCOH08nJNAJduEhzzcHGvtXjVXhYB8tt3xxhHCVYjNk4vVVd51jL3TI0E3JoE8/exec", {
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

<br>

<div class="map-container mb-5 shadow-sm rounded mx-auto overflow-hidden" style="position: relative; padding-bottom: 50%; height: 0; max-width: 800px;">
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.414075003699!2d-94.61994632350161!3d31.595111774179856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8637897356100fed%3A0x92d67bb6f348b072!2sGrace%20Covenant%20Presbyterian%20Church!5e0!3m2!1sen!2sus!4v1773499279250!5m2!1sen!2sus" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
</div>