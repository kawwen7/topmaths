export class Niveau {
  public nom: string
  public sequences: Sequence[]

  constructor(nom: string, sequences: Sequence[]) {
    this.nom = nom
    this.sequences = sequences
  }
}

export class Sequence {
  public reference: string
  public titre: string
  public objectifs: Objectif[]
  public calculsMentaux: CalculMental[]
  public questionsFlash: QuestionFlash[]

  constructor(reference: string, titre: string, objectifs: Objectif[], calculsMentaux: CalculMental[], questionsFlash: QuestionFlash[]) {
    this. reference=reference
    this. titre=titre
    this. objectifs=objectifs
    this. calculsMentaux=calculsMentaux
    this. questionsFlash=questionsFlash
  }
}

export class Objectif {
  public reference: string
  public titre?: string
  public slugs: string[]

  constructor(reference: string, titre: string, slugs: string[]) {
    this.reference = reference
    this.titre = titre
    this.slugs = slugs
  }
}

export class CalculMental {
  public reference: string
  public titre: string
  public niveaux: NiveauCM[]
  public pageExiste: boolean

  constructor(reference: string, titre: string, niveaux: NiveauCM[], pageExiste: boolean) {
    this.reference = reference
    this.titre = titre
    this.niveaux = niveaux
    this.pageExiste = pageExiste
  }
}

export class NiveauCM {
  public commentaire: string
  public lien: string
  public score: string
  public lienACopier?: string
  public graine?: string
  public bonneReponse?: boolean
  public slider?: number

  constructor(commentaire: string, lien: string, score: string, lienACopier: string, graine: string, bonneReponse: boolean, slider: number) {
    this.commentaire = commentaire
    this.lien = lien
    this.score = score
    this.lienACopier = lienACopier
    this.graine = graine
    this.bonneReponse = bonneReponse
    this.slider = slider
  }
}

export class QuestionFlash {
  public reference: string
  public titre: string
  public slug: string
  public pageExiste: boolean

  constructor(reference: string, titre: string, slug: string, pageExiste: boolean) {
    this.reference = reference
    this.titre = titre
    this.slug = slug
    this.pageExiste = pageExiste
  }
}

export class SequenceParticuliere {
  public reference: string
  public titre: string
  
  constructor(reference: string, titre: string) {
    this.reference = reference
    this.titre = titre
  }
}