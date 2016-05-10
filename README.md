# Survey App 

This is a simple survey app as a response to a coding challenge from AppSumo. This survey is a Node.js 
application that uses Express, AngularJS, SequelizeJS, and MySQL. 

Each user that visits the survey in a browser will be presented with a random survey question, 
which he or she can answer. Once answered, the question will not be presented to the same user as 
long as the session is active. When the user has answered all of the survey questions, the survey 
page will tell the user that there are no more questions to answer. 

An admin can login to an login secured interface where survey questions can be added, edited, and deleted. 
He or she can also view responses for each of the survey questions. Unedited answers that belong 
to an edited question will maintain response data. It is assumed that completely new questions
will be added and not created through modification of an existing question. The admin can add as
many answers as he or she would like, but any answers left blank will be ignored and will not be inserted into the database. 

## How to use the survey app 

Clone the app-sumo-survey repository.

	git clone https://github.com/humphrieslk/app-sumo-survey.git

Run `npm install` to grab the depdencies. Node.JS v0.10.36 was the latest stable version when this app was created. Plase note you may need to be logged in as root in order to install dependencies.

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

You do not need to do anything other than create the database, create a user, and make sure your IP address is authorized to access your database. The sequelizeJS code in this application will create the tables for you.

## Running the app  

Run as you would any Node.js app from the app's directory

	node app.js

To login to the admin interface, simply go to http://localhost:3000/nigol

## Running the app on your server

If you want to run this app on your server (depending on how you have it set up), you may need to add a reverse proxy to redirect your web traffic to port 3000 where this app runs. If you're using apache, you will want something like this, which you should add to your httpd.config.

    <VirtualHost *:80> 
      ProxyPreserveHost On
      ProxyRequests Off
      ServerName www.example.com
      ServerAlias example.com
      ProxyPass / http://localhost:3000/example/
      ProxyPassReverse / http://localhost:3000/example/
    </VirtualHost> 

If you would also like for the app to automatically restart upon server reboot, then you can add this run-node-forever script to your /etc/init.d directory. 

    #!/bin/bash
    #
    #	/etc/rc.d/init.d/run-node-forever
    # chkconfig: 2345 05 42
    # description:  Will start survey node app forever
    #
    # <tags -- see below for tag definitions.  *Every line* from the top
    #  of the file to the end of the tags section must begin with a #
    #  character.  After the tags section, there should be a blank line.
    #  This keeps normal comments in the rest of the file from being
    #  mistaken for tags, should they happen to fit the pattern.>

    # Source function library.
    . /etc/init.d/functions

    NODE_ENV=production /path/to/forever/script start /path/to/file/app.js
    

You will need to change the paths to actual paths in your file system. The first is the actual path to forever, while the second is the path to your app.

After you've saved the file, add it to chkconfig by running `chkconfig --add run-node-forever.sh`. Note, if you've named your script something else, just replace `run-node-forever.sh` with `your-script-name.sh`.

Test by rebooting the server and running `forever list`. You should see your app running. If it isn't, give it a few more seconds as it should start within 5 seconds of the server reboot.   