/*  main.js
    Appointment App
*/

document.addEventListener('DOMContentLoaded', () => {
    flatpickr('#appointment-date', {
        dateFormat: 'd-m-Y'
    });

    flatpickr('#appointment-time', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true
    });

    document.getElementById('appointment-form').addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        //Declare all variables
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const service = document.getElementById('service').value;
        const notes = document.getElementById('notes').value;
        const recurrence = document.getElementById('recurrence').value;
        const timezone = document.getElementById('timezone').value;
        const captcha = document.getElementById('captcha').value;
        const provider = document.getElementById('provider').value;

        //Error Messages
        document.getElementById('name-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('phone-error').textContent = '';
        document.getElementById('date-error').textContent = '';
        document.getElementById('time-error').textContent = '';
        document.getElementById('service-error').textContent = '';
        document.getElementById('captcha-error').textContent = '';

        if (!name) {
            isValid = false;
            document.getElementById('name-error').textContent = 'Name is required!';
        }

        if (!email) {
            isValid = false;
            document.getElementById('email-error').textContent = 'Email is required!'
        }

        if (!phone) {
            isValid = false;
            document.getElementById('phone-error').textContent = 'Phone Number is required';
        }

        if (!date) {
            isValid = false;
            document.getElementById('date-error').textContent = 'Date is required!'
        }

        if (!time) {
            isValid = false;
            document.getElementById('time-error').textContent = 'Time is required!'
        }

        if (!service) {
            isValid = false;
            document.getElementById('service-error').textContent = 'Service is required!'
        }

        if (!captcha || captcha !== '9') {
            isValid = false;
            document.getElementById('captcha-error').textContent = 'Captcha is required!'
        }

        //Handle confirmation
        if (isValid) {
            document.getElementById('confirm-name').textContent = 'name';
            document.getElementById('confirm-email').textContent = 'email';
            document.getElementById('confirm-phone').textContent = 'phone';
            document.getElementById('confirm-date').textContent = 'date';
            document.getElementById('confirm-time').textContent = 'time';
            document.getElementById('confirm-service').textContent = 'service';
            document.getElementById('confirm-notes').textContent = 'notes';

            document.getElementById('appointment-form').classList.add('hidden');
            document.getElementById('confirmation').classList.remove('hidden');

            scheduleReminder(email, date, time);
            addEventToGoogleCalendar(date, time, service);

        }
    });
})

//Schedule Reminder

function scheduleReminder(email, date, time) {
    const appointmentDateTime = new Date(`${date} T${time}`);
    const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);

    setTimeout(() => {
        sendEmailReminder(email, date, time);
    }, reminderTime - new Date());
}

//logic to send email reminder
function sendEmailReminder(email, date, time) {
    console.log(`Reminder: Appointment on ${date} at ${time}`);
}

//GoogleCalendar

function authenticateGoogleCalendar() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        console.log('Signed in');
    });
}

//Add Event to google Calendar

function addEventToGoogleCalendar(date, time, service) {
    const event = {
        summary: `Appointment: ${service}`,
        start: {
            dateTime: `${date} T${time}:00`,
            timezone: `Europe/Berlin`
        },
        end: {
            dateTime: `${date} T${time}:00`,
            timezone: `Europe/Berlin`
        }
    };

    gapi.client.calendar.events.insert({
        calendaId: 'primary',
        resourse: event
    }).then(response => {
        console.log('Event created:', response);
    });
}