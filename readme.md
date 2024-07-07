
## documentation on API is at:

https://documenter.getpostman.com/view/7992887/2sA3e1BVGk

## to start the application (on port 3000 for app or 3003 for test):
run start or test commands in package.json file 

alternatively you can run 
"npm install && _node $PWD/apps/client_app/client_app_" 
from command line
keep in mind for running the app you have to have **mongodb** installed on your system and the service should be running

Since this is a test environment, all keys have been included in the repository to avoid any inconvenience.

for testing the APIs, some routes need authorization, you can set the token from using the _Login route_ and set the _**token**_ parameter in the environment
