export class User {
  public identifiant: string;
  public lienAvatar: string;
  public scores: string;
  public lastLogin: string;
  public lastAction: string;
  public visible: string;
  public pseudo: string;

  constructor(identifiant: string, lienAvatar: string, scores: string, lastLogin: string, lastAction: string, visible: string, pseudo: string) {
    this.identifiant = identifiant
    this.lienAvatar = lienAvatar
    this.scores = scores
    this.lastLogin = lastLogin
    this.lastAction = lastAction
    this.visible = visible
    this.pseudo = pseudo
  }
}
