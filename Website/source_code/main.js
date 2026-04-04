// Hauptprogramm
// Datum: 3.4.2026
// Autor: Leon Söns & Elias Niebergall

import { Map_Display_Handler } from "./map_handling/map_display_handler.js";

const DRAG_BUTTON = 0;
const SCROLL_BUTTON = 3;

const MAP_NAME = "Forgotten_Island";

// Der Code wird nur ausgeführt, wenn alle Elemente korrekt geladen wurden.
document.addEventListener("DOMContentLoaded", () => {

        // Alle Elemente aus der HTML-Seite entnehmen
        const map_display = document.getElementById("map-display");
        const character_detail = document.getElementById("character-detail");
        
        const map_image = document.getElementById(MAP_NAME);
        
        const character_detail_ctx = character_detail.getContext("2d");
        
        // Den Map_Display_Handler mit dem Canvas Context anlegen
        const map_display_ctx = map_display.getContext("2d");
        const map_display_handler = new Map_Display_Handler(map_display_ctx, map_image);
        
        map_image.addEventListener("loadedmetadata", () => {
                map_display_handler.draw_frame();
        });
        // Die Auflösung der Seite anpassen
        map_display.width = window.innerWidth;
        map_display.height = window.innerHeight;
        
        document.addEventListener("resize", () => {
                map_display.width = window.innerWidth;
                map_display.height = window.innerHeight;
        })

        let controls_enabled = true;

        const current_control_information = {
                drag_clicked: false,
                drag_origin:      {x: 0, y: 0},
                old_map_position: {x: 0, y: 0},
                is_in_fullscreen: false,
        };

        document.addEventListener("mousedown", (e) => {
                if (e.button == DRAG_BUTTON && controls_enabled) {
                        current_control_information.drag_clicked = true;
                        current_control_information.drag_origin.x = e.x;
                        current_control_information.drag_origin.y = e.y;
        
                        current_control_information.old_map_position.x = map_display_handler.position_x;
                        current_control_information.old_map_position.y = map_display_handler.position_y;
                }
        });

        document.addEventListener("mousemove", (e) => {
                if (e.button == DRAG_BUTTON && controls_enabled) {
                        const moved_x = e.x - current_control_information.drag_origin.x;
                        const moved_y = e.y - current_control_information.drag_origin.y;

                        const offset_x = moved_x / map_display_handler.zoom;
                        const offset_y = moved_y / map_display_handler.zoom;
        
                        if (current_control_information.drag_clicked) {
                                map_display_handler.set_position(
                                        current_control_information.old_map_position.x + offset_x,
                                        current_control_information.old_map_position.y + offset_y
                                );
                        }
                }
        });

        document.addEventListener("mouseup", (e) => {
                if (e.button == DRAG_BUTTON && controls_enabled) {
                        current_control_information.drag_clicked = false;
                }
        });

        document.addEventListener("wheel", (e) => {
                if (controls_enabled) {
                        map_display_handler.set_zoom((1 - e.deltaY / 500) * map_display_handler.zoom);
                        console.log(map_display_handler);
                }
        })

        document.addEventListener("keydown", (e) => {
                if (e.key == "f") {
                        requestFullscreen();
                }
        })

});