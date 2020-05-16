export default {
  // Workspace
  Year: 'An',
  Document: 'Document',
  Husband: 'Mari',
  Wife: 'Femme',
  'First name': 'Prnom',
  'Last name': 'Nom de famille',
  'Maiden name': 'Nom de jeune fille',
  Alias: 'Alias',
  'Primo voto': 'Par le premier mariage',
  Age: 'Âge',
  Father: 'Père',
  Mother: 'Mère',
  Other: 'Autre',
  Add: 'Ajouter',
  'Table was saved': 'Le tableau a été sauvegardé',
  'You should enter some data!': 'Entrez les données prémièrement!',

  // Buttons
  Cancel: 'Annuler',
  Choose: 'Choisir',
  Yes: 'Oui',
  No: 'Non',

  // Help
  'Your language has been chosen automatically. Change it, if it is wrong. You can do it later using the "View" menu.':
    'La langue a été choisie automatiquement`. Changez-la, si elle n\'est pas correcte. Vous pourrez le faire plus tard dans le menu "Vue"',
  about_article: `
<0>Cette application est créée pour les collaborateurs du projet Poznan. Utilisez les menus en dessus pour commencer.</0>
`.trim(),
  help_article: `
<0>Aide</0>
<1>L'espace de travail</1>
<2>L'espace de travail a trois parties: les formes des données générales, de l'imformation du mari et de la femme. Si vous sauvegardez les données, le champ de l'année ne changera pas et le numéro du document augmentera par un. Utilisez <1><0></0></1> / <3><0></0></3> / <5><0></0></5> / <7><0></0></7> pour naviguer au champ suivant et <9><0></0></9> / <11><0></0></11> / <13><0></0></13> pour aller au champ précédent. Si vous bougez en avant en ayant le focus sur le bouton "Ajouter", les données seront ajouter dans le document automatiquement.</2>
<3>Quelques champs, qui sont utilisés rarement, dont désactivés par défaut. Ils activeront à nouveau si vous appuyez sur eux ou naviguez vers eux en pressant <1><0></0></1>.</3>
<4>En éditant les champs des parents, utilisez l'icône <1></1> à droite ou le raccourci clavier <3><0></0></3> pour marquez, qu'ils sont morts..</4>
<5>Menus</5>
<6>Le menu <0>Fichier</0> permet de créer et importer les fichier Microsoft Excel, ainsi que savegarder le tableau avec lequel vous travaillez. En important le document, vous pouvez déterminer si sa première ligne contient des données ou des en-têtes. En plus vous pouvez préciser l'ordre, dans lequel les colonnes sont arrangées dans votre tableau, pour qu'il soit importé correctement.</6>
<7>Utilisez la fonction de <1>l'aperçu</1> pour vérifier que toutes les cellules sont remplies correctement et sinon changer leur contenu. Annulez les changements avec <3><0></0></3> et les rétablissez avec <5><0></0></5><6></6><7><0></0></7>.</7>
<8>Dans le menu <0>Vue</0> vous pouvez activer le mode nuit, épingler la fenêtre pour qu'elle soit toujours au-dessus des autres et changer la langue.</8>

<9>Raccourcis clavier</9>
<10>Utilisez <1><0></0></1> pour marquer, qu'une personne est morte où c'est possible.</10>
<11>Vous pouvez effacer le champ avec <1><0></0></1>.</11>
<12>Appuyez sur l'étiquette du champ ou tappez <1><0></0></1> pour marquer, que vous n'êtes pas sûr de son contenu.</12>
<13>Sauvegardez le tableau avec <1><0></0></1>.</13>
`.trim(),

  // Title bar
  File: 'Fichier',
  New: 'Nouveau',
  Import: 'Importer',
  Preview: 'Aperçu',
  Save: 'Sauvegarder',
  'Save as': 'Sauvegarder comme',

  View: 'Vue',
  'Pin on top of other windows': "Mettre au-dessus d'autres fenêtres",
  'Night mode': 'Mode nuit',
  Language: 'Langue',
  'Fields order': "L'ordeur des champs",

  Help: 'Aide',
  About: 'À propos du programme',

  Edit: 'Édition',
  Undo: 'Annuler',
  Redo: 'Rétablir',
  'Undo all': 'Annuler tous',
  'Input fields order': 'Ordre de champs',

  // Import modal
  'Import file': 'Importer un fichier',
  'Choose file': 'Choisissez un fichier',
  "Contains headers (Don't change to auto detect)":
    'Intitulé (ne changez pas pour déter\u00ADminer auto\u00ADma\u00ADtique\u00ADment)',
  'Drag to specify, in which order the columns are arranged in your file':
    "Faites glisser pour définir l'ordre, dans lequel les champs sont arrangés",
  'An error happened during import':
    "Une erreure s'est passée au cours de l'importation",
  'Document imported successfully': 'Le document a été importé avec succès',
  'If you continue, all unsaved changes will be lost. Do you want to save them?':
    'Si vous continuez, tous les changements non enregistrés seront perdus. Est-ce que vous voulez les sauvegarder?',
  'Export path': "Chemin d'export",
  'Save document': 'Sauvegarder le document',

  // File creation modal
  Create: 'Créer',
  'Create file': 'Créer un fichier',
  'Microsoft Excel table': 'Tableau Microsoft Excel',
  'Document created successfully': 'Un document a été importé avec succès',
  'An error happened while creating a file':
    "Une erreure s'est passée au cours de la création du fichier",

  'Drag to specify the order of the input fields.':
    "Faites glisser pour déterminer l'ordeur des champs.",
}

// è à é Â À ê Ç ç Ï ï î ô ù
