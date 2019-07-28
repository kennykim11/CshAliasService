const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const app = require('express')()
const fs = require('fs')


var aliasList = {}

const contents = fs.readFileSync('./aliases.txt', 'utf8')
contents.split('\n').forEach(function(line){
    if (!line.includes(':') || line.startsWith('#')) return
    words = line.split(':')
    aliasList[words[0].trim()] = words[1].trim()
})

console.log(aliasList)

function prompt(){readline.question('', (input) => {
    words = input.split(' ')
    switch(words[0]) {
        case 'get':
            console.log(getUsernameByAlias(words[1]))
            prompt()
            break;
        case 'set':
            console.log(setAlias(words[1], words[2]) ? 'Alias inserted' : 'Alias already exists')
            prompt()
            break;
        case 'close':
            readline.close()
            break;
        default:
            console.log('Start with set or get')
            prompt()
        }
})}
//Uncomment this to interact with console instead of web service
//prompt()

function getUsernameByAlias(username){
    return aliasList[username]
}

function setAlias(alias, username){
    if (alias in aliasList) return false
    aliasList[alias] = username
    fs.appendFileSync('aliases.txt', `${alias}: ${username}\n`);
    return true
}

app.get('/api', (req, res) => res.send(getUsernameByAlias(req.param('alias'))))
app.post('/api', (req, res) => res.send(setAlias(req.param('alias'), req.param('username'))))
app.listen(3000, () => console.log(`Example app listening on port 3000!`))