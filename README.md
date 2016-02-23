# Version 2.0

## Description
Version 2.0 adds more CRUD functionality.  Previously you added R (Read), and now you will be adding Create and Delete functionality. You will now be adding records to a database via the LearningFuze SGT API. 
- This version will 
  - add onto your existing add functionality.  So it should not only add the student locally, but also send them to the server.
  - delete an existing student from the database.  This should build off your existing delete functionality.  Remember to take into account a useful User Experience when planning out how to tie in the delete functionality.

## Getting Started
> - Do you have the latest changes on your master branch?
    - **No** - talk with an instructor
    - **I don't know** - talk with an instructor
    - **Yes** - Move on to Pull Latest Changes
> - Are you on your master branch?
    - **Yes** - continue to "Pull Latest Changes"
    - **I dont know** Run the command below
        - `git branch` - this will highlight the branch you are currently on
    - **No** - Make sure you `git add .` and `git commit` to your current branch before you switch to your master branch
> - Pull Latest Changes
        - `git checkout master`
        - `git pull origin master`
> - Create the new feature branch
    - `git checkout -b v2.0`
> - Work on the scope defined <a href="https://github.com/Learning-Fuze/SGT/tree/v2.0#scope">Below</a>
> - Add files to git
    - `git add .`
> - Commit files (Group files together)
    - `git commit -m "SGT v2.0 - Your Name"`
    - **Replace "Your Name" with your first and last name**
> - Send to gitHub (Push)
    - `git push origin v2.0`
> - Create pull request
    - Pull request should be made from v2.0 to **your repository's/teams** master branch


## Scope
> - HTML
    - (optional) Add a modal to handle error messages, if doing optional error handling
    - (optional) Add button "waiting" marker of some sort.  For example a spinner.  Spinner should conceivably be placed in or on the button.  This is for optional error handling.
> - JS Functionality
    - Activate the load function (from the DB, made in v1.0) on document load.
    - Ensure that your load function records the student's ID, given to you by the database.  This will be important for future interaction with the student, such as deletion or updating.
    - On creating a new student, also send the new student data to the server
        - API URL: `s-apis.learningfuze.com/sgt/create`
            - method: post
            - input:
                - api_key: (string) your api key
                - name: (string) the student's name
                - course: (string) the course the student is taking
                - grade: (number) the student's grade for the course
            - output:
                - success: (boolean) whether the operation succeeded
                - errors (optional): (array) an array with all errors that occurred
                - new_id: (number) The ID of the new student in the database.
    - On deleting a student, also request the deletion of the student on the database
        - API URL: `s-apis.learningfuze.com/sgt/delete`
            - method: post
            - input:
                - api_key: (string) your api key
                - student_id: (number) the ID of the student within the database
            - output:
                - success: (boolean) whether the operation succeeded
                - errors (optional): (array) an array with all errors that occurred
                
                
###Optional : Error state checking
        - It is necessary to adequately handle failure.  For example
            - the server could fail to respond
            - your internet connection might go down
            - you might be be unauthorized to perform the action you are attempting to do. 
            - it might just take a really long time to process your request.  Do you want your user wondering what is happening for multiple seconds, not knowing if the button press worked or not?
        - API URL: any, will work with any API call
        - method: same as the API call you are doing
        - input:
            - force-failure (additional)(optional): (string) a string consisting of one of three values:
                - 'server': force a server failure (error 500).  Server will not respond with ANY data except the error code (as opposed to 200 / 304).
                - 'request': the request failed.  This mimics any number of errors, from deleting a student that doesn't exist, to trying to add a student when you don't have access, to the database being offline.
                - 'timeout': force the request to take 10 seconds.  No answer will be given for 10 seconds.  At that time, the normal operation will occur.
            
        



    

