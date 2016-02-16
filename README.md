# Version 0.5

## Description
Version 0.5 starts where v.1 left off with adding in the delete functionality. When clicking on the delete button we need to add an event handler that will remove the current row
from the DOM only after we have successfully removed the object from the array.

## Getting Started
> - Do you have the latest changes on your v0.1 branch?
    - **No** - talk with an instructor
    - **I don't know** - talk with an instructor
    - **Yes** - Move on to Pull Latest Changes
> - Are you on your v.1 branch?
    - **Yes** - continue to "Pull Latest Changes"
    - **I dont know** Run the command below
        - `git branch` - this will highlight the branch you are currently on
    - **No** - Make sure you `git add .` and `git commit` to your current branch before you switch to your v.1 branch
> - Pull Latest Changes
        - `git checkout v0.1`
        - `git pull origin v0.1`
> - Create a the feature branch
    - `git checkout -b v0.5`
> - Work on the scope defined <a href="https://github.com/Learning-Fuze/SGT/tree/v.5#scope">Below</a>
> - Add files to git
    - `git add .`
> - Commit files (Group files together)
    - `git commit -m "SGT v0.5 - Your Name"`
    - **Replace "Your Name" with your first and last name**
> - Send to gitHub (Push)
    - `git push origin v0.5`
> - Create pull request
    - Pull request should be made from v0.5 to **your repository's/teams** master branch


## Scope
> - JS Functionality
    - Add an anonymous function as the click handler to the dynamically created delete button for each student row - (Event Delegation)
    - Delete button click handler function should have a call to removeStudent function that removes the object in the student_array
        - Suggested method
            - Using index of the row of the current button to remove from array
            - Store the index when adding to the DOM into a data attribute
    - Once the object has been removed from the array, remove the DOM element that is the parent of the delete button that was clicked.
