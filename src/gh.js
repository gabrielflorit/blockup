var GitHub = require('github-api')

module.exports = function() {

  console.log('ghing')

  // unauthenticated client
  var gh = new GitHub()

  var gist = gh.getGist() // not a gist yet
  var data = {
     public: true,
     description: 'My first gist',
     files: {
        'file1.txt': {
           content: "Aren't gists great!"
        }
     }
  }

  gist.create(data)
    .then(function(httpResponse) {
       var gistJson = httpResponse.data

       // Callbacks too
       gist.read(function(err, gist, xhr) {

         console.log(gist)
         console.log(xhr)

          // if no error occurred then err == null
          // gistJson == httpResponse.data
          // xhr == httpResponse
       })
    })
    .catch(function(err) {
      console.log(err)
    })

}
