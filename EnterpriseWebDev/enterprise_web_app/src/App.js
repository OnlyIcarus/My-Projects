import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'
import $ from 'jquery'

export default function App() {
  //List of constant variables for text fields within document
  const usernameRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()
  const loginEmailRef = useRef()
  const loginPassRef = useRef()
  const casualWorkersRef = useRef()
  const casualWorkerPayRef = useRef()
  const averageCasualHoursRef = useRef()
  const standardWorkersRef = useRef()
  const standardWorkerPayRef = useRef()
  const averageStandardHoursRef = useRef()
  const expertWorkersRef = useRef()
  const expertWorkerPayRef = useRef()
  const averageExpertHoursRef = useRef()
  const quoteName = useRef()
  const physicalAssetsRef = useRef()
  let updating = false;
  let updateId;
  let holdEmail;

  //Function to send api call registering the user
  function handleRegister() {
    let username = usernameRef.current.value
    let password = passwordRef.current.value
    let email = emailRef.current.value

    fetch("api/users",
      {
        headers: { 'Content-Type': 'application/json' },
        type: 'cors',
        method: "POST",
        body: JSON.stringify({ name: username, password: password, email: email })
      }).then(function (response) {
        alert("Succesfully Registered User");
      }).catch(function (error) {
        alert("Something went wrong, please try again");
      })

  }

  //Function to hide registration page and show login page
  function switchPageLogin() {
    if (document.getElementById('register-container')) {

      if (document.getElementById('register-container').style.display === 'none') {
        document.getElementById('register-container').style.display = 'block';
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('register-button').textContent = 'Already a User? Login Here';
      }
      else {
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('register-button').textContent = 'Back to Registration';
      }
    }
  }

  //Function to send API call to login to page, if succesful will hide login containers and show the main site
  function handleLogin() {
    const email = loginEmailRef.current.value;
    const password = loginPassRef.current.value;

    fetch("auth/signin",
      {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ email: email, password: password })
      }).then(function (response) {
        if (response.status === 401) {
          alert("Wrong email and password combination");
        } else {
          alert("You have logged in succesfully");
          holdEmail = loginEmailRef.current.value;
          document.getElementById('register-container').style.display = 'none';
          document.getElementById('login-container').style.display = 'none';
          document.getElementById('register-button').style.display = 'none';
          document.getElementById('main-body').style.display = 'block';
          quoteTable(email);
        }
      })
  }

  //Function to send API call to logout of page, if alert is responded with OK then will hide page and show registration page
  function handleSignout() {
    if (window.confirm('Are you sure you want to sign out?') === true) {
      console.log('Signed Out')
      fetch("auth/signout",
        {
          headers: { 'Content-Type': 'application/json' },
          method: "GET"
        }).then(function (response) {
          alert('Succesfully signed out')
          document.getElementById('register-button').textContent = 'Already a User? Login Here';
          document.getElementById('register-container').style.display = 'block';
          document.getElementById('register-button').style.display = 'block';
          document.getElementById('signout-button').style.display = 'none';
          document.getElementById('main-body').style.display = 'none';
        })
    } else {
      return;
    }
    return;
  }

  //Function to save quote to database
  function saveQuote() {
    //List of variables for text fields
    const name = quoteName.current.value;
    const casualWorkers = casualWorkersRef.current.value;
    const casualWorkerPay = casualWorkerPayRef.current.value;
    const averageCasualHours = averageCasualHoursRef.current.value;
    const standardWorkers = standardWorkersRef.current.value;
    const standardWorkerPay = standardWorkerPayRef.current.value;
    const averageStandardHours = averageStandardHoursRef.current.value;
    const expertWorkers = expertWorkersRef.current.value;
    const expertWorkerPay = expertWorkerPayRef.current.value;
    const averageExpertHours = averageExpertHoursRef.current.value;
    const email = holdEmail;

    //Check to see if this is an update or a new quote, if new quote send new quote
    if (updating === false) {
      fetch("api/quote",
        {
          headers: { 'Content-Type': 'application/json' },
          type: 'cors',
          method: "POST",
          body: JSON.stringify({
            name: name,
            email: email,
            casual_workers: casualWorkers,
            casual_worker_pay: casualWorkerPay,
            average_casual_hours: averageCasualHours,
            standard_workers: standardWorkers,
            standard_worker_pay: standardWorkerPay,
            average_standard_hours: averageStandardHours,
            expert_workers: expertWorkers,
            expert_worker_pay: expertWorkerPay,
            average_expert_hours: averageExpertHours
          })
        }).then(function (response) {
          alert("Succesfully Input Quote");
        }).catch(function (error) {
          alert("Something went wrong, please try again");
        })
      quoteTable(email);
    } else { //If this is an update, send update
      fetch("api/quote/" + updateId,
        {
          headers: { 'Content-Type': 'application/json' },
          type: 'cors',
          method: "PUT",
          body: JSON.stringify({
            name: name,
            email: email,
            casual_workers: casualWorkers,
            casual_worker_pay: casualWorkerPay,
            average_casual_hours: averageCasualHours,
            standard_workers: standardWorkers,
            standard_worker_pay: standardWorkerPay,
            average_standard_hours: averageStandardHours,
            expert_workers: expertWorkers,
            expert_worker_pay: expertWorkerPay,
            average_expert_hours: averageExpertHours
          })
        }).then(function (response) {
          alert("Succesfully Updated Quote");
          updating = false;
        }).catch(function (error) {
          alert("Something went wrong, please try again");
        })
      quoteTable(email);
    }
  }

  //Function to check all quotes registered by this email, and then append each to the table adding relevant buttons
  function quoteTable(email) {
    $("#quote-tbody tr").remove();
    fetch("api/list/" + email,
      {
        headers: { 'Content-Type': 'application/json' },
        type: 'cors',
        method: "GET",
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          let tBody = document.getElementById('quote-tbody');
          let newRow = tBody.insertRow();
          let newCell = newRow.insertCell();
          let name = document.createTextNode(data[i].name);
          let newCellTwo = newRow.insertCell();
          let id = document.createTextNode(data[i]._id);
          let newCellThree = newRow.insertCell();
          let update = document.createElement('input');
          update.type = "button";
          update.value = "Update";
          update.onclick = (function () { //Update function, sets text fields to appropriate values and changes saves button to update button
            updating = true;
            updateId = data[i]._id;
            $("#quote-name").val(data[i].name);
            $("#casual-workers").val(data[i].casual_workers);
            $("#casual-worker-pay").val(data[i].casual_worker_pay);
            $("#average-casual-hours").val(data[i].average_casual_hours);
            $("#standard-workers").val(data[i].standard_workers);
            $("#standard-worker-pay").val(data[i].standard_worker_pay);
            $("#average-standard-hours").val(data[i].average_standard_hours);
            $("#expert-workers").val(data[i].expert_workers);
            $("#expert-worker-pay").val(data[i].expert_worker_pay);
            $("#average-expert-hours").val(data[i].average_expert_hours);
          });
          let newCellFour = newRow.insertCell();
          let remove = document.createElement('input');
          remove.type = "button";
          remove.value = "Delete";
          remove.onclick = (function () { //Delete function, should send api call to delete from database, and delete the table entry, however does not work, probably backend
            if (window.confirm("Are you sure you want to delete this quote?") === true) {
              console.log("accepted");
              fetch("api/quote/" + data[i]._id,
                {
                  type: 'cors',
                  method: "DELETE",
                }).then(function (response) {
                  tBody.deleteRow(i);
                  alert("Succesfully Deleted Quote")
                }).then(function (error) {
                  alert("Something went wrong, please try again");
                })
            }
          });
          let newCellFive = newRow.insertCell();
          let calculate = document.createElement('input');
          calculate.type = "button";
          calculate.value = "Calculate";
          calculate.onclick = (function () { //Function to send API call to the calculate by quote ID function
            fetch("api/calculate/" + data[i]._id,
              {
                headers: { 'Content-Type': 'application/json' },
                type: 'cors',
                method: "GET",
              }).then(function (response) {
                return response.json();
              }).then(function (data) {
                alert("Budget for this quote: £" + data.toFixed(2))
              })
            })
            newCell.appendChild(name);
            newCellTwo.appendChild(id);
            newCellThree.appendChild(update);
            newCellFour.appendChild(remove);
            newCellFive.appendChild(calculate);
          }
    });
  }

  return (
    <div id="container">
      <div id="login-page">
        <div id="login-button-container">
          <div id="register-button" className="buttons" onClick={switchPageLogin}>Already a User? Login Here</div>
        </div>
        <div id="register-container">
          <div id="register-input">
            <input ref={usernameRef} type="text" placeholder="Username..." className="inputLogin" />
            <br />
            <input ref={passwordRef} type="password" placeholder="Password..." className="inputLogin" />
            <br />
            <input ref={emailRef} type="text" placeholder="E-Mail..." className="inputLogin" />
          </div>
          <button id="register-button" className="buttons" onClick={handleRegister}>Register</button>
        </div>
        <div id="login-container">
          <div id="login-input">
            <input ref={loginEmailRef} type="text" placeholder="Email..." className="inputLogin" />
            <br />
            <input ref={loginPassRef} type="password" placeholder="Password..." className="inputLogin" />
          </div>
          <button id="register-button" className="buttons" onClick={handleLogin}>Log In</button>
        </div>
      </div>
      <div id="main-body">
        <div id="calculate-form">
          <div id="inputs">
            <input id="quote-name" className="inputCalculate" ref={quoteName} type="text" placeholder="Name for your quote" />
            <br />
            <input id="casual-workers" className="inputCalculate topLine" ref={casualWorkersRef} type="number" placeholder="Number of Casual Workers" />
            <input id="casual-worker-pay" className="inputCalculate topLine" ref={casualWorkerPayRef} type="number" placeholder="Average pay for casual workers" />
            <input id="average-casual-hours" className="inputCalculate topLine hoursWidth" ref={averageCasualHoursRef} type="number" placeholder="Average hours worked by casual workers" />
            <br />
            <input id="standard-workers" className="inputCalculate" ref={standardWorkersRef} type="number" placeholder="Number of Standard Workers" />
            <input id="standard-worker-pay" className="inputCalculate" ref={standardWorkerPayRef} type="number" placeholder="Average pay for standard workers" />
            <input id="average-standard-hours" className="inputCalculate hoursWidth" ref={averageStandardHoursRef} type="number" placeholder="Average hours worked by standard workers" />
            <br />
            <input id="expert-workers" className="inputCalculate" ref={expertWorkersRef} type="number" placeholder="Number of Expert Workers" />
            <input id="expert-worker-pay" className="inputCalculate" ref={expertWorkerPayRef} type="number" placeholder="Average pay for expert workers" />
            <input id="average-expert-hours" className="inputCalculate hoursWidth" ref={averageExpertHoursRef} type="number" placeholder="Average hours worked by expert workers" />
          </div>
          <button id="calculate" className="buttons" onClick={saveQuote}>Save</button>
        </div>
        <table id="quote-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Calculate</th>
            </tr>
          </thead>
          <tbody id="quote-tbody">
          </tbody>
        </table>
        <div id="center">
          <div id="signout-button" className="buttons" onClick={handleSignout}>Sign Out</div>
        </div>
      </div>
    </div>
  )
}