import { Injectable, Output, EventEmitter } from '@angular/core';
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
  lienAvatar: string

  @Output() majProfil: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient, private router: Router) {
    this.user = {
      identifiant: '0000',
      lienAvatar: ''
    }
    this.lienAvatar = ''
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
        this.setToken('identifiant', Users[0].identifiant);
        this.setToken('lienAvatar', Users[0].lienAvatar);
        const user : User = {
          identifiant: Users[0].identifiant,
          lienAvatar: Users[0].lienAvatar
        }
        this.majProfil.emit(user);
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
   * Vérifie dans le localStorage s'il y a présence des différents token : identifiant, lienAvatar
   * Renvoie l'objet User contenant ces informations
   * @returns User
   */
  recupereProfil() {
    const identifiant = this.getToken('identifiant')
    if (identifiant != null) this.user.identifiant = identifiant
    const lienAvatar = this.getToken('lienAvatar')
    if (lienAvatar == null) {
      this.lienAvatar = ''
    } else {
      this.lienAvatar = lienAvatar
    }
    const user: User = {
      identifiant: this.user.identifiant,
      lienAvatar: this.lienAvatar
    }
    return user
  }
  
  /**
   * Modifie le token lienAvatar et le lienAvatar dans la bdd
   * @param lienAvatar 
   */
  majAvatar(lienAvatar: string){
    const identifiant = this.getToken('identifiant')
    if (identifiant != null) this.user.identifiant = identifiant
    this.setToken('lienAvatar', lienAvatar)
    this.majProfil.emit({
      idenfitiant: this.user.identifiant,
      lienAvatar: lienAvatar
    });
    this.updateAvatar(this.user.identifiant, lienAvatar)
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
   * Modifie le lienAvatar lié à l'identifiant dans la base de données
   * @param identifiant 
   * @param lienAvatar 
   * @returns 
   */
  updateAvatar(identifiant: string, lienAvatar: string){
    return this.httpClient.post<any>(this.baseUrl + '/edit.php', { identifiant : identifiant, lienAvatar : lienAvatar })
      .pipe(map(User => {
        console.log(User)
        return User;
      }));
  }

  /**
   * Crée un token dans le localStorage
   * @param key Clé du token
   * @param value Valeur du token
   */
  setToken(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  /**
   * Récupère la valeur d'un token du localStorage
   * @param key Clé du token
   * @returns Valeur du token
   */
  getToken(key: string) {
    return localStorage.getItem(key);
  }

  /**
   * Supprime un token du localStorage
   * @param key Clé du token
   */
  deleteToken(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Vérifie si l'utilisateur est connecté en vérifiant la présence d'un token qui a pour clé 'identifiant'
   * Si on en trouve un, renvoie true
   * Sinon, renvoie false
   * @returns boolean
   */
  isLoggedIn() {
    const usertoken = this.getToken('identifiant');
    if (usertoken != null) {
      return true
    }
    return false;
  }
}