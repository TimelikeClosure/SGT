# Version 1.0

## Description
Version 1.0 picks up where 0.5 left off. You will now be populating records from a database via the LearningFuze SGT API. This version will only be pulling entries, you will not be adding anything to the database for this version. You should still be able to add entries locally as you did before.

## Getting Started
> - Do you have the latest changes on your v0.5 branch?
    - **No** - talk with an instructor
    - **I don't know** - talk with an instructor
    - **Yes** - Move on to Pull Latest Changes
> - Are you on your v.5 branch?
    - **Yes** - continue to "Pull Latest Changes"
    - **I dont know** Run the command below
        - `git branch` - this will highlight the branch you are currently on
    - **No** - Make sure you `git add .` and `git commit` to your current branch before you switch to your v.5 branch
> - Pull Latest Changes
        - `git checkout v0.5`
        - `git pull origin v0.5`
> - Create a the feature branch
    - `git checkout -b v1.0`
> - Work on the scope defined <a href="https://github.com/Learning-Fuze/SGT/tree/v1.0#scope">Below</a>
> - Add files to git
    - `git add .`
> - Commit files (Group files together)
    - `git commit -m "SGT v1.0 - Your Name"`
    - **Replace "Your Name" with your first and last name**
> - Send to gitHub (Push)
    - `git push origin v1.0`
> - Create pull request
    - Pull request should be made from v1.0 to **your repository's/teams** master branch


## Scope
> - HTML
    - In the index.html file add a third button below the add and cancel buttons
        - Make sure the button has the same styling as the other two and fits in with the overall design
        - The button should say something along the lines of "Get data From Server"
> - JS Functionality
    - Add a click handler to your newly created button
        - Using the LearningFuze SGT API pull records from the DB using an AJAX call
        - With the object you get back from the API find the proper data to add to your SGT
    - API URL: `s-apis.learningfuze.com/sgt/get`
        - input:
            api_key: (string) your api key
        - output:
            success: (boolean) whether the operation succeeded
            data: (array) every student available on the database
    

