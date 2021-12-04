export class Trophee5e {
  public reference: string
  public nombreDeVerts: number
  public calculs: number
  public arithmetique: number
  public fractions: number
  public nombresRelatifs: number
  public calculLitteral: number
  public maitriserScratch: number
  public maitriserGeogebra: number
  public proportionnalite: number
  public statistiques: number
  public probabilites: number
  public fonctions: number
  public perimetreEtAire: number
  public volume: number
  public durees: number
  public symetries: number
  public triangles: number
  public angles: number
  public parallelogrammes: number
  public espace: number
  public obtenirSonBrevetDeTuteur: number
  public faireUnExpose: number
  public presenterLeTravailDeSonGroupe: number
  public niveau: string
  public peutDemanderEval: string

  constructor(reference: string, nombreDeVerts: number, calculs: number, arithmetique: number, fractions: number, nombresRelatifs: number,
    calculLitteral: number, maitriserScratch: number, maitriserGeogebra: number, proportionnalite: number, statistiques: number, probabilites: number,
    fonctions: number, perimetreEtAire: number, volume: number, durees: number, symetries: number, triangles: number, angles: number,
    parallelogrammes: number, espace: number, obtenirSonBrevetDeTuteur: number, faireUnExpose: number, presenterLeTravailDeSonGroupe: number, niveau: string,
    peutDemanderEval: string) {
    this.reference = reference
    this.nombreDeVerts = nombreDeVerts
    this.calculs = calculs
    this.arithmetique = arithmetique
    this.fractions = fractions
    this.nombresRelatifs = nombresRelatifs
    this.calculLitteral = calculLitteral
    this.maitriserScratch = maitriserScratch
    this.maitriserGeogebra = maitriserGeogebra
    this.proportionnalite = proportionnalite
    this.statistiques = statistiques
    this.probabilites = probabilites
    this.fonctions = fonctions
    this.perimetreEtAire = perimetreEtAire
    this.volume = volume
    this.durees = durees
    this.symetries = symetries
    this.triangles = triangles
    this.angles = angles
    this.parallelogrammes = parallelogrammes
    this.espace = espace
    this.obtenirSonBrevetDeTuteur = obtenirSonBrevetDeTuteur
    this.faireUnExpose = faireUnExpose
    this.presenterLeTravailDeSonGroupe = presenterLeTravailDeSonGroupe
    this.niveau = niveau
    this.peutDemanderEval = peutDemanderEval
  }
}

export class Trophee4e {
  public reference: string
  public nombreDeVerts: number
  public relatifs: number
  public fractions: number
  public puissances: number
  public arithmetique: number
  public calculLitteral: number
  public maitriserLinformatique: number
  public statistiques: number
  public probabilites: number
  public proportionnalite: number
  public fonctions: number
  public translation: number
  public theoremeDePythagore: number
  public theoremeDeThales: number
  public cosinusDunAngleAigu: number
  public espace: number
  public presenterLeTravailDeSonGroupe: number
  public faireUnExpose: number
  public obtenirSonBrevetDeTuteur: number
  public niveau: string
  public peutDemanderEval: string

  constructor(reference: string, nombreDeVerts: number, relatifs: number, fractions: number, puissances: number, arithmetique: number,
    calculLitteral: number, maitriserLinformatique: number, statistiques: number, probabilites: number, proportionnalite: number,
    fonctions: number, translation: number, theoremeDePythagore: number, theoremeDeThales: number, cosinusDunAngleAigu: number,
    espace: number, presenterLeTravailDeSonGroupe: number, faireUnExpose: number, obtenirSonBrevetDeTuteur: number, niveau: string,
    peutDemanderEval: string) {
    this.reference = reference
    this.nombreDeVerts = nombreDeVerts
    this.relatifs = relatifs
    this.fractions = fractions
    this.puissances = puissances
    this.arithmetique = arithmetique
    this.calculLitteral = calculLitteral
    this.maitriserLinformatique = maitriserLinformatique
    this.statistiques = statistiques
    this.probabilites = probabilites
    this.proportionnalite = proportionnalite
    this.fonctions = fonctions
    this.translation = translation
    this.theoremeDePythagore = theoremeDePythagore
    this.theoremeDeThales = theoremeDeThales
    this.cosinusDunAngleAigu = cosinusDunAngleAigu
    this.espace = espace
    this.presenterLeTravailDeSonGroupe = presenterLeTravailDeSonGroupe
    this.faireUnExpose = faireUnExpose
    this.obtenirSonBrevetDeTuteur = obtenirSonBrevetDeTuteur
    this.niveau = niveau
    this.peutDemanderEval = peutDemanderEval
  }
}

export class Niveau {
  nom: string
  trophees: Trophee[]

  constructor (nom: string, trophees: Trophee[]) {
    this.nom = nom
    this.trophees = trophees
  }
}

export class Trophee {
  id: string
  lien: string
  description: string
  cle: string
  categorie: string
  nbVertsMin: number
  nb: number
  tooltip: string
  refaire: string

  constructor (id: string, lien: string, description: string, cle: string, categorie: string, nbVertsMin: number, nb: number = 0, tooltip: string, refaire: string) {
    this.id = id
    this.lien = lien
    this.description = description
    this.cle = cle
    this.categorie = categorie
    this.nbVertsMin = nbVertsMin
    this.nb = nb
    this.tooltip = tooltip
    this.refaire = refaire
  }
}
