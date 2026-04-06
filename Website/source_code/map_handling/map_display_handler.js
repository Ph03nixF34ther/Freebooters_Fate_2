// Diese Instanz ist verantwortlich für die Verwaltung der Map-Anzeige
// Datum: 3.4.2026
// Autor: Elias Niebergall & Leon Söns

export class Map_Display_Handler {
        constructor (canvas_context, information_context, background_image, scale) {
                this.map_ctx = canvas_context;
                this.information_ctx = information_context;
                this.zoom = 1;
                this.background_image = background_image;
                this.position_x = -background_image.width/2;
                this.position_y = -background_image.height/2;

                this.characters = [];
                this.scale = scale;

                this.character_detail_container = document.getElementById("character-detail");

                this.character_on_movement_preview = -1;
                this.mouse_position = {x: 0, y: 0};
        }

        set_position (x, y) {
                this.position_x = x;
                this.position_y = y;
                this.draw_frame();
        }
        
        set_zoom (new_zoom) {
                this.zoom = new_zoom;
                this.draw_frame();
        }

        draw_background () {
                this.map_ctx.drawImage(
                        this.background_image, 
                        this.zoom * (this.position_x) + window.innerWidth / 2,
                        this.zoom * this.position_y + window.innerHeight / 2,
                        this.zoom * (this.background_image.width),
                        this.zoom * (this.background_image.height)
                );
        }

        draw_movement_preview () {
                if (this.character_on_movement_preview != -1) {
                        const character = this.characters[this.character_on_movement_preview];
                        
                        this.map_ctx.lineWidth = 5 * this.zoom;

                        this.map_ctx.strokeStyle = "#ff0000"
                        this.map_ctx.fillStyle = "#ff0000"

                        const font_size = Math.round(this.zoom * 30);
                        this.map_ctx.font = font_size.toString() + "px serif"
                        this.map_ctx.textBaseline = "middle"

                        const mouse_on_map = this.position_on_battlefield(this.mouse_position);

                        mouse_on_map.x -= this.scale / 2;
                        mouse_on_map.y -= this.scale / 2;

                        const distance = Math.sqrt((character.position.x - mouse_on_map.x)**2 + (character.position.y - mouse_on_map.y)**2);
                        const distance_in_cm = distance / this.scale * 250;

                        this.map_ctx.fillText(Math.round(distance_in_cm.toString())/100 + " cm", this.mouse_position.x + 10, this.mouse_position.y)

                        const position_on_screen = this.position_on_screen(character.position)
                        this.map_ctx.beginPath();
                        this.map_ctx.moveTo(
                                this.zoom * (character.position.x + this.position_x + this.scale/2) + window.innerWidth / 2, 
                                this.zoom * (character.position.y + this.position_y + this.scale/2) + window.innerHeight / 2);
                        this.map_ctx.lineTo(this.mouse_position.x, this.mouse_position.y);
                        this.map_ctx.stroke();
                }
        }

        draw_characters ()  {
                this.characters.forEach (char => {
                        this.map_ctx.save();

                        const position_on_screen = this.position_on_screen(char.position)
                        this.map_ctx.translate(
                                position_on_screen.x, 
                                position_on_screen.y);
                        this.map_ctx.rotate(char.rotation);
                        this.map_ctx.drawImage(char.token, 0, 0, this.zoom * this.scale, this.zoom * this.scale);
                        this.map_ctx.restore();
                });
        }

        update_characters (characters) {
                this.characters = characters;
                this.draw_frame();
        }

        draw_frame () {
                this.map_ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                this.draw_background ();
                this.draw_characters();
                this.draw_movement_preview();
        }

        character_that_was_clicked_on (event) {
                let character_ID = -1;
                this.characters.forEach((character, id) => {
                        const position_on_screen = this.position_on_screen (character.position);

                        position_on_screen.x += this.zoom * this.scale / 2;
                        position_on_screen.y += this.zoom * this.scale / 2;

                        const distance_from_click_to_character = Math.sqrt((position_on_screen.x - event.layerX)**2 + (position_on_screen.y - event.layerY)**2);
                        
                        if (distance_from_click_to_character <= this.zoom * this.scale) {
                                character_ID = id
                        }
                });
                return character_ID;
        }

        close_character_detail () {
                this.information_ctx.clearRect(0, 0, 300, 400);
        }

        open_character_detail(id) {
                const active_character = this.characters[id];
                active_character.draw_character_sheet(this.information_ctx)
        }

        show_movement_preview (id, e) {
                this.character_on_movement_preview = id;
                this.mouse_position.x = e.layerX;
                this.mouse_position.y = e.layerY;
                this.draw_frame();
        }
        
        update_mouse_position (e) {
                this.mouse_position.x = e.layerX;
                this.mouse_position.y = e.layerY;
                this.draw_frame();
        }

        position_on_screen(position) {
                return {
                        x: this.zoom * (position.x + this.position_x) + window.innerWidth / 2,
                        y: this.zoom * (position.y + this.position_y) + window.innerHeight / 2
                };
        }

        position_on_battlefield (position) {
                return {
                        x: (position.x - window.innerWidth / 2) / this.zoom - this.position_x,
                        y: (position.y - window.innerHeight/ 2) / this.zoom - this.position_y
                };
        }

        move_character() {
                const character = this.characters[this.character_on_movement_preview];
                this.character_on_movement_preview = -1;
                character.position = this.position_on_battlefield(this.mouse_position);

                character.position.x -= this.scale / 2;
                character.position.y -= this.scale / 2;
                this.draw_frame();
        }

        abort_movement() {
                this.character_on_movement_preview = -1;
                this.draw_frame();
        }
}