//modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk');
//modulo interno
const fs = require('fs');


console.log('Iniciamos o Accounts\n');

operation();

function operation(){

    inquirer.prompt([   // inquirer.prompt para permitir interação através do clique do botão pelo user
        {   //Objeto com as ações do sistema:
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ],
        }, //Encadeamento em then() usado em Promise:
    ]).then((answer) => {
        const action = answer['action']

        if(action === 'Criar Conta'){
            createAccount();
        }
        else if(action === 'Consultar Saldo'){
            getAccountBalance();
        }
        else if(action === 'Depositar'){
            deposit();
        }
        else if(action === 'Sacar'){
            withdraw();
        }
        else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
            process.exit();
        }
    }).catch((error) => {
        console.log(error);
    })
    
}


function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir:'));

    buildAccount();
}

function buildAccount(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta'
        }
    ]).then((answer) => {
        const accountName = answer['accountName'];
        console.info(accountName)
        // Verificar se nome da conta não existe. Se não existe, a conta é criada:
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts');
        }
        // Se nome da conta já existe, manda o aviso de que conta já existe:
        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(
                chalk.bgRed.black('Esta conta já existe, escolha outro nome.'),
            )
            buildAccount()
            return
        }

        // Criação do arquivo json do usuário:
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err){
            console.log(err);
        },
        )

        console.log(chalk.green('Parabéns! A sua conta foi criada!'));
        operation();

    }).catch((error) => console.log(error));
}

function deposit(){

    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName'];

        if(!checkAccount(accountName)){
            return deposit();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ]).then((answer) => {

            const amount = answer['amount'];

            addAmount(accountName, amount);
            operation();

        }).catch((error) => console.log(error))
        
    }).catch((error) => {
        console.log(error);
    })
}

function checkAccount(accountName){

    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome.'))
        return false
    }
    
    return true
}

function addAmount(accountName, amount){

    const accountData = getAccount(accountName);

    if(!amount){
        console.log(
            chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'),
        )
        return deposit();
    }
    // Cálculo para alterar o valor do objeto e somar o depósito:
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
    //Salvando valor do arquivo no arquivo existente e convertendo:
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function(err){
        console.log(err);
    },
    )
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`));

}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON);
}

function getAccountBalance(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName'];
        //Verificação da conta:
        if(!checkAccount(accountName)){
            return getAccountBalance();
        }

        const accountData = getAccount(accountName);

        console.log(
            chalk.bgBlue.black(`Olá! O saldo de sua conta é R$${accountData.balance}`)),
            
        operation();

    }).catch((error) => {
        console.log(error);
    })
}

function withdraw(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName'];
        //Verificação da conta:
        if(!checkAccount(accountName)){
            return withdraw();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {

            const amount = answer['amount'];

            removeAmount(accountName, amount);

        }).catch((err) => console.log(err));

    }).catch((err) => console.log(err));
}



function removeAmount(accountName, amount){

    const accountData = getAccount(accountName);

    if(!amount){
        console.log(
            chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'),
        ) 
        return withdraw();
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponível'))
        return withdraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    //Salvando valor do arquivo no arquivo existente e convertendo:
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function(err){
        console.log(err);
    },
    )
    console.log(chalk.green(`Foi realizado o saque de R$${amount} da sua conta.`));
    operation();
}