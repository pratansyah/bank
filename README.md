## Simple Bank
A mockup for basic bank functionality which includes

### Menu
If you ever forget about the functionality of this then simply type `menu` to list all available commands

### Register
Register a new account using following command
```
register
```
You will be taken through the process of registering a new account via prompts

### Login
Include your username in the command when you want to login
```
login foo
```
It will then ask your password, and don't worry the password is masked in the prompt

### Logout
```
logout
```
The opposite of login, I guess

### Deposit
Deposit to your account via command below
```
deposit [amount]
```
If you have any outstanding debt then the money will be automatically transfered to creditor(s) with FIFO order

### Transfer
Transfer your money to another account using command below
```
transfer [destination username] [amount]
```
You can transfer more than what you have in your account but it will be listed as debt

### Exit
To exit the app gracefully type
```
exit
```


## Technical Information
Below are some technical information about this repo

### Stack Used
- Written in Typescript
- sqlite3, chosen because of simplicity and portability
- eslint for linter
- bcrypt for hashing password
- typeorm
- readline-sync for prompting user
- jest and sinon for testing
- colors :rainbow:

### Installation
type `make` in root folder to install all dependencies, transpile to js, and run the app

### Test
```
yarn test --coverage
```
Above command will run the test and show the coverage report

### Watch
Since this is a typescript repo, then we need to transpile it to js before we run and it could be an annoying thing to do it again and again every time the codes changed.
To lessen that annoyment, you can run below command in another terminal session
```
yarn watch
```
That will spawn a watcher that will automatically transpile the codes everytime a file is changed. However this will not run eslint

### Build
Standardize your codes and transpile it to js into dist/ folder which then we can run
```
yarn build
```

### Run
```
yarn start
```
This will execute transpiled codes in dist folder with dist/index.js as entry point