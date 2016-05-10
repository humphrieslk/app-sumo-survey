# Survey App 

This is a simple survey app as a response to a coding challenge from AppSumo. This survey is a Node.js 
application that uses Express, AngularJS, SequelizeJS, and MySQL. 

Each user that visits the survey page of the application will be presented with a random survey question, 
which he or she can answer. Once answered, the question will not be presented to the same user as 
long as the session is active. When the user has answered all of the survey questions, the survey 
page will tell the user that there are no more questions to answer. 

An admin can login to an secured admin interface where survey questions can be added, edited, and deleted. 
He or she can also view responses for each of the survey questions. Unedited answers that belong 
to an edited question will maintain response data. It is assumed that completely new questions
will be added and not created through modification of an existing question. The admin can add as
many answers as he or she would like, but no question will be allowed to have less than one answer. Any answers left blank will be ignored and will not be inserted into the database. 

## How to use the survey app 

Clone the app-sumo-survey repository.

	git clone https://github.com/humphrieslk/app-sumo-survey.git

Run `npm install` to grab the depdencies. Node.JS v0.10.36 was the latest stable version when this app was created. 

## Config Files

For security reasons, the true contents of the config/config.json file have been left out of this repository. If you 
would like to set up this app on your local machine or server, you will need to edit the config.json file 
values for your database. The config.json file has the following format.
		 
	{
 		 "development": {
    			"username": "DATABASE_USERNAME",
    			"password": "DATABASE_PASSWORD",
    			"database": "DATABASE_NAME",
    			"host": "DATABASE_IP",
    			"dialect": "mysql",
    			"port": "3306"
  		},
  		"production": {
    			"username": "DATABASE_USERNAME",
    			"password": "DATABASE_PASSWORD",
    			"database": "DATABASE_NAME",
    			"host": "DATABASE_IP",
    			"dialect": "mysql",
    			"port": "3306"
  		}
	}

You do not need to do anything other than create the database and create a user. The sequelizeJS code in this 
application will create the tables for you.

## Running the app  

Run as you would any Node.js app from the app's directory

	node app.js
