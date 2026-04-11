import { data } from "../../source/source_information.js";

const FILE_PATH = "source/source_information.json";
const TOKEN_FILE_PATH = "source/character_tokens";
const SHEET_FILE_PATH = "source/character_sheets";

const SIZE_OF_CROSS = 30;

const WIDTH_OF_CHARACTER_DETAIL = 300;
const HEIGHT_OF_CHARACTER_DETAIL = 400;

const CROSS_SRC = "source/cross.png";
const CROSS_IMG = new Image();
CROSS_IMG.src = CROSS_SRC;

export class character {
        constructor (fraction_id, id) {
                this.position = {x: 0, y: 0};
                this.rotation = 0;
                
                const model_info = data.fractions[fraction_id].models[id];

                this.token = new Image();
                this.token.src = TOKEN_FILE_PATH + model_info["token"];


                this.front = new Image();
                this.front.src = SHEET_FILE_PATH + model_info["character sheet"];

                this.crosses = [];
        }

        handle_click (e) {
                let cross_was_removed = false;
                this.crosses.forEach((cross, id) => {
                        const distance = Math.sqrt((cross.x - e.layerX)**2 + (cross.y - e.layerY)**2);
                        if (distance < SIZE_OF_CROSS/2) {
                                this.crosses.splice(id, 1)
                                cross_was_removed = true;
                        }
                });
                if (!cross_was_removed) {
                        this.crosses.push({x: e.layerX, y: e.layerY});
                }
        }

        draw_character_sheet (ctx) {
                ctx.clearRect(0, 0, 300, 400);
                ctx.drawImage(this.front, 0, 0, WIDTH_OF_CHARACTER_DETAIL, HEIGHT_OF_CHARACTER_DETAIL);
                this.crosses.forEach(cross => {
                        ctx.drawImage (CROSS_IMG, cross.x - SIZE_OF_CROSS / 2, cross.y - SIZE_OF_CROSS/2, SIZE_OF_CROSS, SIZE_OF_CROSS);
                });
        }
}