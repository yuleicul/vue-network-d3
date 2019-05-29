// const axios = require('axios')

// axios.get('https://www.google.com/complete/search?q=iphone%20vs%20&cp=10&client=psy-ab&xssi=t&gs_ri=gws-wiz&hl=zh-CN&authuser=0&psi=fCnuXM6vFaCTr7wPtJSCmAQ.1559112063732&ei=fCnuXM6vFaCTr7wPtJSCmAQ')
//  .then(response => {
//    console.log(response)
//  })
//  .catch(err => {
//    console.log(err)
//  })

import jsonpFetch from './jsonpFetch.js'

function getResponse(query) {
  return jsonpFetch('//suggestqueries.google.com/complete/search?client=firefox&q=' + encodeURIComponent(query));
}

console.log(getResponse('iphone'))