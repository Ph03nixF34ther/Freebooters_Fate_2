// Diese Instanz ist verantwortlich für die Verwaltung der Map-Anzeige
// Datum: 3.4.2026
// Autor: Elias Niebergall & Leon Söns

class Map_Display_Handler {
        constructor (canvas_context, background_image_source_name) {
                this.ctx = canvas_context;
                this.zoom = 1;
                this.position_x = 0;
                this.position_y = 0;
                this.background_image = new Image();
                
                this.background_image.src = background_image_source_name;
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
                this.ctx.drawImage(
                        this.background_image, 
                        this.position_x, 
                        this.position_y, 
                        this.zoom * (this.background_image.width),
                        this.zoom * (this.background_image.height)
                );
        }

        draw_frame () {
                this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                this.draw_background ();
        }
}