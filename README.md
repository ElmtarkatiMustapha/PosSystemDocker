# run client side 
1- go to the client-side folder
[cmd]: cd client-side

2- change the url of the api
    - go to the file client-side/src/assets/js/global.js
    - change the 'BACK_END_LINK' to 'const BACK_END_LINK = "http://localhost:8000";'
3- run the start command
[cmd]; npm run dev

# run server side (back-end)
1- go to the server-side folder
[cmd]: cd server-side

2- set the content of .env (database access)

2- run the server side
[cmd]: php artisan serve

# Manual project building 
## 1/ client-side
    1.1- go to the client-side folder
        [cmd]: cd client-side
    1.2- change the url of the api
        - go to the file client-side/src/assets/js/global.js
        - change the 'BACK_END_LINK' to 'const BACK_END_LINK = "";'
    1.3- run build command;
        [cmd]: npm run build
## 2/ server-side
    2.1- copy the content of the folder client-side/dist (generated from build stage)
    2.2- past the /dist content to server-side/public 
    2.2- past the /dist content to server-side/resources/dist
## 3/ result
    so now you can use the server-side content as a full-project 
    1- go to the server-side folder
        [cmd]: cd server-side
    2- run the server side
        [cmd]: php artisan serve
    the project will be acceessible on http://localhost:8000

# docker project building 
1- rename .env.docker to .env
2- build docker project (on racine folder /)
[cmd]: docker compose build
3- run docker containers
[cmd]: docker compose up -d
# result
the project will be available on http://localhost
