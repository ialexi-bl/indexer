export default {
  /* Workspace */
  Year: 'Rok',
  Document: 'Dokument',
  Husband: 'Mąż',
  Wife: 'Żona',
  'First name': 'Imię',
  'Last name': 'Nazwisko',
  'Maiden name': 'Z domu',
  Alias: 'Alias',
  'Primo voto': 'Primo voto',
  Age: 'Wiek',
  Father: 'Ojciec',
  Mother: 'Matka',
  Other: 'Inne',
  Add: 'Dodaj',
  'Table was saved': 'Tabela została zapisana',
  'You should enter some data!': 'Wymagane jest wprowadzenie danych!',

  /* Buttons */
  Cancel: 'Anuluj',
  Choose: 'Wybierz',
  Yes: 'Tak',
  No: 'Nie',

  /* Help */
  Info: 'Informacje',
  'Your language has been chosen automatically. Change it, if it is wrong. You can do it later using the "View" menu.':
    'Twój język został ustawiony automatycznie. Zmień go, jeśli to konieczne. Możesz to zrobić później w menu „Widok”.',
  about_article: `
<0>Ten program został stworzony dla osób, indeksujących dokumenty dla projektu „Poznan Project”. Aby rozpocząć działanie, skorzystaj z menu na górze.</0>
`.trim(),
  help_article: `
<0>Pomoc</0>
<1>Przestrzeń robocza</1>
<2>Przestrzeń robocza składa się z trzech części: pola dla ogólnych danych, informacji o mężu i o żonie. Przy zapisywaniu danego rekordu pole roku nie ulegnie zmianie, natomiast numer dokumentu zostanie zwiększony o jeden. Korzystaj z klawiszy <1><0></0></1> / <3><0></0></3> / <5><0></0></5> / <7><0></0></7>, aby przejść do następnego, i <9><0></0></9> / <11><0></0></11> / <13><0></0></13> - aby wrócić do poprzedniego pola. Jeśli przemieścisz się do przodu z zaznaczonym polem „Dodaj”, rekord zostanie automatycznie dodany do dokumentu.<2>
<3>Niektóre, rzadko używane pola, są domyślnie nieaktywne. Zostaną włączone, jeśli na nie klikniesz lub przemieścisz się na nie, używając klawisza <1><0></0></1>.</3>
<4>Przy dokonywaniu zmian w polach rodziców, skorzystaj z symbolu <1></1> znajdującego się po prawej stronie, lub ze skrótu klawiszowego <3><0></0></3>, aby oznaczyć ich jako zmarłych.</4>
<5>Menu</5>
<6>Menu <0>Plik</0> pozwala stworzyć albo zaimportować plik Microsoft Excel, a także zapisać tabelę, nad którą pracujesz. Przy imporcie dokumentu możesz wskazać, czy pierwszy wiersz zawiera konkretne dane, czy nagłówki. Możesz także określić, w jakiej kolejności są ułożone kolumny w twojej tabeli, aby została ona zaimportowana prawidłowo.</6>
<7>Skorzystaj z funkcji <1>Pogląd</1>, aby sprawdzić, czy wszystkie komórki w tabeli zostały wypełnione prawidłowo, i w razie potrzeby zmienić ich zawartość. Anuluj zmiany za pomocą <3><0></0></3> Przywróć zmiany za pomocą <5><0></0></5><6></6><7><0></0></7>.</7>
<8>В Menu <0>Wygląd</0> możesz włączyć tryb nocny, zakotwiczyć okno przed pozostałymi, a także zmienić język. <8>

<9>Skróty klawiszowe</9>
<10>Skorzystaj z <1><0></0></1>, aby oznaczyć osobę jako zmarłą tam, gdzie jest to możliwe.</10>
<11>Możesz wyczyścić pole, nad którym pracujesz z pomocą <1><0></0></1>.</11>
<12>Kliknij na nazwę pola lub użyj <1><0></0></1>, aby oznaczyć, że nie jesteś pewny co do zawartości pola.</12>
<13>Zapisz tabelę, używając <1><0></0></1>.</13>
`.trim(),

  /* Title bar */
  /* В левом верхнем углу есть кнопка "Файл", в ней пункты "новый", "импортировать", ...,
  как в ворде. Проверь, чтобы названия были такими, как в других программах */
  File: 'Plik',
  New: 'Nowy',
  Import: 'Importuj',
  Preview: 'Pogląd',
  Save: 'Zapisz',
  'Save as': 'Zapisz jako',

  View: 'Widok',
  'Pin on top of other windows': 'Zakotwicz przed innymi oknami',
  'Night mode': 'Tryb nocny',
  Language: 'Język',
  'Fields order': 'Porządek pól',

  Help: 'Pomoc',
  About: 'О programie',

  Edit: 'Edytuj',
  Undo: 'Anuluj',
  Redo: 'Cofnij',
  'Undo all': 'Anuluj wszystko',

  /* Import modal */
  'Import file': 'Importuj plik',
  'Choose file': 'Wybierz plik',
  /* Это для проверки, что первая строка документа, который пользователь испортирует, содержит заголовки, а не данные. Если заголовки - то они будут удалены */
  "Contains headers (Don't change to auto detect)":
    '”Zawiera nagłówki (Nie wprowadzaj zmian, żeby określić automatycznie)”',
  /* Выбор, в каком порядке в файле расположены колонки */
  'Drag to specify, in which order the columns are arranged in your file':
    'Przesuwaj, aby ustalić kolejność kolumn w pliku',
  'An error happened during import': 'W czasie importu wystąpił błąd',
  'Document imported successfully': 'Dokument został zaimportowany pomyślnie',
  'If you continue, all unsaved changes will be lost. Do you want to save them?':
    'Przy kontynuacji wszystkie niezapisane dane zostaną utracone. Czy chcesz je zapisać?',
  'Export path': 'Ścieżka eksportu',
  'Save document': 'Zapisz dokument',

  // File creation modal
  'Microsoft Excel table': 'Tabela Microsoft Excel',
  'Create file': 'Utwórz plik',
  Create: 'Utwórz',
  'Document created successfully': 'Dokument został pomyślnie utworzony',
  'An error happened while creating a file':
    'Przy próbie utworzenia pliku wystąpił błąd',

  'Drag to specify the order of the input fields.':
    'Przesuwaj, aby ustalić kolejność pól do wprowadzania danych',
  'Input fields order': 'Kolejność poł',
}
