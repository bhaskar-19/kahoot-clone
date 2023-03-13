# Brainbuzz 

### Engage, Learn, and Have Fun with BrainBuzz
### Bring your lessons to life with interactive quizzes
### Create a interactive quiz and host, students can answer to those questions 


## Features

- Engage, Learn, and Have Fun with BrainBuzz like kahoot 
- Teacher can create a quiz and start game
- Student join a game using pin and answer to a question that Teacher hosted
- Can host multiple games at the same time
- Leaderboard


## API Reference

#### User signing up

```http
  POST /authentication/signup   
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `firstName` | `string` | **Required**. Users First Name|-
 `lastName` | `string` | **Required**. Users Last Name|-
 `email` | `string` | **Required**. Users Email|Email must be valid
`password`|`string`| **Required**. Users Password|Password must have min 8 characters
`role`|`enum`| **Required**. Users role|User must be student or teacher


#### User signing in

```http
  POST /authentication/signin
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `email` | `string` | **Required**. Users Email|Email must be valid
`password`|`string`| **Required**. Users Password|Password must have min 8 characters

#### User validate either he has authorized to access a resource

```http
  GET /authentication/validate
```

#### User to signing with google

```http
  GET /authentication/login
```

#### Choose role for Google signin user 

```http
  POST /authentication/updateRole
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `id` | `ObjectId` | **Required**. Users Id|-

 #### Choose role for Google signin user 

```http
  POST /authentication/updateRole
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `id` | `ObjectId` | **Required**. Users Id|-

#### Creating a quiz

```http
  POST /quiz/createQuiz
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `title` | `string` | **Required**. Quiz title|-
`questions`|`QuestionModel[]`| **Required**. Quiz Questions|Required atleast one questions
`creator`|`ObjectId`| **Required**. User Id|-|

#### Get a Quizzes of users

```http
  GET /quiz/quizzes/:creator
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `creator` | `ObjectId` | **Required**. User ID|-

 #### Get a Quizz using a quizId

```http
  GET /quiz/:quizId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-

 #### Updating a Quizz using a quizId

```http
  PUT /quiz/:quizId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-

 #### Delete a Quizz using a quizId

```http
  DELETE /quiz/:quizId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-


#### Get all questions of quiz

```http
  Get /quiz/:quizId/questions
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-

#### Get all questions of quiz

```http
  Get /quiz/:quizId/questions/:questionId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-
 `questionId` | `ObjectId` | **Required**. Question ID|-

#### Delete a question of quiz

```http
  DELETE /quiz/:quizId/questions/:questionId     
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-
 `questionId` | `ObjectId` | **Required**. Question ID|-

#### Delete a question of quiz

```http
  POST /:quizId   
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-


#### Update a question of quiz

```http
  PUT /:quizId/:questionId  
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-
`questionId` | `ObjectId` | **Required**. Question ID|-

#### Get a games of User

```http
  GET /:creator
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `creator` | `ObjectId` | **Required**. User ID|-

#### Get a Quizzes of game

```http
  GET /games/:quizId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-

#### Get a Players of game

```http
  GET /games/players/:quizId/:gameId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `quizId` | `ObjectId` | **Required**. Quiz ID|-
 `gameId` | `ObjectId` | **Required**. Quiz ID|-

#### Get a games that player played

```http
  GET /games/playerGames/:playerId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `playerId` | `ObjectId` | **Required**. Quiz ID|-


#### Get a Leaderboard of a batch

```http
  GET /games/batchBoard/:batchId
```

| Parameter | Type     | Description              | constraints
| :-------- | :------- | :------------------------- |:------------------------- |
 `playerId` | `ObjectId` | **Required**. Quiz ID|-




## Models
### Quiz
```js

const quizSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    creator :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }]
});
```
### Question
```js
const questionSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    options:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    }],
    correctOption:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    },
    quiz:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
});
```
### Option
``` js
const optionSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    isCorrect:{
        type: Boolean,
        required: true
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
});
```
### GoogleUser 

```js

const googleUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required : true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        default: 'student'
    }
});

```
### User

```js

    const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['teacher', 'student'],
        default: 'student'
    }
});

```

### Game

```js

const gameSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    games: [{
        batch:
        {
            type: String,
            required: true,
            unique: true
        },
        pin: 
        {
            type: Number,
            unique: true
        },
        players:[{
            playerId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: true
            }
    }]
}],
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    }
}, 
{ timestamps: true }
);

```
## Deployment

To deploy this project copy these following commands into a docker file

```bash
  #Define the docker image from the dockerhub
    FROM node:18

    # Create app directory
    WORKDIR /usr/src/app

    # Install app dependencies
    # A wildcard is used to ensure both package.json AND package-lock.json are copied
    # where available (npm@5+)
    COPY package*.json ./
    RUN npm install
    # For production RUN npm ci --only=production

    # Bundle app source
    COPY . .

    EXPOSE 3000

    #Define the command
    CMD [ "node", "index.js" ]
```
Run following command

```bash
    sudo docker built -t imagename

    sudo docker tag imagename dockerRepoName

    sudo docker push repoName
```

Pull this docker repository into your ec2 instance

```bash
    sudo docker pull dockerRepoName
```
Run following cmd to run your project

```bash
  sudo docker run -p 80:3000 -t dockerRepoName
```
