export class User {
  public identifiant: string;
  public lienAvatar: string;
  public scores: string;
  public lastLogin: string;
  public lastAction: string;
  public visible: string;
  public pseudo: string;
  public score: string;
  public codeTrophees: string;
  public tropheesVisibles: string;
  public cleScore: string

  constructor(identifiant: string, lienAvatar: string, scores: string, lastLogin: string, lastAction: string, visible: string, pseudo: string, score: string,
        codeTrophees: string, tropheesVisibles: string, cleScore: string) {
    this.identifiant = identifiant
    this.lienAvatar = lienAvatar
    this.scores = scores
    this.lastLogin = lastLogin
    this.lastAction = lastAction
    this.visible = visible
    this.pseudo = pseudo
    this.score = score
    this.codeTrophees = codeTrophees
    this.tropheesVisibles = tropheesVisibles
    this.cleScore = cleScore
  }
}
export class UserSimplifie {
  public pseudo: string;
  public lienAvatar: string;
  public score: string;
  public codeTrophees: string;

  constructor(lienAvatar: string, pseudo: string, score: string, codeTrophees: string) {
    this.pseudo = pseudo
    this.lienAvatar = lienAvatar
    this.score = score
    this.codeTrophees = codeTrophees
  }
}
