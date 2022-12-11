function getRandomValue(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

const app = Vue.createApp({
    data(){
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            battleLogs: []
        };
    },
    computed:{
        monsterHealthStyle(){
            return this.monsterHealth > 0
                ? {width: this.monsterHealth + '%'}
                : {width: '0%'};
        },
        playerHealthStyle(){
            return this.playerHealth > 0
                ? {width: this.playerHealth + '%'}
                : {width: '0%'};
        },
        specialAttackEnabled(){
            return this.currentRound < 3;
        }
    },
    watch: {
        playerHealth(value){
            if (value <= 0 && this.monsterHealth <= 0){
                this.winner = 'draw';
            } else if (value <= 0){
                this.winner = 'monster';
            }
        },
        monsterHealth(value){
            if (value <= 0 && this.playerHealth <= 0){
                this.winner = 'draw';
            } else if (value <= 0){
                this.winner = 'player';
            }
        }
    },
    methods: {
        startNewGame(){
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.battleLogs = [];
        },
        attackMonster(){
            const attackValue = getRandomValue(5,12);
            this.monsterHealth -= attackValue;
            this.currentRound++;
            this.addLogMessage('Player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer(){
            const attackValue = getRandomValue(8,15);
            this.playerHealth -= attackValue;
            this.addLogMessage('Monster', 'attack', attackValue);
        },
        specialAttackMonster(){
            const attackValue = getRandomValue(10,25);
            this.monsterHealth -= attackValue;
            this.currentRound = 1;
            this.addLogMessage('Player', 'attack', attackValue);
            this.attackPlayer();
        },
        healPlayer(){
            const healValue = getRandomValue(8,20);
            const tempPlayerHealth = this.playerHealth + healValue;
            if(tempPlayerHealth >= 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth = tempPlayerHealth;
            }

            this.currentRound++;
            this.addLogMessage('Player', 'heal', healValue);
            this.attackPlayer();
        },
        surrender(){
            this.winner = 'monster';
            this.addLogMessage('Player', 'surrender', '');
        },
        addLogMessage(user, event, num){
            this.battleLogs.unshift({
                userName: user,
                currentEvent: event,
                numValue: num
            });
        }
    }
});

app.mount('#game');