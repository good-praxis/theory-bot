export default {
  dailyChecks: [
    {
      url: 'http://autismus-berlin.de/angebote/erwachsenenberatung/',
      title: 'Autismus Deutschland',
      target:
        'Leider  das Beratungsangebot der Erwachsenenberatungsstelle derzeit nicht.',
      targetNotFoundMessage:
        'Die Erwachsenenberatungsstelle von Autismus Deutschland ist vielleicht wieder verfügbar!',
    },
    {
      url:
        'https://psychiatrie.charite.de/leistungen/ambulanzbereich/autismus_sprechstunde/',
      title: 'Charité',
      target:
        'Leider ist unsere Warteliste für eine weiterführende Diagnostik aufgrund der hohen Nachfrage zur Zeit wieder geschlossen.',
      targetNotFoundMessage:
        'Die Autismus Ambulanz der Chartié ist vielleicht wieder eröffnet.',
    },
    {
      url: 'https://www.psychologie.hu-berlin.de/de/praxis/ambulanz/psysozin',
      title: 'HU Berlin',
      target:
        'Leider ist unsere Warteliste für Neuaufnahmen für eine Diagnostik derzeit aufgrund der großen Nachfrage weiterhin geschlossen.',
      targetNotFoundMessage:
        'Die Diagnose durch die HU Berlin ist vielliecht wieder möglich!',
    },
  ],
}
