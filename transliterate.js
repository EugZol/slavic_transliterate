function mapTextNodes(element, f) {
  for (let node of element.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const nodeName = node.nodeName.toLowerCase();
      if ([
        'script',
        'style',
        'code',
        'pre',
        'textarea',
        'template',
        'svg'
      ].includes(nodeName)) {
        continue;
      }
    }

    switch (node.nodeType) {
      case Node.DOCUMENT_NODE:
        mapTextNodes(node, f);
        break;
      case Node.ELEMENT_NODE:
        mapTextNodes(node, f);
        break;
      case Node.TEXT_NODE:
        node.textContent = f(node.textContent);
        break;
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function transliterate(text) {
  simple = new Map();

  simple.set('szcz', 'щ')
  simple.set('sz', 'ш')
  simple.set('dż', 'дж')
  simple.set('dz', 'дз')
  simple.set('cz', 'ч')
  simple.set('ch', 'х')
  simple.set('ć', 'ць')
  simple.set('b', 'б')
  simple.set('d', 'д')
  simple.set('h', 'х')
  simple.set('ń', 'нь')
  simple.set('c', 'ц')
  simple.set('k', 'к')
  simple.set('p', 'п')
  simple.set('t', 'т')
  simple.set('ł', 'л')
  simple.set('r', 'р')
  simple.set('w', 'в')
  simple.set('f', 'ф')
  simple.set('m', 'м')
  simple.set('s', 'с')
  simple.set('z', 'з')
  simple.set('g', 'г')
  simple.set('n', 'н')
  simple.set('ś', 'шь')
  simple.set('ż', 'ж')
  simple.set('ź', 'з')
  simple.set('ia', 'я')
  simple.set('ie', 'е')
  simple.set('io', 'ё')
  simple.set('ió', 'ю')
  simple.set('iu', 'ю')
  simple.set('u', 'у')
  simple.set('ó', 'у')
  simple.set('ja', 'я')
  simple.set('je', 'е')
  simple.set('jo', 'ё')
  simple.set('jó', 'ю')
  simple.set('ju', 'ю')
  simple.set('la', 'ля')
  simple.set('le', 'ле')
  simple.set('li', 'ли')
  simple.set('lo', 'лё')
  simple.set('ló', 'лю')
  simple.set('lu', 'лю')
  simple.set('l', 'ль')
  simple.set('y', 'ы')
  simple.set('rz', 'ж')
  // j в "прочих случаях" (после согласных и на конце слов)
  simple.set('j', 'й')

  // Буквы ą и ę = o и e соответственно + носовая согласная (m перед b или p, иначе n)
  text = text.
    replace(/ą([bp])/gu, 'ом$1').
    replace(/ę([bp])/gu, 'ем$1').
    replace(/ą([^\p{L}])/gu, 'о$1').
    replace(/ę([^\p{L}])/gu, 'е$1').
    replace(/ą/gu, 'он').
    replace(/ę/gu, 'ен')

  // j с гласными после согласной
  text = text.
    replace(/([bcćhdfgjklłmnńprsśztwzźBCĆHDFGJKLŁMNŃPRSŚZTWZŹ])(j[aąeęoóu])/gu, '$1ъ$2')

  // rz перед и после глухих
  text = text.
    replace(/((ch)|k|p|t)rz/gui, '$1ш').
    replace(/rz((ch)|k|p|t)/, 'ш$1')

  // Простые замены
  for (let [k, v] of simple.entries()) {
    text = text.replace(new RegExp(k, 'gu'), v);
    text = text.replace(new RegExp(capitalizeFirstLetter(k), 'gu'), capitalizeFirstLetter(v));
    text = text.replace(new RegExp(k.toUpperCase(), 'gu'), v.toUpperCase());
  }

  // В начале слова e → э, иначе e → е
  text = text.
    replace(/([^\p{L}])e/gu, '$1э').
    replace(/([^\p{L}])E/gu, '$1Э')
  text = text.
    replace(/e/gu, 'е').
    replace(/E/gu, 'Е')

  return text;
}

function transliterateDocument() {
  mapTextNodes(document, transliterate);
}

transliterateDocument();

console.log(transliterate(`
  Eugeniusz
  Informacja

  Najnowsze

  Labje

  Dębicki
  Bądkowo

  Emil
  Lacaz
`))
