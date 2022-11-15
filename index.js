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

        }
        else if(action === 'Depositar'){

        }
        else if(action === 'Sacar'){

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