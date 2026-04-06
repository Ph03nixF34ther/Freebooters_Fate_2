// Hauptprogramm
// Datum: 3.4.2026
// Autor: Leon Söns & Elias Niebergall

import { character } from "./map_handling/character.js";
import { Map_Display_Handler } from "./map_handling/map_display_handler.js";



const DRAG_BUTTON = 0;
const MOVEMENT_BUTTON = 2;
const ACCEPT_MOVEMENT = 0;
const ABORT_MOVEMENT = 2;

const MAP_NAME = "Forgotten_Island.png";
const SCALE = 80;




// Der Code wird nur ausgeführt, wenn alle Elemente korrekt geladen wurden.
document.addEventListener("DOMContentLoaded", () => {

        // Alle Elemente aus der HTML-Seite entnehmen
        const map_display = document.getElementById("map-display");
        const character_detail = document.getElementById("character-detail");
        
        const map_image = new Image();
        map_image.src = "source/maps/" + MAP_NAME

        
        const character_detail_ctx = character_detail.getContext("2d");
        
        // Den Map_Display_Handler mit dem Canvas Context anlegen
        const map_display_ctx = map_display.getContext("2d");

        const map_display_handler = new Map_Display_Handler(map_display_ctx, character_detail_ctx, map_image, SCALE);
        
        map_image.onload = () => {
                map_display_handler.draw_frame();
        }
        map_display_handler.update_characters([new character(0, 0), new character(0, 1), new character(0, 2)]);

        character_detail.width = 300;
        character_detail.height = 400;

        // Die Auflösung der Seite anpassen
        map_display.width = window.innerWidth;
        map_display.height = window.innerHeight;
        
        document.addEventListener("resize", () => {
                map_display.width = window.innerWidth;
                map_display.height = window.innerHeight;
        })

        let controls_enabled = true;
        let last_character_clicked_on = -1;

        const current_control_information = {
                drag_clicked: false,
                move_clicked: false,
                origin:           {x: 0, y: 0},
                old_map_position: {x: 0, y: 0},
                is_in_fullscreen: false,
        };

        document.addEventListener("mousedown", (e) => {
                const character_clicked_on = map_display_handler.character_that_was_clicked_on(e);
                const clicked_on_map = e.x == e.layerX && e.y == e.layerY;
                
                if (!clicked_on_map) {
                        const active_character = map_display_handler.characters[last_character_clicked_on];
                        active_character.handle_click(e);
                        active_character.draw_character_sheet(character_detail_ctx);
                }
                
                
                if (clicked_on_map) {
                        if (character_clicked_on != -1) {
                                map_display_handler.open_character_detail(character_clicked_on);
                        }

                        if (e.button == DRAG_BUTTON && controls_enabled && character_clicked_on == -1) {
                                current_control_information.drag_clicked = true;
                                current_control_information.origin.x = e.x;
                                current_control_information.origin.y = e.y;
                
                                current_control_information.old_map_position.x = map_display_handler.position_x;
                                current_control_information.old_map_position.y = map_display_handler.position_y;
                        }

                        
                        if (controls_enabled && e.button == ACCEPT_MOVEMENT && current_control_information.move_clicked) {
                                current_control_information.move_clicked = false;
                                map_display_handler.move_character();
                        }
                        
                        if (controls_enabled && e.button == ABORT_MOVEMENT && current_control_information.move_clicked) {
                                current_control_information.move_clicked = false;
                                map_display_handler.abort_movement();
                        }
                        
                        if (controls_enabled && e.button == MOVEMENT_BUTTON && character_clicked_on != -1) {
                                current_control_information.move_clicked = true;
                                map_display_handler.show_movement_preview(character_clicked_on, e);
                        }
                        last_character_clicked_on = character_clicked_on;
                }
        });
        
        document.addEventListener("mousemove", (e) => {
                const mouse_on_map = e.x == e.layerX && e.y == e.layerY;
                
                if (e.button == DRAG_BUTTON && controls_enabled) {
                        const moved_x = e.x - current_control_information.origin.x;
                        const moved_y = e.y - current_control_information.origin.y;
                        
                        const offset_x = moved_x / map_display_handler.zoom;
                        const offset_y = moved_y / map_display_handler.zoom;
                        
                        if (current_control_information.drag_clicked) {
                                map_display_handler.set_position(
                                        current_control_information.old_map_position.x + offset_x,
                                        current_control_information.old_map_position.y + offset_y
                                );
                        }
                        
                }
                if (current_control_information.move_clicked && mouse_on_map) {
                        map_display_handler.update_mouse_position(e);
                }
        });

        document.addEventListener("mouseup", (e) => {
                if (e.button == DRAG_BUTTON && controls_enabled) {
                        current_control_information.drag_clicked = false;
                }

                const clicked = current_control_information.origin.x == e.x && 
                                current_control_information.origin.y == e.y;
                if (e.button == DRAG_BUTTON && controls_enabled && clicked) {
                        map_display_handler.close_character_detail()
                }
        });

        document.addEventListener("wheel", (e) => {
                if (controls_enabled) {
                        map_display_handler.set_zoom((1 - e.deltaY / 500) * map_display_handler.zoom);
                }
        })

        document.addEventListener("keydown", (e) => {
                if (e.key == "f") {
                        requestFullscreen();
                }
        });
});