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
  baseUrl: string = "https://beta.topmaths.fr/api";
  user: User

  @Output() majProfil: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient, private router: Router) {
    this.user = {
      identifiant: '',
      lienAvatar: '',
      scores: '',
      lastLogin: ''
    }
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
        lienAvatar: 'https://avatars.dicebear.com/api/adventurer/DevMode.svg',
        scores: 'desactives',
        lastLogin: ''
      }
      this.setToken(this.user.identifiant);
      this.router.navigate(['profil'])
    } else {
      this.userlogin(identifiant)
        .pipe(first())
        .subscribe(
          data => {
            if (redirige) {
              const redirect = this.redirectUrl ? this.redirectUrl : 'profil';
              this.router.navigate([redirect]);
            }
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
      this.userregistration(identifiant)
        .pipe(first())
        .subscribe(
          data => {
            this.login(identifiant, true)
          },
          error => {
            this.erreurRegistration('userregistration', error)
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
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)')
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
        // Après avoir récupéré le profil utilisateur, on met à jour le lastLogin
        this.majLastLogin()
        return Users;
      }));
  }

  /**
   * Envoie l'identifiant à register.php pour l'ajouter à la bdd
   * Renvoie les informations de l'User créé
   * @param identifiant à écrire dans la bdd
   * @returns User créé
   */
  public userregistration(identifiant: string) {
    return this.httpClient.post<any>(this.baseUrl + '/register.php', { identifiant : identifiant, lienAvatar: `https://avatars.dicebear.com/api/adventurer/${identifiant}.svg` })
      .pipe(map(User => {
        return User;
      }));
  }
  
  /**
   * Modifie le token lienAvatar et le lienAvatar dans la bdd
   * @param lienAvatar 
   */
  majAvatar(lienAvatar: string){
    this.user.lienAvatar = lienAvatar
    this.update('lienAvatar')
    .pipe(first())
    .subscribe(
      data => {
        const redirect = this.redirectUrl ? this.redirectUrl : 'profil';
        this.router.navigate([redirect]);
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Modifie le token lienAvatar et le lienAvatar dans la bdd
   * @param scores peut être 'actives' ou 'desactives'
   */
   majScores(scores: string){
    this.user.scores = scores
    this.update('scores')
    .pipe(first())
    .subscribe(
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
   majLastLogin(){
    this.update('lastLogin')
    .pipe(first())
    .subscribe(
      data => {
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Modifie le lienAvatar lié à l'identifiant dans la base de données
   * @returns 
   */
  update(column: string){
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