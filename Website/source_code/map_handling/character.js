
const FILE_PATH = "source/source_information.json";
const TOKEN_FILE_PATH = ".../source/character_tokens";

export class character {
        constructor (fraction, id) {
                this.position = {x: 0, y: 0};
                this.rotation = 0;

                const json = fetch(FILE_PATH).then(response => {return response.json();});
                
                console.log(json);
                const model_info = json.fractions[fraction].fraction[id];

                this.token = new Image();
                this.token.src = TOKEN_FILE_PATH + model_info["token"];

                console.log(this);
        }
}