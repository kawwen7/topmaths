export class User {
  public identifiant: string;
  public lienAvatar: string;
  public scores: string;
  public lastLogin: string;

  constructor(identifiant: string, lienAvatar: string, scores: string, lastLogin: string) {
    this.identifiant = identifiant
    this.lienAvatar = lienAvatar
    this.scores = scores
    this.lastLogin = lastLogin
  }
}
