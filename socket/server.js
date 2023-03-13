const Quiz = require('../models/quizSchema').quizModel;
const Question = require('../models/quizSchema').questionModel;
const Games = require('../models/gameSchema').Game;
const {LiveGames} = require('./utils/liveGames');
const {Players} = require('./utils/players');

const games = new LiveGames();
const players = new Players();


function socketImplementation(io)
{
    io.on('connection', (socket)=>{

        socket.on('host-join', async(data)=>{
            try
            {
               
                const quiz = await Quiz.findById(data.id).populate({
                    path: 'questions',
                    populate: {
                        path: 'options',
                        select: 'title'
                    }
                });
                if(!quiz)
                {
                    socket.emit('noGameFound');
                }
    
                const gamePin = Math.floor(Math.random() * 90000) + 10000+'';
                
                games.addGame(gamePin, socket.id,data.batch, false, {playersAnswered: 0, questionLive: false, gameId: data.id, question: 1});
    
                const game = games.getGame(socket.id);
    
                socket.join(game.pin);
    
                console.log('Game Created with pin: ', game.pin);
                socket.emit('showGamePin', {pin: game.pin});
            }
            catch(error)
            {
                console.error(error);
            }
            
        });

        socket.on('player-join', (formData)=>{
            try
            {
                let gameFound = false;
                for(let i=0; i<games.games.length; i++)
                {
                    if(formData.pin == games.games[i].pin)
                    {
                        console.log('Player connected to game');

                        const hostId = games.games[i].hostId;

                        players.addPlayer(hostId, socket.id, formData.name,formData.id, {score: 0, answer: 0});

                        socket.join(formData.pin);

                        const playersInGame = players.getPlayers(hostId);
                        io.to(formData.pin).emit('updatePlayerLobby', playersInGame);
                        gameFound = true;
                    }
                }

                if(gameFound == false)
                {
                    socket.emit('noGameFound');
                }
            }
            catch(error)
            {
                console.error(error);
            }
        });

        socket.on('startGame', ()=>{
            console.log('startGame');
            const game = games.getGame(socket.id);
            game.gameLive = true;
            socket.emit('gameStarted', game.hostId);
        });

        socket.on('host-join-game', async(hostId)=>{
            try
            {
                const oldHostId = hostId.id;
                const game = games.getGame(oldHostId);
                if(game)
                {
                    game.hostId = socket.id;
                    socket.join(game.pin);
                    const playersData = players.getPlayers(oldHostId);
                    for(let i=0; i<Object.keys(players.players).length; i++)
                    {
                        if(players.players[i].hostId == oldHostId)
                        {
                            players.players[i].hostId = socket.id;
                        }
                    }

                    const gameId = game.gameData.gameId;//geting quizId
                    
                    const questions = await Question.find({quiz:gameId}).populate({
                                                                            path: 'options',
                                                                            select: 'title'
                                                                        });
                    if(!questions)
                    {
                        socket.emit('noGameFound');
                    }
                    
                    const  pquestion = questions[0].title;
                    const  poption1 = questions[0].options[0].title;
                    const  poption2 = questions[0].options[1].title;
                    const  poption3 = questions[0].options[2].title;
                    const  poption4 = questions[0].options[3].title;
                    const correctOption = questions[0].correctOption;

                    socket.emit('gameQuestions', {
                        q1: pquestion,
                        op1: poption1,
                        op2: poption2,
                        op3: poption3,
                        op4: poption4,
                        correctOption: correctOption,
                        playersInGame: playersData.length,
                        questions: questions.length
                    });
                    io.to(game.pin).emit('gameStartedPlayer');
                    game.gameData.questionLive = true;
                }
            }
            catch(error)
            {
                console.error(error);
            }
        });

        socket.on('player-join-game', async (playerId)=>{
            try
            {
                const player = players.getPlayer(playerId);

                if(player)
                {
                    const game = games.getGame(player.hostId);
                    socket.join(game.pin);
                    player.playerId = socket.id;

                    const playerData = players.getPlayers(game.hostId);
                    socket.emit('playerGameData', playerData);
                    const gameId = game.gameData.gameId;//geting quizId
                        
                    const questions = await Question.find({quiz:gameId}).populate({
                                                                            path: 'options',
                                                                            select: 'title'
                                                                        });
                    if(!questions)
                    {
                        socket.emit('noGameFound');
                    }

                    const  pquestion = questions[0].title;
                    const  poption1 = questions[0].options[0].title;
                    const  poption2 = questions[0].options[1].title;
                    const  poption3 = questions[0].options[2].title;
                    const  poption4 = questions[0].options[3].title;
                    socket.emit('gameQuestions', {
                        q1: pquestion,
                        op1: poption1,
                        op2: poption2,
                        op3: poption3,
                        op4: poption4,   
                    });
                }
                else
                {
                    socket.emit('noGameFound');
                }
            }
            catch(error)
            {
                console.log(error);
            }
        });

        socket.on('playerAnswer', async(option)=>{
            try
            {
                const player = players.getPlayer(socket.id);
                const hostId = player.hostId;
                const playerNum = players.getPlayers(hostId);
                const game = games.getGame(hostId);

                // if the question is still live
                if(game.gameData.questionLive == true)
                {
                    player.gameData.answer = option;
                    game.gameData.playersAnswered += 1;

                    const gameQuestion = game.gameData.question;
                    const gameId = game.gameData.gameId;

                    const questions = await Question.find({quiz: gameId}).populate({
                                                        path: 'options',
                                                        select: 'title'
                                                    });
                    
                    if(!questions)
                    {
                        socket.emit('noQuestionFound');
                    }
                
                    const correctOption = questions[gameQuestion-1].correctOption;
                    option = questions[gameQuestion-1].options[option-1]._id;
                    let cop = 0;
                    for(let i=0; i<questions[gameQuestion-1].options.length; i++)
                    {
                        
                        if(correctOption.equals(questions[gameQuestion-1].options[i]._id))
                        {
                            cop = i+1;
                        }
                    }

                    if(option.equals(correctOption))
                    {
                        player.gameData.score += 100;
                        io.to(game.pin).emit('getTime', socket.id);
                        socket.emit('answerResult', true);
                    }

                    if(game.gameData.playersAnswered == playerNum.length)
                    {
                        game.gameData.questionLive = false;
                        const playerData = players.getPlayers(game.hostId);
                        io.to(game.pin).emit('questionOver', playerData, cop)
                    }
                    else
                    {
                        io.to(game.pin).emit('updatePlayersAnswered', {
                                                                         playersInGame:  playerNum.length,
                                                                         playersAnswered: game.gameData.playersAnswered
                                                                      });
                    }
                }
            }
            catch(error)
            {
                console.log(error);
            }
        })

        socket.on('timeUp', async()=>{
            const game = games.getGame(socket.id);
            game.gameData.questionLive = false;
            const playerData = players.getPlayers(game.hostId);

            const gameQuestion = game.gameData.question;
            const gameId = game.gameData.gameId;

            const question = await Question.find({quiz: gameId}).populate({
                                                                    path: 'options',
                                                                    select: 'title'
                                                                });
            if(!question) 
            {
                socket.emit('noQuestionFound');
            }  
            
            const correctOption = question[gameQuestion-1].correctOption;
            io.to(game.pin).emit('questionOver', playerData, correctOption);
        });

        socket.on('getScore', ()=>{
            const player = players.getPlayer(socket.id);
            socket.emit('newScore', player.gameData.score);
        });

        socket.on('time', (data)=>{
            let time = data.time / 20;
            time = time * 100;
            const playerid = data.player;
            let player = players.getPlayer(playerid);
            player.gameData.score += time;
        });

        socket.on('nextQuestion', async()=>{
            try
            {
                const playersData = players.getPlayers(socket.id);

                //Reset player current answer to 0
                for(let i=0; i<Object.keys(players.players).length; i++)
                {
                    if(players.players[i].hostId == socket.id)
                    {
                        players.players[i].gameData.answer = 0;
                    }
                }

                const game = games.getGame(socket.id);
                game.gameData.playersAnswered = 0;
                game.gameData.questionLive = true;
                game.gameData.question += 1;

                const gameId = game.gameData.gameId;

                const questions = await Question.find({quiz: gameId}).populate({
                                                                path: 'options',
                                                                select: 'title'
                                                            }).populate({
                                                                path: 'quiz',
                                                                select: 'creator'
                                                            });
                                                            
                
                if(!questions)
                {
                    socket.emit('noQuestionFound');
                }

                let flag = false;
                if(questions.length >= game.gameData.question)
                {
                    let questionNum = game.gameData.question;
                    questionNum -= 1;

                    const question = questions[questionNum].title;
                    const option1 = questions[questionNum].options[0].title;
                    const option2 = questions[questionNum].options[1].title;
                    const option3 = questions[questionNum].options[2].title;
                    const option4 = questions[questionNum].options[3].title;
                    const correctOption = questions[0].correctOption;

                    io.to(game.pin).emit('gameQuestions', {
                        q1: question,
                        op1: option1,
                        op2: option2,
                        op3: option3,
                        op4: option4,
                        correctOption: correctOption,
                        playersInGame: playersData.length,
                        questions: questions.length
                    });
                }
                else
                {
                    const playersInGame = players.getPlayers(game.hostId);

                    const first = {name: "", score: 0};
                    const second = {name: "", score: 0};
                    const third = {name: "", score: 0};
                    const fourth = {name: "", score: 0};
                    const fifth = {name: "", score: 0};

                    for(let i = 0; i < playersInGame.length; i++)
                    {
        
                        if(playersInGame[i].gameData.score > fifth.score)
                        {
                            if(playersInGame[i].gameData.score > fourth.score)
                            {
                                if(playersInGame[i].gameData.score > third.score)
                                {
                                    if(playersInGame[i].gameData.score > second.score)
                                    {
                                        if(playersInGame[i].gameData.score > first.score)
                                        {
                                            //First Place
                                            fifth.name = fourth.name;
                                            fifth.score = fourth.score;
                                            
                                            fourth.name = third.name;
                                            fourth.score = third.score;
                                            
                                            third.name = second.name;
                                            third.score = second.score;
                                            
                                            second.name = first.name;
                                            second.score = first.score;
                                            
                                            first.name = playersInGame[i].name;
                                            first.score = playersInGame[i].gameData.score;
                                        }
                                        else
                                        {
                                            //Second Place
                                            fifth.name = fourth.name;
                                            fifth.score = fourth.score;
                                            
                                            fourth.name = third.name;
                                            fourth.score = third.score;
                                            
                                            third.name = second.name;
                                            third.score = second.score;
                                            
                                            second.name = playersInGame[i].name;
                                            second.score = playersInGame[i].gameData.score;
                                        }
                                    }
                                    else
                                    {
                                        //Third Place
                                        fifth.name = fourth.name;
                                        fifth.score = fourth.score;
                                            
                                        fourth.name = third.name;
                                        fourth.score = third.score;
                                        
                                        third.name = playersInGame[i].name;
                                        third.score = playersInGame[i].gameData.score;
                                    }
                                }
                                else
                                {
                                    //Fourth Place
                                    fifth.name = fourth.name;
                                    fifth.score = fourth.score;
                                    
                                    fourth.name = playersInGame[i].name;
                                    fourth.score = playersInGame[i].gameData.score;
                                }
                            }
                            else
                            {
                                //Fifth Place
                                fifth.name = playersInGame[i].name;
                                fifth.score = playersInGame[i].gameData.score;
                            }
                        }
                    }
                    flag = true;
                    io.to(game.pin).emit('GameOver', {
                        num1: first.name,
                        num2: second.name,
                        num3: third.name,
                        num4: fourth.name,
                        num5: fifth.name
                    });

                   
                
                    const DBgame = await Games.findOne({quiz: game.gameData.gameId});
                    if(!DBgame)
                    {
                    

                        const playersData = [];
                        for(let player of playersInGame)
                        {
                            const obj = {
                                playerId : player.id,
                                name : player.name,
                                score: player.gameData.score
                            }
                            playersData.push(obj);
                        }
                        
                        const gameData =  Games({
                            
                            quiz: game.gameData.gameId,
                            games: [{
                                batch: game.batch,
                                pin : game.pin,
                                players: playersData
                            }],
                            host: questions[0].quiz.creator    
                        });
                        const dbGame = await gameData.save();
                        
                    }
                    else
                    {
                        const dbGames = DBgame.games;
                        const playersData = [];
                        for(let player of playersInGame)
                        {
                            const obj = {
                                playerId : player.id,
                                name : player.name,
                                score: player.gameData.score
                            }
                            playersData.push(obj);
                        }
                        dbGames.push({
                            batch: game.batch,
                            pin: game.pin,
                            players: playersData
                        });
                        const dbGame = await DBgame.save();
                    }
                    games.removeGame(socket.id);
                    console.log('Game ended with pin: ', game.pin);


                    for(let i=0; i<playersInGame.length; i++)
                    {
                        players.removePlayer(playersInGame[i].playerId);
                    }

                }
                if(!flag)
                {
                    io.to(game.pin).emit('nextQuestionPlayer');
                }
            }
            catch(error)
            {
                console.error(error);
            }
        });  
        
        socket.on('disconnect', () => {
            const game = games.getGame(socket.id);
            if(game)
            {
                if(!game.gameLive)
                {
                    games.removeGame(socket.id);
                    console.log('Game ended with pin: ', game.pin);

                    const playersToRemove = players.getPlayers(game.hostId);

                    for(let i=0; i<playersToRemove.length; i++)
                    {
                        players.removePlayer(playersToRemove[i].playerId);
                    }

                    io.to(game.pin).emit('hostDisconnected');
                    socket.leave(game.pin);
                }
            }
            else
            {
                const player = players.getPlayer(socket.id);

                if(player)
                {
                    const hostId = player.hostId;
                    const game = games.getGame(hostId);
                    const pin = game.pin;

                    if(!game.gameLive)
                    {
                        players.removePlayer(socket.id);
                        const playersInGame = players.getPlayers(hostId);

                        io.to(game.pin).emit('updatePlayerLobby', playersInGame);
                        socket.leave(pin);
                    }
                }
            }
        });
    });

}



module.exports = {socketImplementation};