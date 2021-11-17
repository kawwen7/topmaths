import { Injectable } from '@angular/core';
import { Container, Main } from 'tsparticles';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  confetti: Container
  particlesOptions: any
  id : string
  
  constructor() {
    this.id =  "tsparticles"
    this.confetti = new Container('tsparticles')
    this.majParametres()
  }

  /**
   * Arrête tsparticles et libère les ressources
   * (si le processus n'est pas arrêté il y a un bug graphique en changeant d'onglet)
   */
  public stop() {
    this.confetti.stop()
  }

  /**
   * Lance les confetti
   */
  public lanceConfetti() {
    this.confetti.refresh()
    this.confetti.play()
  }

  /**
   * Récupère le container des particules et le met dans la variable this.confetti
   * @param container 
   */
  particlesLoaded(container: Container): void {
    this.confetti = container
  }

  /**
   * Ne fait rien à l'initialisation
   * @param main 
   */
  particlesInit(main: Main): void {
  }

  /**
   * Crée une liste d'emetteurs différents selon que l'on soit en portrait ou en paysage
   * Les ajoute aux autres paramètres de this.particlesOptions
   */
  majParametres(){
    this.particlesOptions = {
      autoPlay: false,
      fullScreen: {
        enable: true
      },
      particles: {
        number: {
          value: 0 // no starting particles
        },
        color: {
          value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"] // the confetti colors
        },
        shape: {
          type: ["square"], // the confetti shape
          options: {
            confetti: { // confetti shape options
              //type: ["square"] // you can only have circle or square for now
            }
          }
        },
        opacity: {
          //value: 1, // confetti are solid, so opacity should be 1, but who cares?
          animation: {
            enable: true, // enables the opacity animation, this will fade away the confettis
            minimumValue: 0, // minimum opacity reached with animation
            speed: 2, // the opacity animation speed, the higher the value, the faster the confetti disappear
            //startValue: "max", // start always from opacity 1
            //destroy: "min" // destroy the confettis at opacity 0
          }
        },
        size: {
          value: 7, // confetti size
          random: {
            enable: true, // enables a random size between 3 (below) and 7 (above)
            minimumValue: 3 // the confetti minimum size
          }
        },
        life: {
          duration: {
            sync: true, // syncs the life duration for those who spawns together
            value: 2.2 // how many seconds the confettis should be on screen
          },
          count: 1 // how many times the confetti should appear, once is enough this time
        },
        move: {
          enable: true, // confetti need to move right?
          gravity: {
            enable: false, // gravity to let them fall!
            acceleration: 20 // how fast the gravity should attract the confettis
          },
          speed: 50, // the confetti speed, it's the starting value since gravity will affect it, and decay too
          decay: 0.1, // the speed decay over time, it's a decreasing value, every frame the decay will be multiplied by current particle speed and removed from that value
  
        },
        outMode: { // what confettis should do offscreen?
          default: "destroy", // by default remove them
          //top: "none" // but since gravity attract them to bottom, when they go offscreen on top they can stay
        },
        rotate: {
          value: {
            min: 0,
            max: 360
          },
          //direction: "random",
          move: true,
          animation: {
            enable: true,
            speed: 60
          }
        },
        tilt: {
          //direction: "random",
          enable: true,
          move: true,
          value: {
            min: 0,
            max: 360
          },
          animation: {
            enable: true,
            speed: 60
          }
        },
        roll: {
          darken: {
            enable: true,
            value: 30
          },
          enlighten: {
            enable: true,
            value: 30
          },
          enable: true,
          speed: {
            min: 15,
            max: 25
          }
        },
        wobble: {
          distance: 30,
          enable: true,
          move: true,
          speed: {
            min: -15,
            max: 15
          }
        }
      },
      background: {
        //color: "#FFFFFF" // set the canvas background, it will set the style property
      },
      emitters: [ // the confetti emitters, the will bring confetti to life
        {
          life: {
            count: 1,
            duration: 0.5
          },
          rate: {
            delay: 0.05, // this is the delay in seconds for every confetti emission (10 confettis will spawn every 0.1 seconds)
            quantity: 10 // how many confettis must spawn ad every delay
          },
          position: { // the emitter position (values are in canvas %)
            x: 50,
            y: 60
          },
          size: { // the emitter size, if > 0 you'll have a spawn area instead of a point
            width: 0,
            height: 0
          }
        }
      ]
    }
  }
}
