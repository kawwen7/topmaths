import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User, UserSimplifie } from './user';
import { Router } from '@angular/router';
import { Trophee4e, Trophee5e } from './trophees';

interface Message {
  message: string
}

interface Nom {
  nom: string
}

interface Adjectif {
  masculin: string,
  feminin: string
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  redirectUrl: string = ''
  baseUrl: string = "https://topmaths.fr/api";
  isloggedIn: boolean
  user: User
  onlineUsers: UserSimplifie[]
  classement: UserSimplifie[]
  onlineNb: number
  feminin: boolean
  listeMasculins: Nom[]
  listeFeminins: Nom[]
  listeAdjectifs: Adjectif[]
  pseudoClique: string
  ancienPseudoClique: string
  lienTropheesClique: string
  trophees!: Trophee5e | Trophee4e

  @Output() profilModifie: EventEmitter<string[]> = new EventEmitter();
  constructor(private http: HttpClient, private router: Router) {
    this.user = {
      identifiant: '',
      lienAvatar: '',
      scores: '',
      lastLogin: '',
      lastAction: '',
      visible: '',
      pseudo: '',
      score: '0',
      codeTrophees: '',
      tropheesVisibles: '',
      cleScore: ''
    }
    this.onlineUsers = []
    this.classement = []
    this.onlineNb = 0
    this.feminin = false
    this.pseudoClique = ''
    this.ancienPseudoClique = ''
    this.lienTropheesClique = ''
    this.listeMasculins = []
    this.listeFeminins = []
    this.listeAdjectifs = []
    this.isloggedIn = false
    this.surveilleModificationsDuProfil()
    this.recupereDonneesPseudos() // En cas de création d'un nouveau compte
  }

  /**
   * Surveille les modifications du profil
   * À chaque modification du profil :
   * - Met à jour la dernière action
   */
  surveilleModificationsDuProfil() {
    this.profilModifie.subscribe(valeursModifiees => {
      if (!valeursModifiees.includes('score')) this.majLastAction()
    })
  }

  /**
   * Récupère dans les utilisateurs de la base de données par score décroissant
   */
  recupClassement() {
    if (isDevMode()) {
      this.classement = [
        {
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: 'tcqnfy'
        }, {
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: 'tuoocj'
        }
      ]
    } else {
      this.http.get<UserSimplifie[]>(this.baseUrl + '/classement.php').subscribe(usersSimplifies => {
        this.classement = usersSimplifies
      }, error => {
        console.log(error)
      })
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
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: 'tuoocj'
        }, {
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: 'tuoocj'
        }
      ]
    } else {
      this.http.get<UserSimplifie[]>(this.baseUrl + '/whosonline.php').subscribe(userSimplifies => {
        const infos = userSimplifies.pop() // Le dernier usersSimplifie n'en est pas un mais sert juste à récupérer des infos comme le nombre de personnes en ligne
        if (typeof (infos) != 'undefined') this.onlineNb = parseInt(infos.pseudo)
        this.onlineUsers = userSimplifies
      }, error => {
        console.log(error)
      })
    }
  }

  /**
   * Envoie l'identifiant par message post à login.php pour s'identifier
   * Si pas connecté, on renvoie vers erreurLogin pour tenter de créer l'identifiant.
   * Si connecté :
   * - Met à jour le lastLogin
   * - Crée/modifie un token dans le localstorage avec l'identifiant du premier utilisateur correspondant dans la bdd
   * - Fire un event pour prévenir de la connexion
   * - Redirige vers la page qu'on a voulu accéder ou vers la page profil.
   * @param identifiant identifiant à chercher dans la bdd
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
        score: '196',
        codeTrophees: 'tuoocj',
        tropheesVisibles: '',
        cleScore: 'abc'
      }
      this.setToken(this.user.identifiant);
      this.isloggedIn = true
      this.profilModifie.emit([
        'identifiant',
        'lienAvatar',
        'scores',
        'lastLogin',
        'lastAction',
        'visible',
        'pseudo',
        'score',
        'codeTrophees',
        'tropheesVisibles'])
    } else {
      this.http.post<User[]>(this.baseUrl + '/login.php', { identifiant }).subscribe(users => {
        if (users[0].identifiant == 'personne') {
          console.log('identifiant non trouvé, on en crée un nouveau')
          this.registration(identifiant)
        } else {
          this.isloggedIn = true
          this.setToken(users[0].identifiant);
          this.user = users[0]
          this.profilModifie.emit([
            'identifiant',
            'lienAvatar',
            'scores',
            'lastLogin',
            'lastAction',
            'visible',
            'pseudo',
            'score',
            'codeTrophees',
            'tropheesVisibles'])
          if (redirige) {
            const redirect = this.redirectUrl ? this.redirectUrl : 'profil';
            this.router.navigate([redirect]);
          }
        }
      },
        error => {
          console.log(error)
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
      const user: User = {
        identifiant: identifiant,
        lienAvatar: `https://avatars.dicebear.com/api/adventurer/${identifiant}.svg`,
        scores: '',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: this.pseudoAleatoire(),
        score: '0',
        codeTrophees: '',
        tropheesVisibles: '',
        cleScore: ''
      }
      this.http.post<User[]>(this.baseUrl + '/register.php', user).subscribe(users => {
        this.isloggedIn = true
        this.setToken(users[0].identifiant);
        this.user = users[0]
        this.profilModifie.emit([
          'identifiant',
          'lienAvatar',
          'scores',
          'lastLogin',
          'lastAction',
          'visible',
          'pseudo',
          'score',
          'codeTrophees',
          'tropheesVisibles'])
          this.router.navigate(['profil'])
      }, error => {
        this.erreurRegistration('userregistration', error['message'])
      });
    }
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
  recupereDonneesPseudos() {
    this.http.get<Nom[]>('assets/data/nomsMasculins.json').subscribe(noms => {
      this.listeMasculins = noms
    })
    this.http.get<Nom[]>('assets/data/nomsFeminins.json').subscribe(noms => {
      this.listeFeminins = noms
    })
    this.http.get<Adjectif[]>('assets/data/adjectifs.json').subscribe(adjectifs => {
      this.listeAdjectifs = adjectifs
    })
  }

  /**
   * Modifie le lienAvatar dans la bdd
   * @param lienAvatar 
   */
  majAvatar(lienAvatar: string) {
    this.user.lienAvatar = lienAvatar
    this.majProfil(['lienAvatar'])
  }

  /**
   * Modifie le pseudo dans la bdd
   * @param pseudo 
   */
  majPseudo(pseudo: string) {
    this.user.pseudo = pseudo
    this.majProfil(['pseudo'])
  }

  /**
   * Récupère le score actuel
   * Ajoute le score de l'exercice
   * Met à jour le score de la base de données
   * @param score à ajouter 
   * @param url de l'exercice en question
   */
  majScore(score: string, url: string) {
    if (isDevMode()) {
      this.profilModifie.emit(['score'])
    } else {
      this.http.post<User[]>(this.baseUrl + `/majScore.php`, {
        identifiant: this.user.identifiant,
        score: (parseInt(this.user.score) + parseInt(score)).toString(),
        cleScore: this.user.cleScore,
        url: url
      }).subscribe(
        users => {
          console.log(users[0])
          this.user.score = users[0].score
          this.user.cleScore = users[0].cleScore
          this.profilModifie.emit(['score'])
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Modifie le token lienAvatar et le lienAvatar dans la bdd
   * @param scores peut être 'actives' ou 'desactives'
   */
  majScores(scores: string) {
    this.user.scores = scores
    this.majProfil(['scores'])
  }

  /**
   * Modifie la date de dernière action
   * Met à jour la liste d'utilisateurs en ligne et leur nombre
   */
  majLastAction() {
    if (isDevMode()) {
      this.onlineNb = 2
      this.onlineUsers = [
        {
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: ''
        }, {
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: ''
        }
      ]
    } else {
      if (typeof (this.user.identifiant) != 'undefined' && this.user.identifiant != '') {
        this.http.post<UserSimplifie[]>(this.baseUrl + `/actionUtilisateur.php`, { identifiant: this.user.identifiant }).subscribe(userSimplifies => {
          const infos = userSimplifies.pop() // Le dernier usersSimplifie n'en est pas un mais sert juste à récupérer des infos comme le nombre de personnes en ligne
          if (typeof (infos) != 'undefined') this.onlineNb = parseInt(infos.pseudo)
          this.onlineUsers = userSimplifies
        },
          error => {
            console.log(error)
          });
      }
    }
  }


  /**
   * Supprime le token de clé 'identifiant' utilisé pour vérifier si l'utilisateur est connecté.
   * Supprime aussi le token de clé 'lienAvatar'
   * Toggle les profilbtn et loginbtn.
   * Renvoie vers l'accueil.
   */
  logout() {
    this.http.post(this.baseUrl + `/logout.php`, this.user).subscribe(
      data => {
        this.deleteToken()
        this.user = new User('', '', '', '', '', '', '', '', '', '', '')
        this.isloggedIn = false
        this.profilModifie.emit([
          'identifiant',
          'lienAvatar',
          'scores',
          'lastLogin',
          'lastAction',
          'visible',
          'pseudo',
          'score',
          'codeTrophees',
          'tropheesVisibles'])
        this.router.navigate(['accueil'])
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
    this.majProfil(['visible'])
  }

  /**
   * @param tropheesVisibles peut être 'oui' ou 'non'
   */
  majTropheesVisibles(tropheesVisibles: string) {
    this.user.tropheesVisibles = tropheesVisibles
    this.majProfil(['tropheesVisibles'])
  }

  /**
   * Met à jour le codeTrophees du profil local et de celui de la bdd
   * @param codeTrophees
   */
  majCodeTrophees(codeTrophees: string) {
    this.user.codeTrophees = codeTrophees
    this.majProfil(['codeTrophees'])
  }

  /**
   * Envoie un mail au propriétaire du site
   * @param message
   */
  envoiMailEval(codeTrophee: string, sujetEval: string) {
    this.http.post<Message>(this.baseUrl + `/envoiMailEval.php`, { codeTrophee: codeTrophee, sujetEval: sujetEval }).pipe(first()).subscribe(
      message => {
        if (message.message == 'mail envoye') {
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
   * Met à jour le profil de l'utilisateur
   */
  majProfil(valeursModifiees: string[]) {
    if (isDevMode()) {
      this.profilModifie.emit(valeursModifiees)
    } else {
      this.http.post<User[]>(this.baseUrl + `/majProfil.php`, this.user).subscribe(
        users => {
          console.log(users[0])
          this.profilModifie.emit(valeursModifiees)
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * On renseigne soit le lienTrophees, soit le codeTrophees
   * Renvoie la liste des trophées
   * Si on passe par le lienTrophees, ne permet pas de demander à refaire une évaluation
   * Si on passe par le codeTrophees, permet de demander à refaire une évaluation
   * @param lienTrophees public, affiché dans le classement et la liste des personnes en ligne
   * @param codeTrophees privé, remis par le professeur, permet de voir ses trophées, de le lier à son profil et de demander à refaire une évaluation
   */
  getTrophees(lienTrophees: string, codeTrophees: string) {
    this.http.post<Trophee5e | Trophee4e>(this.baseUrl + `/trophees.php`, { lienTrophees: lienTrophees, codeTrophees: codeTrophees }).subscribe(
      trophees => {
        if (codeTrophees != '' && lienTrophees == '') {
          this.majCodeTrophees(codeTrophees)
        }
        this.trophees = trophees
        this.profilModifie.emit(['trophees'])
      },
      error => {
        console.log(error)
      })
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
  checkLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      this.isloggedIn = true
    } else {
      this.isloggedIn = false
    }
  }
}