import { Component, OnInit, isDevMode } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  angForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: ApiService, private router: Router) {
    this.angForm = this.fb.group({
      identifiant: ['', [Validators.required, Validators.minLength(4), Validators.minLength(5)]]
    });
  }

  ngOnInit() {
  }

  /**
   * Récupère l'identifiant du formulaire et le passe à l'API pour tenter de se connecter.
   * Si connecté, on redirige vers la page qu'on a voulu accéder ou vers la page profil.
   * Si pas connecté, on renvoie vers erreurLogin pour tenter de créer l'identifiant.
   * @param angForm1 formulaire
   */
  login(angForm1: FormGroup) {
    if (isDevMode()) {
      const user = {
        identifiant: 'X',
        lienAvatar: ''
      }
      this.dataService.setToken('identifiant', user.identifiant);
      this.dataService.majProfil.emit(user);
    } else {
      this.dataService.userlogin(angForm1.value.identifiant)
        .pipe(first())
        .subscribe(
          data => {
            const redirect = this.dataService.redirectUrl ? this.dataService.redirectUrl : 'profil';
            this.router.navigate([redirect]);
          },
          error => {
            this.erreurLogin(angForm1)
          });
    }
  }

  /**
   * Vérifie la longueur et la présence de caractères spéciaux dans la chaîne.
   * Si tout est ok, on passe l'identifiant à l'API pour le créer.
   * @param angForm1 
   */
  registration(angForm1: FormGroup) {
    if (angForm1.value.identifiant.length > 5 || angForm1.value.identifiant.length < 4) {
      this.erreurRegistration('longueur')
    } else if (!this.onlyLettersAndNumbers(angForm1.value.identifiant)) {
      this.erreurRegistration('caracteres_speciaux')
    } else {
      this.dataService.userregistration(angForm1.value.identifiant)
        .pipe(first())
        .subscribe(
          data => {
            this.login(angForm1)
          },
          error => {
            this.erreurRegistration('userregistration', error)
          });
    }
  }

  /**
   * Prévient que l'identifiant n'existe pas et redirige vers la création d'un nouveau
   * @param angForm1 Données du formulaire transmises par la fonction de login
   */
  erreurLogin(angForm1: FormGroup) {
    alert('Cet identifiant n\'existe pas, le créer ?')
    this.registration(angForm1)
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
      alert('Une erreur s\'est produite lors de l\'accès à la base de données. :' + erreur.toString())
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
   * Renvoie l'identifiant présent dans le formulaire
   */
  get identifiant() { return this.angForm.get('identifiant'); }
}