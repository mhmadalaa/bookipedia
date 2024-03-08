## How you can setup your server to access through http(s) secure connection?

### What is https? or what is the difference between http and https
HTTPS is a secure version of the HTTP protocol that uses the SSL/TLS protocol for encryption and authentication.\
\
so, it mains if you need to configure your server to use http(s) you need to configure SSL/TLS or now exactly what is that?\
so, the question is what is SSL/TLS?\
SSL: secure socket layer\
TLS: transport layer security\
https://www.cloudflare.com/learning/ssl/what-is-ssl/ \
\
Ok, we now know that it's a security protocol, how we can obtain that in our server?\
there is a thing called ssl certificates that provide a certificate for each domain\
to gurantee that it's a trusted website across clients/web-browsers\
https://www.youtube.com/watch?v=r1nJT63BFQ0 \
\
OK, we now know there is a certificate we need in our domain and certificate authority \
and we need something to manage all of that, the creation of certificate keys and authority with clients\
there is some tools to do that\
https://letsencrypt.org/getting-started/ \
https://certbot.eff.org/instructions?ws=other&os=ubuntufocal&tab=standard \
https://zerossl.com/?fpr=lam50&gad_source=1&gclid=CjwKCAiAlcyuBhBnEiwAOGZ2S-H0qnBedjl8YWr03IGAg_E5tDqLdCMfNjXfSOV5bDeXbqapcDhZExoCGXIQAvD_BwE \
\
That's a global tools for any application, but unfortunatly most of these tools need a webserver like (nginx, apache, ..) to apply that 
or to configure it manually\
\
but for our usecase (nodejs/expressjs) there is such a simple tool to handle that, which an npm package called `greenlock-express` \
https://www.npmjs.com/package/greenlock-express
