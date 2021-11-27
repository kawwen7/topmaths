import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  redirectUrl: string = ''
  baseUrl: string = "https://topmaths.fr/api";
  user: User
  onlineUsers: User[]
  classement: User[]
  nbInvisibles: number
  feminin: boolean
  listeMasculins: any
  listeFeminins: any
  listeAdjectifs: any

  @Output() majProfil: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient, private router: Router) {
    this.user = {
      identifiant: '',
      lienAvatar: '',
      scores: '',
      lastLogin: '',
      lastAction: '',
      visible: '',
      pseudo: '',
      score: '0'
    }
    this.onlineUsers = []
    this.classement = []
    this.nbInvisibles = 0
    this.feminin = false
  }

  /**
   * Récupère dans les utilisateurs de la base de données par score décroissant
   */
  recupClassement() {
    if (isDevMode()) {
      this.classement = [
        {
          identifiant: 'id1',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          scores: '',
          lastLogin: '',
          lastAction: '',
          visible: 'oui',
          pseudo: 'lapin bleu',
          score: '17'
        }, {
          identifiant: 'id2',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          scores: '',
          lastLogin: '',
          lastAction: '',
          visible: 'oui',
          pseudo: 'Pierre verte',
          score: '38'
        }
      ]
    } else {
      this.pullClassement().pipe(first()).subscribe(
        data => {
          this.classement = data
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Récupère dans la base de données la liste des utilisateurs ayant été actifs au cours des 10 dernières minutes
   * ainsi que le nombre d'utilisateurs désirant rester invisibles
   */
  recupWhosOnline() {
    if (isDevMode()) {
      this.onlineUsers = [
        {
          identifiant: 'id1',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          scores: '',
          lastLogin: '',
          lastAction: '',
          visible: 'oui',
          pseudo: 'lapin bleu',
          score: '17'
        }, {
          identifiant: 'id2',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          scores: '',
          lastLogin: '',
          lastAction: '',
          visible: 'oui',
          pseudo: 'Pierre verte',
          score: '38'
        }
      ]
    } else {
      this.whosonline().pipe(first()).subscribe(
        data => {
          this.onlineUsers = data
          let i = 0
          for (const onlineUser of this.onlineUsers) {
            if (onlineUser.visible != 'oui') {
              i++
            }
          }
          this.nbInvisibles = i
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Récupère la liste des utilisateurs de la base de données.
   * @returns liste des utilisateurs classés par score
   */
  public pullClassement() {
    return this.httpClient.post<any>(this.baseUrl + '/classement.php', { })
      .pipe(map(Users => {
        return Users;
      }));
  }

  /**
   * Récupère la liste des utilisateurs en ligne de la base de données.
   * @returns liste des utilisateurs en ligne
   */
  public whosonline() {
    return this.httpClient.post<any>(this.baseUrl + '/whosonline.php', { })
      .pipe(map(Users => {
        return Users;
      }));
  }

  /**
   * Passe l'identifiant à l'API pour tenter de se connecter.
   * Si connecté, on redirige vers la page qu'on a voulu accéder ou vers la page profil.
   * Si pas connecté, on renvoie vers erreurLogin pour tenter de créer l'identifiant.
   * @param identifiant
   */
  login(identifiant: string, redirige?: boolean) {
    if (isDevMode()) {
      this.user = {
        identifiant: 'X',
        lienAvatar: 'https://avatars.dicebear.com/api/adventurer/topmaths.svg?scale=90&eyes=variant12&eyebrows=variant09&mouth=variant21&accessoires=glasses&accessoiresProbability=100&hair=long07&skinColor=variant03&hairColor=brown01',
        scores: 'actives',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: 'Cerf sauvage',
        score: '196'
      }
      this.setToken(this.user.identifiant);
    } else {
      this.userlogin(identifiant).pipe(first()).subscribe(
        data => {
          if (redirige) {
            const redirect = this.redirectUrl ? this.redirectUrl : 'profil';
            this.router.navigate([redirect]);
          }
          this.majProfil.emit({profilCharge: true})
        },
        error => {
          this.erreurLogin(identifiant)
        });
    }
  }

  /**
   * Vérifie la longueur et la présence de caractères spéciaux dans la chaîne.
   * Si tout est ok, on passe l'identifiant à l'API pour le créer.
   * @param identifiant 
   */
  registration(identifiant: string) {
    if (identifiant.length > 5 || identifiant.length < 4) {
      this.erreurRegistration('longueur')
    } else if (!this.onlyLettersAndNumbers(identifiant)) {
      this.erreurRegistration('caracteres_speciaux')
    } else {
      const user : User = {
        identifiant: identifiant,
        lienAvatar: `https://avatars.dicebear.com/api/adventurer/${identifiant}.svg`,
        scores: '',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: this.pseudoAleatoire(),
        score: '0'
      }
      this.userregistration(user).pipe(first()).subscribe(
        data => {
          this.login(identifiant, true)
        },
        error => {
          this.erreurRegistration('userregistration', error['message'])
        });
    }
  }

  /**
   * Prévient que l'identifiant n'existe pas et redirige vers la création d'un nouveau
   * @param identifiant Données du formulaire transmises par la fonction de login
   */
  erreurLogin(identifiant: string) {
    console.log('identifiant non trouvé, on en crée un nouveau')
    this.registration(identifiant)
  }

  /**
   * Signale à l'utilisateur un problème dans l'enregistrement d'un nouvel identifiant
   * @param typeErreur chaine de caractères
   * @param erreur objet erreur
   */
  erreurRegistration(typeErreur?: string, erreur?: any) {
    if (typeErreur == 'longueur') {
      alert('Erreur : l\'identifiant doit comporter 4 ou 5 caractères !')
    } else if (typeErreur == 'caracteres_speciaux') {
      alert('Erreur : tu ne dois utiliser que des chiffres et des lettres sans accent')
    } else if (typeErreur == 'userregistration') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else {
      alert('Une erreur s\'est produite')
    }
  }

  /**
   * Vérifie qu'il n'y a que des lettres et des chiffres
   * @param str chaîne à tester
   * @returns true si c'est le cas, false sinon
   */
  onlyLettersAndNumbers(str: string) {
    return /^[A-Za-z0-9]*$/.test(str);
  }
  /**
   * Envoie l'identifiant par message post à login.php pour s'identifier
   * Crée/modifie un token dans le localstorage avec l'identifiant du premier utilisateur correspondant dans la bdd
   * Fire un event pour prévenir de la connexion
   * Renvoie l'array des utilisateurs trouvés
   * @param identifiant identifiant à chercher dans la bdd
   * @returns User[] correspondants dans la bdd
   */
  public userlogin(identifiant: string) {
    return this.httpClient.post<any>(this.baseUrl + '/login.php', { identifiant })
      .pipe(map(Users => {
        this.setToken(Users[0].identifiant);
        this.user = Users[0]
        // Après avoir récupéré le profil utilisateur, on met à jour le lastLogin et on récupère la liste des utilisateurs en ligne
        this.majLastLogin()
        this.majLastAction()
        this.recupWhosOnline()
        return Users;
      }));
  }

  /**
   * Crée une nouvelle ligne user dans la bdd
   * @param user à écrire dans la bdd
   * @returns User créé
   */
  public userregistration(user: User) {
    return this.httpClient.post<any>(this.baseUrl + '/register.php', user)
      .pipe(map(User => {
        return User;
      }));
  }

  /**
   * Met à jour this.feminin
   * @param feminin boolean
   */
  majFeminin(feminin: boolean) {
    this.feminin = feminin
  }

  /**
   * Crée un pseudo aléatoire en mélangeant un nom et un adjectif au hasard
   * @returns pseudo
   */
  pseudoAleatoire() {
    if (this.feminin) {
      const nom = this.listeFeminins[Math.floor(Math.random() * this.listeFeminins.length)].nom
      const adjectif = this.listeAdjectifs[Math.floor(Math.random() * this.listeAdjectifs.length)].feminin
      return nom + ' ' + adjectif
    } else {
      const nom = this.listeMasculins[Math.floor(Math.random() * this.listeMasculins.length)].nom
      const adjectif = this.listeAdjectifs[Math.floor(Math.random() * this.listeAdjectifs.length)].masculin
      return nom + ' ' + adjectif
    }
  }
  
  /**
   * Récupère les listes de noms masculins, de noms féminins et d'adjectifs
   */
  recupereDonneesPseudos(){
    this.httpClient.get('assets/data/nomsMasculins.json').subscribe(
      (data: any) => {
        this.listeMasculins = data
      }
    )
    this.httpClient.get('assets/data/nomsFeminins.json').subscribe(
      (data: any) => {
        this.listeFeminins = data
      }
    )
    this.httpClient.get('assets/data/adjectifs.json').subscribe(
      (data: any) => {
        this.listeAdjectifs = data
      }
    )
  }

  /**
   * Modifie le lienAvatar dans la bdd
   * @param lienAvatar 
   */
  majAvatar(lienAvatar: string) {
    this.user.lienAvatar = lienAvatar
    this.update('lienAvatar').pipe(first()).subscribe(
      data => {
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Modifie le pseudo dans la bdd
   * @param pseudo 
   */
  majPseudo(pseudo: string) {
    this.user.pseudo = pseudo
    this.update('pseudo').pipe(first()).subscribe(
      data => {
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Récupère le score actuel
   * Ajoute le score de l'exercice
   * Met à jour le score de la base de données
   * @param score à ajouter 
   */
  majScore(score: string) {
    this.userlogin(this.user.identifiant).pipe(first()).subscribe(
      data => {
        this.user.score = (parseInt(data[0].score) + parseInt(score)).toString()
        this.update('score').pipe(first()).subscribe(
          data => {
          },
          error => {
            console.log(error)
          });
      },
      error => {
        console.log(error)
      });
    
  }

  /**
   * Modifie le token lienAvatar et le lienAvatar dans la bdd
   * @param scores peut être 'actives' ou 'desactives'
   */
  majScores(scores: string) {
    this.user.scores = scores
    this.update('scores').pipe(first()).subscribe(
      data => {
        const redirect = this.redirectUrl ? this.redirectUrl : 'profil';
        this.router.navigate([redirect]);
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Modifie la date de dernière connexion
   */
  majLastLogin() {
    this.update('lastLogin').pipe(first()).subscribe(
      data => {
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Modifie la date de dernière action
   */
  majLastAction() {
    this.update('lastAction').pipe(first()).subscribe(
      data => {
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Modifie la date de dernière action
   */
   majLogout() {
    this.update('logout').pipe(first()).subscribe(
      data => {
      },
      error => {
        console.log(error)
      });
  }

  /**
   * @param visible peut être 'oui' ou 'non'
   */
   majVisible(visible: string) {
    this.user.visible = visible
    this.update('visible').pipe(first()).subscribe(
      data => {
        this.recupWhosOnline()
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Envoie un mail au propriétaire du site
   * @param message
   */
  envoiMailEval(codeTrophee: string, sujetEval: string) {
    this.httpClient.post<any>(this.baseUrl + `/envoiMailEval.php`, {codeTrophee: codeTrophee, sujetEval: sujetEval}).pipe(first()).subscribe(
      data => {
        if (data['message'] == 'mail envoye') {
          alert('Ton message a bien été envoyé !\nM. Valmont t\'enverra un message sur Pronote pour te dire quoi réviser.')
        } else {
          alert('Il semble que le mail ait été envoyé')
        }
      },
      error => {
        alert('Une erreur s\'est produite')
        console.log(error)
      });
  }

  /**
   * Modifie le lienAvatar lié à l'identifiant dans la base de données
   * @returns 
   */
  update(column: string) {
    return this.httpClient.post<any>(this.baseUrl + `/update${column}.php`, this.user)
      .pipe(map(User => {
        return User;
      }));
  }

  /**
   * Crée un token 'identifiant' dans le localStorage
   * @param value Valeur du token 'identifiant'
   */
  setToken(value: string) {
    localStorage.setItem('identifiant', value);
  }

  /**
   * Récupère la valeur du token 'identifiant' du localStorage
   * @returns Valeur du token 'identifiant''identifiant'
   */
  getToken() {
    return localStorage.getItem('identifiant');
  }

  /**
   * Supprime le token 'identifiant' du localStorage
   */
  deleteToken() {
    localStorage.removeItem('identifiant');
  }

  /**
   * Vérifie si l'utilisateur est connecté en vérifiant la présence d'un token qui a pour clé 'identifiant'
   * Si on en trouve un, renvoie true
   * Sinon, renvoie false
   * @returns boolean
   */
  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      return true
    }
    return false;
  }
}