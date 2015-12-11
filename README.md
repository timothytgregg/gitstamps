# gitstamps
Group Project 3, WDI7 General Assembly
Chase, Tim, Thomas, Alexis

[Trello board](https://trello.com/b/HpXn3C3N/gitstamps)

### Install locally
1. Fork and clone this repo
2. cd into directory
3. `npm install`
4. start instance of `mongod`
5. run `nodemon index.js`
6. view on `localhost:3000`

# Overview
The basic idea of Gitstamps is simple: you enter any github user's login name on the front-end and press enter.  That name is then sent as a post request to the back-end, where a profile is created and added to our database.  The back-end then responds to the front end with json, which is rendered for the user.

Once a profile is created, the user can make a new stamp by clicking a button next to each profile.  This button also sends a post request to the back end containing the profile's name.  On the back end, we use this name to make a series of api calls to github (explicated below).  Once the calls return, we store all that information in our  

# Getting Data From Github
When the back end of our app receives a post request asking for a new stamp, we make a series of calls to github's api in order to populate the new stamp with data.  These calls are made from inside the profilesController.  All of the functions that actually interact with github's api are imported from schemaMethods.

### To summarize how these calls work:
1. First, we send a single request to github's api asking for all of the repos located on a specific user's account.  The getRepoNamesChain function in schemaMethods makes this call.  getRepoNamesChain returns a promise which resolves as an array of repo names.
2. Next, we take that array of names and call a second method, called checkAuthors.  This method makes a separate call for each repository name on the array and checks the collaborators list.  If the user we're searching for isn't on that list, the repo name is removed from the array.  The revised array is then returned in a promise so it can be used in the next step.
3. Next, we take the revised list of repo names (still an array of strings) and make a call to each repo on the list asking for all commits.  We then go through every commit message and check to make sure that the user we're searching for is the author.  We then construct an object where the keys are repo names and the values are arrays of messages for that repo.  This object is returned in a promise, along with the array of repo names that will be used in the next step.
4. Next, we make a second series of calls to each repo on the repo names array, this time getting language data from each repo.  We then construct a second object where the keys are repos and the values are object containing the byte distribution of languages on that repo.  We return this object in a promise.
5. At this stage, we have all the information we need from github, so we begin modifying the stamp object.  First, we save both objects to the stamp (under stamp.data.commitMessages and stamp.data.languages).  Then, we use three more functions (also located in schemaMethods) to perform some quick operations on these large objects.  We find the total language distribution across all repos, the total bytes for each language across all repos, and the average commit message length across all repos.  These statistics are then saved to the stamp.  The stamp is then pushed onto the parent profile, and we respond with json to the front end so the new stamp can be rendered.
6. This means that we make a total number of calls equal to num_repos*3+1.  So if a user has the maximum of 100 repos and is a contributor on all of them, we would end up making 301 calls to github in order to populate a stamp.
