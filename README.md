Task 1:

1) Create an API  to upload the attached XLSX/CSV data into MongoDB. (Please accomplish this using worker threads)
curl --location 'http://localhost:9090/api/upload' \
--form 'file=@"/Users/manojkumar/Downloads/data-sheet - Node js Assesment (2).csv"'


2) Search API to find policy info with the help of the username.
curl --location 'http://localhost:9090/api/policy/search/Phillip Neve'

3) API to provide aggregated policy by each user.
curl --location 'http://localhost:9090/api/policy/aggregate'

4) Consider each info as a different collection in MongoDB (Agent, User, User's Account, LOB, Carrier, Policy).


Task 2:

1) Track real-time CPU utilization of the node server and on 70% usage restart the server.
monitorAndRestartIfHigh(70); // restart if CPU > 70%

2) Create a post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.

curl --location 'http://localhost:9090/api/schedule' \
--header 'Content-Type: application/json' \
--data '{
  "message": "Notify user to renew policy 2",
  "day": "Saturday",
  "time": "16:27"
}
'